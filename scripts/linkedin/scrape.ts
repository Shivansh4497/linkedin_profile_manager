import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

interface LinkedInAnalytics {
    scrapedAt: string;
    profile: {
        name: string;
        headline: string;
        followers: number;
        connections: number;
    };
    posts: PostMetrics[];
}

interface PostMetrics {
    content: string;
    impressions: number;
    likes: number;
    comments: number;
    reposts: number;
}

/**
 * LinkedIn Scraper - Fetches analytics data
 */
async function scrapeAnalytics(): Promise<LinkedInAnalytics> {
    console.log("🔍 Starting LinkedIn analytics scrape...");

    // Check for saved session
    if (!fs.existsSync(STORAGE_STATE_PATH)) {
        throw new Error("No session found. Run 'pnpm linkedin:login' first.");
    }

    // Launch browser with saved session
    const browser = await chromium.launch({
        headless: false // Run headed for debugging
    });

    const context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
        viewport: { width: 1280, height: 900 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    });

    const page = await context.newPage();

    try {
        // 1. Get profile stats
        console.log("📊 Fetching profile stats...");
        const profileStats = await getProfileStats(page);

        // 2. Get post analytics (skip for now, focus on profile)
        console.log("📝 Skipping post analytics for now...");
        const posts: PostMetrics[] = [];

        const analytics: LinkedInAnalytics = {
            scrapedAt: new Date().toISOString(),
            profile: profileStats,
            posts: posts
        };

        // Save to local file for backup
        const outputDir = path.join(__dirname, "data");
        fs.mkdirSync(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, `analytics-${Date.now()}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(analytics, null, 2));
        console.log("💾 Saved to:", outputPath);

        return analytics;

    } finally {
        await browser.close();
    }
}

async function getProfileStats(page: Page): Promise<{
    name: string;
    headline: string;
    followers: number;
    connections: number
}> {
    // Navigate to profile
    await page.goto("https://www.linkedin.com/in/me/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000); // Wait for dynamic content

    let name = "";
    let headline = "";
    let followers = 0;
    let connections = 0;

    // Get name
    try {
        const nameEl = await page.locator("h1").first();
        name = (await nameEl.textContent()) || "";
        name = name.trim();
        console.log("   Name:", name);
    } catch (e) {
        console.log("⚠️  Could not find name");
    }

    // Get headline
    try {
        const headlineEl = await page.locator(".text-body-medium").first();
        headline = (await headlineEl.textContent()) || "";
        headline = headline.trim();
        console.log("   Headline:", headline.slice(0, 50) + "...");
    } catch (e) {
        console.log("⚠️  Could not find headline");
    }

    // Get all text content and search for follower/connection patterns
    const pageContent = await page.content();

    // Find followers (common patterns: "1,234 followers" or "1.2K followers")
    const followerMatch = pageContent.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?[KMB]?)\s*followers?/i);
    if (followerMatch) {
        followers = parseNumber(followerMatch[1]);
        console.log("   Followers:", followers);
    } else {
        console.log("⚠️  Could not find follower count in page");
    }

    // Find connections
    const connectionMatch = pageContent.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?[KMB]?)\s*connections?/i);
    if (connectionMatch) {
        connections = parseNumber(connectionMatch[1]);
        console.log("   Connections:", connections);
    } else {
        // Try alternative: "500+" pattern
        const altMatch = pageContent.match(/(\d+\+?)\s*connections?/i);
        if (altMatch) {
            connections = parseInt(altMatch[1].replace("+", ""), 10);
            console.log("   Connections:", connections);
        } else {
            console.log("⚠️  Could not find connection count in page");
        }
    }

    return { name, headline, followers, connections };
}

function parseNumber(str: string): number {
    // Handle K, M, B suffixes
    const cleaned = str.replace(/,/g, "").trim();
    const match = cleaned.match(/^([\d.]+)([KMB])?$/i);

    if (!match) return 0;

    let num = parseFloat(match[1]);
    const suffix = match[2]?.toUpperCase();

    if (suffix === "K") num *= 1000;
    else if (suffix === "M") num *= 1000000;
    else if (suffix === "B") num *= 1000000000;

    return Math.round(num);
}

// Run if executed directly
scrapeAnalytics()
    .then((data) => {
        console.log("\n✅ Scrape complete!");
        console.log("📊 Results:");
        console.log(`   Name: ${data.profile.name}`);
        console.log(`   Followers: ${data.profile.followers}`);
        console.log(`   Connections: ${data.profile.connections}`);
    })
    .catch(console.error);

export { scrapeAnalytics };
export type { LinkedInAnalytics, PostMetrics };
