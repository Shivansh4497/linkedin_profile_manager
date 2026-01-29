import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

async function debugNetworkRequests() {
    console.log("🔍 Starting Network Request Debug...\n");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
        viewport: { width: 1280, height: 900 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    });

    const page = await context.newPage();
    const urn = "urn:li:activity:7355819364740198400";

    const capturedResponses: { url: string; body: string }[] = [];

    // Intercept all responses
    page.on("response", async (response) => {
        const url = response.url();

        // Filter for LinkedIn API calls that might contain analytics/demographics
        if (url.includes("linkedin.com") &&
            (url.includes("analytics") ||
                url.includes("voyager") ||
                url.includes("demographic") ||
                url.includes("member") ||
                url.includes("impression"))) {

            try {
                const contentType = response.headers()["content-type"] || "";
                if (contentType.includes("json") || contentType.includes("text")) {
                    const body = await response.text();
                    console.log(`📡 Captured: ${url.substring(0, 100)}...`);
                    capturedResponses.push({ url, body });
                }
            } catch (e) {
                // Some responses can't be read, ignore
            }
        }
    });

    try {
        console.log(`Navigating to: https://www.linkedin.com/analytics/post-summary/${urn}/\n`);
        await page.goto(`https://www.linkedin.com/analytics/post-summary/${urn}/`, {
            waitUntil: "networkidle",
            timeout: 30000
        });

        // Wait a bit more for any lazy-loaded requests
        await page.waitForTimeout(5000);

        // Scroll to trigger any additional loads
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000);

        console.log(`\n✅ Captured ${capturedResponses.length} relevant responses\n`);

        // Save all responses to a file for analysis
        fs.writeFileSync(
            "debug-network-responses.json",
            JSON.stringify(capturedResponses, null, 2)
        );
        console.log("💾 Saved all responses to debug-network-responses.json");

        // Also log a summary of what we found
        console.log("\n📊 Response Summary:");
        for (const resp of capturedResponses) {
            const preview = resp.body.substring(0, 200).replace(/\n/g, " ");
            console.log(`\n  URL: ${resp.url.substring(0, 80)}...`);
            console.log(`  Preview: ${preview}...`);

            // Check if this response contains demographic-like data
            if (resp.body.includes("Job title") ||
                resp.body.includes("Location") ||
                resp.body.includes("Industry") ||
                resp.body.includes("Company") ||
                resp.body.includes("percentage")) {
                console.log("  ⭐ MAY CONTAIN DEMOGRAPHIC DATA!");
            }
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await browser.close();
    }
}

debugNetworkRequests();
