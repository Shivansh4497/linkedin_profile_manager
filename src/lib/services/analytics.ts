import { prisma } from "@/lib/db";

// ============================================
// Types
// ============================================

export interface AnalyticsData {
    totals: {
        posts: number;
        impressions: number;
        likes: number;
        comments: number;
        shares: number;
    };
    averages: {
        impressionsPerPost: number;
        engagementRate: number;
        likesPerPost: number;
        commentsPerPost: number;
    };
    followers: {
        current: number;
        change: number;
        changePercent: number;
        trend: TrendDirection;
    };
    engagement: {
        rate: number;
        trend: TrendDirection;
    };
    profileViews: {
        current: number;
        trend: TrendDirection;
    };
    searchAppearances: {
        current: number;
        trend: TrendDirection;
    };
    demographics: {
        jobTitles: DemographicItem[];
        companies: DemographicItem[];
        locations: DemographicItem[];
        industries: DemographicItem[];
    };
    topHashtags: HashtagMetric[];
}

export interface DemographicItem {
    value: string;
    percentage: number;
}

export interface HashtagMetric {
    hashtag: string;
    postsCount: number;
    totalImpressions: number;
    avgEngagement: number;
}

export type TrendDirection = "up" | "down" | "stable";

// ============================================
// Calculation Functions
// ============================================

/**
 * Calculate engagement rate from metrics
 * Formula: (likes + comments + shares) / impressions * 100
 */
export function calculateEngagementRate(
    likes: number,
    comments: number,
    shares: number,
    impressions: number
): number {
    if (impressions === 0) return 0;
    return ((likes + comments + shares) / impressions) * 100;
}

/**
 * Calculate change between two values
 */
export function calculateChange(current: number, previous: number): {
    change: number;
    changePercent: number;
} {
    const change = current - previous;
    const changePercent = previous === 0 ? 0 : (change / previous) * 100;
    return { change, changePercent };
}

/**
 * Detect trend direction from recent data points
 * Looks at the last N values and determines if trending up, down, or stable
 */
export function detectTrend(values: number[], threshold = 0.05): TrendDirection {
    if (values.length < 2) return "stable";

    // Calculate average change
    let totalChange = 0;
    for (let i = 1; i < values.length; i++) {
        if (values[i - 1] !== 0) {
            totalChange += (values[i] - values[i - 1]) / values[i - 1];
        }
    }
    const avgChange = totalChange / (values.length - 1);

    if (avgChange > threshold) return "up";
    if (avgChange < -threshold) return "down";
    return "stable";
}

// ============================================
// Aggregation Functions
// ============================================

/**
 * Aggregate all post metrics for a user
 */
export async function aggregatePostMetrics(userId: string): Promise<{
    totals: AnalyticsData["totals"];
    averages: AnalyticsData["averages"];
}> {
    const posts = await prisma.linkedInPost.findMany({
        where: { userId },
        select: {
            impressions: true,
            likes: true,
            comments: true,
            shares: true,
        },
    });

    const totals = posts.reduce(
        (acc, post) => ({
            posts: acc.posts + 1,
            impressions: acc.impressions + post.impressions,
            likes: acc.likes + post.likes,
            comments: acc.comments + post.comments,
            shares: acc.shares + post.shares,
        }),
        { posts: 0, impressions: 0, likes: 0, comments: 0, shares: 0 }
    );

    const postCount = totals.posts || 1; // Avoid division by zero

    const averages = {
        impressionsPerPost: Math.round(totals.impressions / postCount),
        engagementRate: calculateEngagementRate(
            totals.likes,
            totals.comments,
            totals.shares,
            totals.impressions
        ),
        likesPerPost: Math.round((totals.likes / postCount) * 10) / 10,
        commentsPerPost: Math.round((totals.comments / postCount) * 10) / 10,
    };

    return { totals, averages };
}

/**
 * Get follower analytics from snapshots
 */
export async function getFollowerAnalytics(userId: string): Promise<AnalyticsData["followers"]> {
    // Get recent snapshots (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshots = await prisma.analyticsSnapshot.findMany({
        where: {
            userId,
            date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: "asc" },
        select: { followers: true, date: true },
    });

    if (snapshots.length === 0) {
        // No snapshots - get from profile
        const profile = await prisma.linkedInProfile.findFirst({
            where: { userId },
            select: { followers: true },
        });

        return {
            current: profile?.followers || 0,
            change: 0,
            changePercent: 0,
            trend: "stable",
        };
    }

    const current = snapshots[snapshots.length - 1].followers;
    const oldest = snapshots[0].followers;
    const { change, changePercent } = calculateChange(current, oldest);
    const trend = detectTrend(snapshots.map((s) => s.followers));

    return { current, change, changePercent, trend };
}

/**
 * Get engagement trend from recent posts
 */
export async function getEngagementTrend(userId: string): Promise<AnalyticsData["engagement"]> {
    const posts = await prisma.linkedInPost.findMany({
        where: { userId },
        orderBy: { publishedAt: "desc" },
        take: 10,
        select: {
            impressions: true,
            likes: true,
            comments: true,
            shares: true,
        },
    });

    if (posts.length === 0) {
        return { rate: 0, trend: "stable" };
    }

    // Calculate engagement rate for each post
    const rates = posts.map((p) =>
        calculateEngagementRate(p.likes, p.comments, p.shares, p.impressions)
    );

    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    const trend = detectTrend(rates.reverse()); // Reverse to chronological order

    return { rate: avgRate, trend };
    return { rate: avgRate, trend };
}

/**
 * Get profile views and search appearances from recent snapshots
 */
export async function getDiscoveryMetrics(userId: string) {
    // Get recent snapshots (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshots = await prisma.analyticsSnapshot.findMany({
        where: {
            userId,
            date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: "asc" },
        select: { profileViews: true, searchAppearances: true },
    });

    if (snapshots.length === 0) {
        return {
            profileViews: { current: 0, trend: "stable" as TrendDirection },
            searchAppearances: { current: 0, trend: "stable" as TrendDirection },
        };
    }

    const currentViews = snapshots[snapshots.length - 1].profileViews || 0;
    const viewsTrend = detectTrend(snapshots.map(s => s.profileViews || 0));

    const currentSearch = snapshots[snapshots.length - 1].searchAppearances || 0;
    const searchTrend = detectTrend(snapshots.map(s => s.searchAppearances || 0));

    return {
        profileViews: { current: currentViews, trend: viewsTrend },
        searchAppearances: { current: currentSearch, trend: searchTrend },
    };
}

/**
 * Get aggregated audience demographics
 * Uses the most recent snapshot for each category value
 */
export async function getDemographics(userId: string) {
    // Get latest date first
    const lastEntry = await prisma.audienceDemographic.findFirst({
        where: { userId },
        orderBy: { date: "desc" },
        select: { date: true }
    });

    if (!lastEntry) {
        return {
            jobTitles: [],
            companies: [],
            locations: [],
            industries: []
        };
    }

    const demographics = await prisma.audienceDemographic.findMany({
        where: {
            userId,
            date: lastEntry.date
        },
        orderBy: { percentage: "desc" }
    });

    return {
        jobTitles: demographics.filter(d => d.category === "JOB_TITLE").map(d => ({ value: d.value, percentage: d.percentage })),
        companies: demographics.filter(d => d.category === "COMPANY").map(d => ({ value: d.value, percentage: d.percentage })),
        locations: demographics.filter(d => d.category === "LOCATION").map(d => ({ value: d.value, percentage: d.percentage })),
        industries: demographics.filter(d => d.category === "INDUSTRY").map(d => ({ value: d.value, percentage: d.percentage })),
    };
}

/**
 * Get top performing hashtags
 */
export async function getTopHashtags(userId: string, limit = 5): Promise<HashtagMetric[]> {
    const stats = await prisma.hashtagStat.findMany({
        where: { userId },
        orderBy: { totalImpressions: "desc" },
        take: limit,
        select: {
            hashtag: true,
            postsCount: true,
            totalImpressions: true,
            avgEngagement: true
        }
    });

    // Ensure types match simple JSON return
    return stats.map(s => ({
        hashtag: s.hashtag,
        postsCount: s.postsCount,
        totalImpressions: s.totalImpressions,
        avgEngagement: s.avgEngagement || 0
    }));
}

/**
 * Get complete analytics for a user
 */
export async function getAnalytics(userId: string): Promise<AnalyticsData> {
    const [postMetrics, followers, engagement, discovery, demographics, topHashtags] = await Promise.all([
        aggregatePostMetrics(userId),
        getFollowerAnalytics(userId),
        getEngagementTrend(userId),
        getDiscoveryMetrics(userId),
        getDemographics(userId),
        getTopHashtags(userId)
    ]);

    return {
        totals: postMetrics.totals,
        averages: postMetrics.averages,
        followers,
        engagement,
        profileViews: discovery.profileViews,
        searchAppearances: discovery.searchAppearances,
        demographics,
        topHashtags
    };
}
