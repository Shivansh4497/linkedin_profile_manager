import { chromium, type BrowserContext } from "playwright";
import * as fs from "fs";
import * as path from "path";

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

/**
 * LinkedIn Scraper - Login and save session
 * Run this once to authenticate and save cookies
 */
async function login() {
    console.log("🔐 Starting LinkedIn login flow...");

    // Ensure auth directory exists
    const authDir = path.dirname(STORAGE_STATE_PATH);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // Launch browser in headed mode for manual login
    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    });

    const page = await context.newPage();

    // Go to LinkedIn login
    await page.goto("https://www.linkedin.com/login");

    console.log("👆 Please log in manually in the browser window...");
    console.log("   Once logged in and on your feed, press Enter in this terminal.");

    // Wait for user to complete login
    await waitForEnter();

    // Verify we're logged in
    const currentUrl = page.url();
    if (!currentUrl.includes("linkedin.com/feed") && !currentUrl.includes("linkedin.com/mynetwork")) {
        console.log("⚠️  You don't appear to be logged in. Current URL:", currentUrl);
        console.log("   Please complete login and press Enter again.");
        await waitForEnter();
    }

    // Save session
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log("✅ Session saved to:", STORAGE_STATE_PATH);

    await browser.close();
    console.log("🎉 Login complete! You can now run the scraper.");
}

function waitForEnter(): Promise<void> {
    return new Promise((resolve) => {
        process.stdin.once("data", () => resolve());
    });
}

// Run if executed directly
login().catch(console.error);
