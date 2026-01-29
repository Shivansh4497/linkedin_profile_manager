"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendIndicator } from "./trend-indicator";
import {
    BarChart3,
    Eye,
    Users,
    TrendingUp,
    MessageSquare,
    ThumbsUp
} from "lucide-react";

interface AnalyticsData {
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
        trend: "up" | "down" | "stable";
    };
    engagement: {
        rate: number;
        trend: "up" | "down" | "stable";
    };
    profileViews: {
        current: number;
        trend: "up" | "down" | "stable";
    };
    searchAppearances: {
        current: number;
        trend: "up" | "down" | "stable";
    };
}

interface AnalyticsOverviewCardProps {
    data: AnalyticsData | null;
    isLoading?: boolean;
}

export function AnalyticsOverviewCard({ data, isLoading }: AnalyticsOverviewCardProps) {
    if (isLoading) {
        return (
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        Analytics Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-20 rounded-lg border border-white/10 bg-white/5 animate-pulse"
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        Analytics Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/2 p-6 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                            <BarChart3 className="h-6 w-6 text-purple-400" />
                        </div>
                        <h3 className="font-medium">No Analytics Yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Connect LinkedIn and sync data to see your analytics.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    Analytics Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Total Impressions */}
                    <MetricCard
                        icon={Eye}
                        label="Total Impressions"
                        value={data.totals.impressions.toLocaleString()}
                        subtext={`${data.averages.impressionsPerPost.toLocaleString()} avg/post`}
                        color="blue"
                    />

                    {/* Engagement Rate */}
                    <MetricCard
                        icon={TrendingUp}
                        label="Engagement Rate"
                        value={`${data.engagement.rate.toFixed(2)}%`}
                        trend={data.engagement.trend}
                        color="emerald"
                    />

                    {/* Profile Views */}
                    <MetricCard
                        icon={Users}
                        label="Profile Views"
                        value={data.profileViews ? data.profileViews.current.toLocaleString() : "0"}
                        trend={data.profileViews?.trend}
                        color="purple"
                    />

                    {/* Search Appearances */}
                    <MetricCard
                        icon={Eye}
                        label="Search Appearances"
                        value={data.searchAppearances ? data.searchAppearances.current.toLocaleString() : "0"}
                        trend={data.searchAppearances?.trend}
                        color="orange"
                    />

                    {/* Total Likes */}
                    <MetricCard
                        icon={ThumbsUp}
                        label="Total Likes"
                        value={data.totals.likes.toLocaleString()}
                        subtext={`${data.averages.likesPerPost} avg/post`}
                        color="pink"
                    />

                    {/* Total Comments */}
                    <MetricCard
                        icon={MessageSquare}
                        label="Total Comments"
                        value={data.totals.comments.toLocaleString()}
                        subtext={`${data.averages.commentsPerPost} avg/post`}
                        color="orange"
                    />
                </div>

                {/* Follower Growth */}
                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                <Users className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Follower Growth</p>
                                <p className="text-xl font-bold">{data.followers.current.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <TrendIndicator
                                trend={data.followers.trend}
                                value={data.followers.changePercent}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {data.followers.change >= 0 ? "+" : ""}{data.followers.change} last 30d
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface MetricCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    subtext?: string;
    trend?: "up" | "down" | "stable";
    color: "blue" | "emerald" | "pink" | "orange" | "purple";
}

function MetricCard({ icon: Icon, label, value, subtext, trend, color }: MetricCardProps) {
    const colorMap = {
        blue: "from-blue-500/20 to-blue-600/20 text-blue-400",
        emerald: "from-emerald-500/20 to-emerald-600/20 text-emerald-400",
        pink: "from-pink-500/20 to-pink-600/20 text-pink-400",
        orange: "from-orange-500/20 to-orange-600/20 text-orange-400",
        purple: "from-purple-500/20 to-purple-600/20 text-purple-400",
    };

    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${colorMap[color]}`}>
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs text-muted-foreground truncate">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-lg font-bold">{value}</p>
                {trend && <TrendIndicator trend={trend} showLabel={false} size="sm" />}
                {subtext && <span className="text-[10px] text-muted-foreground">{subtext}</span>}
            </div>
        </div>
    );
}
