import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

/**
 * Debug script - runs in headed mode to visually inspect date extraction
 */
async function debugDateExtraction() {
    console.log("🔍 Debug Mode - Visual inspection of LinkedIn dates...\n");

    if (!fs.existsSync(STORAGE_STATE_PATH)) {
        throw new Error("No session found. Run 'pnpm linkedin:login' first.");
    }

    // Launch browser in HEADED mode (visible)
    const browser = await chromium.launch({
        headless: false,
        slowMo: 500  // Slow down actions for visibility
    });

    const context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
        viewport: { width: 1400, height: 900 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    });

    const page = await context.newPage();

    // Navigate to activity page
    console.log("📍 Navigating to activity page...");
    await page.goto("https://www.linkedin.com/in/me/recent-activity/all/", {
        waitUntil: "domcontentloaded"
    });
    await page.waitForTimeout(4000);

    // Scroll to load posts
    console.log("📜 Scrolling to load posts...");
    for (let i = 0; i < 2; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(1500);
    }

    // Find all post containers
    const postContainers = await page.locator('[data-urn*="activity"]').all();
    console.log(`\n📝 Found ${postContainers.length} activity items\n`);

    for (let i = 0; i < Math.min(postContainers.length, 5); i++) {
        const container = postContainers[i];
        console.log(`\n--- Post ${i + 1} ---`);

        // Try various selectors for time/date
        const timeSelectors = [
            "time",
            ".feed-shared-actor__sub-description",
            "[class*='time']",
            "[class*='date']",
            ".update-components-actor__sub-description",
            ".feed-shared-actor__description",
            "span.visually-hidden",
        ];

        for (const selector of timeSelectors) {
            try {
                const elements = await container.locator(selector).all();
                for (const el of elements) {
                    const text = await el.textContent({ timeout: 500 });
                    const ariaLabel = await el.getAttribute("aria-label");
                    const datetime = await el.getAttribute("datetime");

                    if (text && text.trim()) {
                        console.log(`  [${selector}] text: "${text.trim().slice(0, 100)}"`);
                    }
                    if (ariaLabel) {
                        console.log(`  [${selector}] aria-label: "${ariaLabel}"`);
                    }
                    if (datetime) {
                        console.log(`  [${selector}] datetime: "${datetime}"`);
                    }
                }
            } catch { /* ignore */ }
        }

        // Also try to get the innerHTML to search for date patterns
        try {
            const html = await container.innerHTML();

            // Look for common date patterns
            const datePatterns = [
                /(\d+)d\b/gi,    // 5d
                /(\d+)w\b/gi,    // 2w
                /(\d+)mo\b/gi,   // 3mo
                /(\d+)h\b/gi,    // 3h
                /(\d+)m\b/gi,    // 30m
                /\d{4}-\d{2}-\d{2}/g,  // 2024-01-15
            ];

            for (const pattern of datePatterns) {
                const matches = html.match(pattern);
                if (matches) {
                    console.log(`  [regex] Found pattern: ${matches.join(", ")}`);
                }
            }
        } catch { /* ignore */ }
    }

    console.log("\n\n🔎 Browser is open - you can inspect the page manually.");
    console.log("   Press Ctrl+C to close when done.\n");

    // Keep browser open for manual inspection
    await new Promise(() => { }); // Wait forever until Ctrl+C
}

debugDateExtraction().catch(console.error);
