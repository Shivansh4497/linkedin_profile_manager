
import { chromium, type Page, type Locator } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

interface ScrapedProfile {
    name: string;
    headline: string;
    followers: number;
    connections: number;
}

interface ScrapedPost {
    content: string;
    impressions: number;
    likes: number;
    comments: number;
    reposts: number;
    publishedDate: string; // ISO date string
    scrapedComments: ScrapedComment[];
    urn: string;
    demographics?: ScrapedDemographic[];
}

interface ScrapedComment {
    commenterName: string;
    commenterHeadline: string;
    text: string;
}

interface ScrapedAnalytics {
    profileViews: number;
    searchAppearances: number;
}

interface ScrapedDemographic {
    category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY";
    value: string;
    percentage: number;
}

/**
 * LinkedIn Sync - Scrapes profile AND posts, saves to database
 */
async function syncLinkedInData() {
    console.log("🔄 Starting LinkedIn full sync...");

    if (!fs.existsSync(STORAGE_STATE_PATH)) {
        throw new Error("No session found. Run 'pnpm linkedin:login' first.");
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL not set. Check your .env file.");
    }

    const browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
        viewport: { width: 1280, height: 900 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    });

    const page = await context.newPage();

    try {
        // 1. Scrape profile
        console.log("\n📊 Scraping profile...");
        const profile = await scrapeProfile(page);

        // 2. Scrape posts (including comments)
        console.log("\n📝 Scraping posts...");
        const posts = await scrapePosts(page);

        // 3. Scrape analytics (views, search appearances)
        console.log("\n📈 Scraping analytics summary...");
        const analytics = await scrapeAnalyticsSummary(page);

        // 4. Scrape demographics
        console.log("\n👥 Scraping demographics...");
        const demographics = await scrapeDemographics(page);

        // 5. Scrape detailed analytics for top 5 recent posts
        console.log("\n📊 Scraping post-level analytics (Top 5)...");
        for (let i = 0; i < Math.min(posts.length, 5); i++) {
            const post = posts[i];
            console.log(`   Scraping analytics for post: ${post.urn}`);
            const postDemographics = await scrapePostAnalytics(page, post.urn);
            if (postDemographics.length > 0) {
                post.demographics = postDemographics;
            }
        }

        // 6. Save to database
        console.log("\n💾 Saving to database...");
        await saveToDatabase(profile, posts, analytics, demographics, databaseUrl);

        console.log("\n✅ Full sync complete!");
        console.log(`   Profile: ${profile.name} - ${profile.followers} followers`);
        console.log(`   Posts scraped: ${posts.length}`);

    } finally {
        await browser.close();
    }
}

async function scrapeProfile(page: Page): Promise<ScrapedProfile> {
    await page.goto("https://www.linkedin.com/in/me/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    let name = "";
    let headline = "";
    let followers = 0;
    let connections = 0;

    try {
        const nameEl = await page.locator("h1").first();
        name = ((await nameEl.textContent()) || "").trim();
    } catch { /* ignore */ }

    try {
        const headlineEl = await page.locator(".text-body-medium").first();
        headline = ((await headlineEl.textContent()) || "").trim();
    } catch { /* ignore */ }

    const pageContent = await page.content();

    const followerMatch = pageContent.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?[KMB]?)\s*followers?/i);
    if (followerMatch) {
        followers = parseNumber(followerMatch[1]);
    }

    const connectionMatch = pageContent.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?[KMB]?)\s*connections?/i);
    if (connectionMatch) {
        connections = parseNumber(connectionMatch[1]);
    }

    console.log(`   Name: ${name}`);
    console.log(`   Followers: ${followers}`);
    console.log(`   Connections: ${connections}`);

    return { name, headline, followers, connections };
}

async function scrapePosts(page: Page): Promise<ScrapedPost[]> {
    // Navigate to activity/posts page
    await page.goto("https://www.linkedin.com/in/me/recent-activity/all/", {
        waitUntil: "domcontentloaded",
        timeout: 30000
    });
    await page.waitForTimeout(4000);

    // Scroll to load more posts
    for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(1500);
    }

    const posts: ScrapedPost[] = [];

    // Find all post containers using data-urn attribute
    const postContainers = await page.locator('[data-urn*="activity"]').all();
    console.log(`   Found ${postContainers.length} activity items`);

    for (let i = 0; i < Math.min(postContainers.length, 15); i++) {
        const container = postContainers[i];

        try {
            // Get post text content
            let content = "";
            try {
                // Try multiple selectors for post content
                const contentSelectors = [
                    ".feed-shared-update-v2__description",
                    ".break-words",
                    ".feed-shared-text",
                    "[data-test-id='main-feed-activity-card__commentary']"
                ];

                for (const selector of contentSelectors) {
                    try {
                        const textEl = container.locator(selector).first();
                        const text = await textEl.textContent({ timeout: 1000 });
                        if (text && text.trim().length > 20) {
                            content = text.trim().slice(0, 500);
                            break;
                        }
                    } catch { /* try next */ }
                }
            } catch { /* no text */ }

            if (!content || content.length < 20) continue;

            // Extract data-urn
            const urn = await container.getAttribute("data-urn") || "";

            // Extract metrics from container HTML
            const containerHtml = await container.innerHTML();

            // Extract likes/reactions
            let likes = 0;
            const likesPatterns = [
                /(\d+)\s*(?:likes?|reactions?)/i,
                /aria-label="(\d+)\s*(?:likes?|reactions?)"/i,
                /"numLikes":(\d+)/,
                /(\d+)\s*reaction/i
            ];
            for (const pattern of likesPatterns) {
                const match = containerHtml.match(pattern);
                if (match) {
                    likes = parseInt(match[1], 10);
                    break;
                }
            }

            // Extract comments
            let comments = 0;
            const commentsPatterns = [
                /(\d+)\s*comments?/i,
                /aria-label="(\d+)\s*comments?"/i,
                /"numComments":(\d+)/
            ];
            for (const pattern of commentsPatterns) {
                const match = containerHtml.match(pattern);
                if (match) {
                    comments = parseInt(match[1], 10);
                    break;
                }
            }

            // Extract reposts
            let reposts = 0;
            const repostsPatterns = [
                /(\d+)\s*reposts?/i,
                /aria-label="(\d+)\s*reposts?"/i,
                /"numShares":(\d+)/
            ];
            for (const pattern of repostsPatterns) {
                const match = containerHtml.match(pattern);
                if (match) {
                    reposts = parseInt(match[1], 10);
                    break;
                }
            }

            // Extract impressions (if shown)
            let impressions = 0;
            const impressionsPatterns = [
                /(\d+)\s*impressions?/i,
                /(\d+)\s*views?/i,
                /aria-label="(\d+)\s*impressions?"/i
            ];
            for (const pattern of impressionsPatterns) {
                const match = containerHtml.match(pattern);
                if (match) {
                    impressions = parseInt(match[1], 10);
                    break;
                }
            }

            // Extract publish date from LinkedIn's time format
            let publishedDate = new Date().toISOString();
            try {
                // The date is in .update-components-actor__sub-description
                // Format: "6mo • ... 6 months ago • Visible to..."
                const timeEl = container.locator(".update-components-actor__sub-description").first();
                const timeText = await timeEl.textContent({ timeout: 1000 });

                if (timeText) {
                    const now = new Date();

                    // Match patterns: 1d, 5d, 2w, 3mo, 1yr, 3h, 30m
                    if (/(\d+)yr/i.test(timeText)) {
                        const years = parseInt(timeText.match(/(\d+)yr/i)![1], 10);
                        now.setFullYear(now.getFullYear() - years);
                        publishedDate = now.toISOString();
                    } else if (/(\d+)mo/i.test(timeText)) {
                        const months = parseInt(timeText.match(/(\d+)mo/i)![1], 10);
                        now.setMonth(now.getMonth() - months);
                        publishedDate = now.toISOString();
                    } else if (/(\d+)w/i.test(timeText)) {
                        const weeks = parseInt(timeText.match(/(\d+)w/i)![1], 10);
                        now.setDate(now.getDate() - weeks * 7);
                        publishedDate = now.toISOString();
                    } else if (/(\d+)d/i.test(timeText)) {
                        const days = parseInt(timeText.match(/(\d+)d/i)![1], 10);
                        now.setDate(now.getDate() - days);
                        publishedDate = now.toISOString();
                    } else if (/(\d+)h/i.test(timeText)) {
                        const hours = parseInt(timeText.match(/(\d+)h/i)![1], 10);
                        now.setHours(now.getHours() - hours);
                        publishedDate = now.toISOString();
                    } else if (/(\d+)m\b/i.test(timeText)) {
                        const mins = parseInt(timeText.match(/(\d+)m\b/i)![1], 10);
                        now.setMinutes(now.getMinutes() - mins);
                        publishedDate = now.toISOString();
                    }
                }
            } catch { /* use current date */ }

            const scrapedComments: ScrapedComment[] = [];
            // TODO: Implement actual comment scraping by clicking 'Comments' button
            // Keeping it empty for now to ensure stability of the main sync first

            posts.push({
                content,
                impressions,
                likes,
                comments,
                reposts,
                publishedDate,
                scrapedComments,
                urn
            });

            console.log(`   Post ${i + 1}: "${content.slice(0, 40)}..." - ${likes} likes, ${comments} comments`);

        } catch (error) {
            // Skip malformed posts
            console.log(`   Skipping post ${i + 1}: extraction error`);
        }
    }

    return posts;
}

function parseNumber(str: string): number {
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

async function scrapeAnalyticsSummary(page: Page): Promise<ScrapedAnalytics> {
    try {
        // Try the dashboard page first as it's more standard for non-creators
        await page.goto("https://www.linkedin.com/dashboard/", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(3000);

        let profileViews = 0;
        let searchAppearances = 0;

        // Check if we are on the dashboard or redirected
        const url = page.url();

        if (url.includes("dashboard")) {
            const content = await page.content();
            // "32 who viewed your profile"
            // "12 search appearances"
            const viewsMatch = content.match(/(\d+(?:,\d+)*)\s*who viewed your profile/i);
            if (viewsMatch) profileViews = parseNumber(viewsMatch[1]);

            const searchMatch = content.match(/(\d+(?:,\d+)*)\s*search appearances/i);
            if (searchMatch) searchAppearances = parseNumber(searchMatch[1]);
        } else {
            // Fallback to Creator Analytics
            await page.goto("https://www.linkedin.com/analytics/creator/", { waitUntil: "domcontentloaded" });
            const content = await page.content();

            // "79 Profile viewers"
            const viewsMatch = content.match(/(\d+(?:,\d+)*)\s*Profile viewers?/i);
            if (viewsMatch) profileViews = parseNumber(viewsMatch[1]);

            const searchMatch = content.match(/(\d+(?:,\d+)*)\s*Search appearances?/i);
            if (searchMatch) searchAppearances = parseNumber(searchMatch[1]);
        }

        console.log(`   Profile Views: ${profileViews}`);
        console.log(`   Search Appearances: ${searchAppearances}`);

        return { profileViews, searchAppearances };
    } catch (e) {
        console.error("Error scraping analytics:", e);
        return { profileViews: 0, searchAppearances: 0 };
    }
}

async function scrapeDemographics(page: Page): Promise<ScrapedDemographic[]> {
    try {
        await page.goto("https://www.linkedin.com/analytics/creator/audience/", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(4000);

        const demographics: ScrapedDemographic[] = [];

        // 1. Try to find the "Top demographics of followers" summary list
        const lists = await page.locator("ul").all();

        for (const list of lists) {
            const text = await list.innerText();
            if (text.includes("With this experience level") || text.includes("From this location")) {
                // This is the one
                const items = text.split("\n");
                // The split might separate lines. We need to chunk them.
                // Or better, iterate LIs if possible
                const lis = await list.locator("li").all();
                for (const li of lis) {
                    const liText = await li.innerText();
                    const lines = liText.split("\n").filter(l => l.trim().length > 0);
                    // Expected: ["Senior", "With this experience level", "39%"]
                    if (lines.length >= 3) {
                        const value = lines[0].trim();
                        const label = lines[1].trim();
                        const pctStr = lines[2].replace("%", "").trim();

                        let category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY" | null = null;
                        if (label.includes("experience level")) category = "JOB_TITLE"; // Mapping experience to job title roughly, or I should add EXPERIENCE_LEVEL
                        else if (label.includes("location")) category = "LOCATION";
                        else if (label.includes("companies of this size")) category = "COMPANY"; // Mapping size to company
                        else if (label.includes("industry")) category = "INDUSTRY";

                        if (category) {
                            demographics.push({
                                category,
                                value,
                                percentage: parseFloat(pctStr)
                            });
                        }
                    }
                }
                if (demographics.length > 0) break;
            }
        }

        // 2. If that failed, try the section headers approach (legacy/full view)
        if (demographics.length === 0) {
            const extractSection = async (headerText: string, category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY") => {
                try {
                    const sectionHeader = page.getByText(headerText).first();
                    if (await sectionHeader.isVisible()) {
                        const container = sectionHeader.locator("xpath=../..").locator("ul").first();
                        const items = await container.locator("li").all();

                        for (const item of items) {
                            const text = await item.innerText();
                            const lines = text.split("\n").filter(l => l.trim().length > 0);
                            if (lines.length >= 2) {
                                const value = lines[0].trim();
                                const pctStr = lines.find(l => l.includes("%"))?.replace("%", "");
                                if (pctStr) {
                                    demographics.push({
                                        category,
                                        value,
                                        percentage: parseFloat(pctStr)
                                    });
                                }
                            }
                        }
                    }
                } catch (e) { /* ignore */ }
            };

            await extractSection("Top job titles", "JOB_TITLE");
            await extractSection("Top industries", "INDUSTRY");
            await extractSection("Top locations", "LOCATION");
            await extractSection("Top companies", "COMPANY");
        }

        console.log(`   Found ${demographics.length} demographic data points`);
        return demographics;
    } catch (e) {
        console.error("Error scraping demographics:", e);
        return [];
    }
}

async function scrapePostAnalytics(page: Page, urn: string): Promise<ScrapedDemographic[]> {
    try {
        // Use the correct URL format that works (discovered via debugging)
        const analyticsUrl = `https://www.linkedin.com/analytics/post-summary/${urn}/`;
        await page.goto(analyticsUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForTimeout(5000);

        // Scroll to load lazy content
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000);

        // Try to click "Show all" if available
        try {
            const showAllBtn = page.getByText("Show all").first();
            if (await showAllBtn.isVisible({ timeout: 2000 })) {
                await showAllBtn.click();
                await page.waitForTimeout(2000);
            }
        } catch { /* ignore */ }

        const demographics: ScrapedDemographic[] = [];

        // Based on debugging, each demographic row is in:
        // LI.member-analytics-addon-meter-bars-chart__row
        // Format: "Value\nDescription\nPercentage%"
        // Examples:
        //   "Greater Bengaluru Area\nFrom this location\n40%"
        //   "Senior\nWith this experience level\n40%"
        //   "10,001+ employees\nAt companies of this size\n29%"

        const rows = await page.locator(".member-analytics-addon-meter-bars-chart__row").all();
        console.log(`       Found ${rows.length} demographic rows`);

        for (const row of rows) {
            try {
                const text = await row.innerText();
                const lines = text.split("\n").map(l => l.trim()).filter(l => l);

                if (lines.length >= 2) {
                    const value = lines[0]; // e.g., "Greater Bengaluru Area"
                    const description = lines[1]; // e.g., "From this location"
                    const pctLine = lines.find(l => l.includes("%"));

                    if (pctLine) {
                        const percentage = parseFloat(pctLine.replace("%", "").trim());

                        // Determine category based on description
                        let category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY" | null = null;

                        if (description.includes("location")) {
                            category = "LOCATION";
                        } else if (description.includes("experience level") || description.includes("job title")) {
                            category = "JOB_TITLE";
                        } else if (description.includes("companies") || description.includes("company size")) {
                            category = "COMPANY";
                        } else if (description.includes("industry")) {
                            category = "INDUSTRY";
                        }

                        if (category && value && percentage) {
                            demographics.push({
                                category,
                                value,
                                percentage
                            });
                        }
                    }
                }
            } catch (e) {
                // Skip this row if parsing fails
            }
        }

        console.log(`       Extracted ${demographics.length} demographic items`);

        // Filter duplicates
        const uniqueDemographics = demographics.filter((d, index, self) =>
            index === self.findIndex((t) => (
                t.category === d.category && t.value === d.value
            ))
        );
        return uniqueDemographics;

    } catch (e) {
        console.error(`       Error scraping post analytics for ${urn}:`, e);
        return [];
    }
}

async function saveToDatabase(
    profile: ScrapedProfile,
    posts: ScrapedPost[],
    analytics: ScrapedAnalytics,
    demographics: ScrapedDemographic[],
    databaseUrl: string
) {
    const pool = new Pool({ connectionString: databaseUrl });

    try {
        // Get current user
        const userResult = await pool.query("SELECT id FROM users LIMIT 1");
        if (userResult.rows.length === 0) {
            throw new Error("No user found in database.");
        }
        const userId = userResult.rows[0].id;
        console.log(`   User ID: ${userId}`);

        // Update profile
        const existingProfile = await pool.query(
            "SELECT id FROM li_profiles WHERE user_id = $1",
            [userId]
        );

        if (existingProfile.rows.length > 0) {
            await pool.query(`
        UPDATE li_profiles SET
          name = $2, headline = $3, followers = $4, connections = $5,
          fetched_at = NOW(), updated_at = NOW()
        WHERE user_id = $1
      `, [userId, profile.name, profile.headline, profile.followers, profile.connections]);
        } else {
            await pool.query(`
        INSERT INTO li_profiles (id, user_id, linkedin_id, name, headline, followers, connections, fetched_at, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, 'scraped', $2, $3, $4, $5, NOW(), NOW(), NOW())
      `, [userId, profile.name, profile.headline, profile.followers, profile.connections]);
        }
        console.log("   ✓ Profile saved");

        // Save posts with UPSERT (update if exists, insert if new)
        let newPosts = 0;
        let updatedPosts = 0;
        let metricsSnapshots = 0;
        let hashtagUpdates = 0;
        let commentsSaved = 0;

        for (const post of posts) {
            // Create a stable ID based on first 50 chars of content
            const contentHash = Buffer.from(post.content.slice(0, 50)).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
            const linkedinPostId = `scraped-${contentHash}`;

            // Check if post exists
            const existing = await pool.query(
                "SELECT id, impressions, likes, comments, shares FROM li_posts WHERE linkedin_post_id = $1",
                [linkedinPostId]
            );

            let dbPostId: string;

            if (existing.rows.length > 0) {
                dbPostId = existing.rows[0].id;
                const prev = existing.rows[0];

                // UPDATE existing post
                await pool.query(`
                    UPDATE li_posts SET
                        impressions = $2, likes = $3, comments = $4, shares = $5,
                        fetched_at = NOW(), updated_at = NOW()
                    WHERE linkedin_post_id = $1
                `, [linkedinPostId, post.impressions, post.likes, post.comments, post.reposts]);
                updatedPosts++;

                // Deltas
                const impressionsDelta = post.impressions - (prev.impressions || 0);
                const likesDelta = post.likes - (prev.likes || 0);
                const commentsDelta = post.comments - (prev.comments || 0);
                const sharesDelta = post.reposts - (prev.shares || 0);

                await pool.query(`
                    INSERT INTO post_metrics_history 
                        (id, post_id, date, impressions, likes, comments, shares,
                         impressions_delta, likes_delta, comments_delta, shares_delta, created_at)
                    VALUES (gen_random_uuid(), $1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
                    ON CONFLICT (post_id, date) DO UPDATE SET
                        impressions = $2, likes = $3, comments = $4, shares = $5,
                        impressions_delta = $6, likes_delta = $7, comments_delta = $8, shares_delta = $9
                `, [dbPostId, post.impressions, post.likes, post.comments, post.reposts,
                    impressionsDelta, likesDelta, commentsDelta, sharesDelta]);
                metricsSnapshots++;

            } else {
                // INSERT new post
                const insertResult = await pool.query(`
                    INSERT INTO li_posts (id, user_id, linkedin_post_id, content, post_type, published_at, impressions, likes, comments, shares, fetched_at, created_at, updated_at)
                    VALUES (gen_random_uuid(), $1, $2, $3, 'TEXT', $4, $5, $6, $7, $8, NOW(), NOW(), NOW())
                    RETURNING id
                `, [userId, linkedinPostId, post.content, post.publishedDate, post.impressions, post.likes, post.comments, post.reposts]);
                dbPostId = insertResult.rows[0].id;
                newPosts++;

                await pool.query(`
                    INSERT INTO post_metrics_history 
                        (id, post_id, date, impressions, likes, comments, shares, created_at)
                    VALUES (gen_random_uuid(), $1, CURRENT_DATE, $2, $3, $4, $5, NOW())
                    ON CONFLICT (post_id, date) DO NOTHING
                `, [dbPostId, post.impressions, post.likes, post.comments, post.reposts]);
                metricsSnapshots++;
            }

            // --- Save Hashtags ---
            const hashtags = (post.content.match(/#[\w\u0590-\u05ff]+/g) || [])
                .map(t => t.toLowerCase());

            for (const tag of hashtags) {
                const engagement = post.likes + post.comments + post.reposts;
                const rate = post.impressions > 0 ? engagement / post.impressions : 0;

                await pool.query(`
                    INSERT INTO hashtag_stats (id, user_id, hashtag, posts_count, total_impressions, total_likes, avg_engagement, last_used_at, created_at, updated_at)
                    VALUES (gen_random_uuid(), $1, $2, 1, $3, $4, $5, $6, NOW(), NOW())
                    ON CONFLICT (user_id, hashtag) DO UPDATE SET
                        posts_count = hashtag_stats.posts_count + 1,
                        total_impressions = hashtag_stats.total_impressions + $3,
                        total_likes = hashtag_stats.total_likes + $4,
                        avg_engagement = (hashtag_stats.avg_engagement * hashtag_stats.posts_count + $5) / (hashtag_stats.posts_count + 1),
                        last_used_at = $6,
                        updated_at = NOW()
                `, [userId, tag, post.impressions, post.likes, rate, post.publishedDate]);
                hashtagUpdates++;
            }

            // --- Save Comments ---
            if (post.scrapedComments && post.scrapedComments.length > 0) {
                for (const comment of post.scrapedComments) {
                    const existingComment = await pool.query(
                        "SELECT id FROM post_comments WHERE post_id = $1 AND commenter_name = $2 AND comment_text = $3",
                        [dbPostId, comment.commenterName, comment.text]
                    );

                    if (existingComment.rows.length === 0) {
                        await pool.query(`
                            INSERT INTO post_comments (id, post_id, commenter_name, commenter_headline, comment_text, created_at)
                            VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
                        `, [dbPostId, comment.commenterName, comment.commenterHeadline, comment.text]);
                        commentsSaved++;
                    }
                }
            }

            // Save Post Demographics
            if (post.demographics && post.demographics.length > 0) {
                // Clear old for this post
                await pool.query("DELETE FROM post_demographics WHERE post_id = $1", [dbPostId]);

                for (const pd of post.demographics) {
                    await pool.query(`
                        INSERT INTO post_demographics (id, post_id, category, value, percentage, created_at)
                        VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
                    `, [dbPostId, pd.category, pd.value, pd.percentage]);
                }
            }
        }
        console.log(`   ✓ Posts: ${newPosts} new, ${updatedPosts} updated`);
        console.log(`   ✓ Metrics snapshots: ${metricsSnapshots}`);
        console.log(`   ✓ Hashtag updates: ${hashtagUpdates}`);
        if (commentsSaved > 0) console.log(`   ✓ Comments: ${commentsSaved}`);

        // Save Demographics
        let demogSaved = 0;
        for (const demog of demographics) {
            await pool.query(`
                INSERT INTO audience_demographics (id, user_id, date, category, value, percentage, created_at)
                VALUES (gen_random_uuid(), $1, CURRENT_DATE, $2, $3, $4, NOW())
            `, [userId, demog.category, demog.value, demog.percentage]);
            demogSaved++;
        }
        console.log(`   ✓ Demographics: ${demogSaved} entries`);

        // Save analytics snapshot
        const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
        const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
        const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);

        await pool.query(`
            INSERT INTO analytics_snapshots (id, user_id, date, followers, posts_count, total_impressions, total_engagements, profile_views, search_appearances, created_at)
            VALUES (gen_random_uuid(), $1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (user_id, date) DO UPDATE SET
                followers = $2, posts_count = $3, total_impressions = $4, total_engagements = $5,
                profile_views = $6, search_appearances = $7
        `, [userId, profile.followers, posts.length, totalImpressions, totalLikes + totalComments, analytics.profileViews, analytics.searchAppearances]);
        console.log("   ✓ Analytics snapshot saved (with views & search)");

    } finally {
        await pool.end();
    }
}

// Run if executed directly
syncLinkedInData().catch(console.error);
