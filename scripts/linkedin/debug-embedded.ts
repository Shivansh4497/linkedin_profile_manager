import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

async function debugEmbeddedData() {
    console.log("🔍 Extracting Embedded JSON from LinkedIn Page...\n");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
        viewport: { width: 1280, height: 900 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    });

    const page = await context.newPage();
    const urn = "urn:li:activity:7355819364740198400";

    try {
        console.log(`Navigating to: https://www.linkedin.com/analytics/post-summary/${urn}/\n`);
        await page.goto(`https://www.linkedin.com/analytics/post-summary/${urn}/`, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        await page.waitForTimeout(5000);

        // Scroll to load lazy content
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000);

        // Method 1: Extract all script tags with type="application/json"
        const jsonScripts = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script[type="application/json"]');
            return Array.from(scripts).map(s => s.textContent || "");
        });
        console.log(`Found ${jsonScripts.length} JSON script tags`);

        // Method 2: Extract inline script tags that might contain data
        const inlineScripts = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script:not([src])');
            return Array.from(scripts)
                .map(s => s.textContent || "")
                .filter(s => s.includes("window.") || s.includes("__INITIAL_STATE__") || s.includes("data"));
        });
        console.log(`Found ${inlineScripts.length} inline scripts with data keywords`);

        // Method 3: Try to access React/Ember internal state
        const embeddedState = await page.evaluate(() => {
            // Common patterns for SPA data
            const dataPatterns = [
                (window as any).__INITIAL_STATE__,
                (window as any).__NEXT_DATA__,
                (window as any).applicationState,
                (window as any).__emberData__,
                (window as any).preloadedData,
            ];

            for (const data of dataPatterns) {
                if (data) return JSON.stringify(data);
            }
            return null;
        });

        if (embeddedState) {
            console.log("✅ Found embedded application state!");
            fs.writeFileSync("debug-embedded-state.json", embeddedState);
        }

        // Method 4: Extract visible text that looks like demographic data
        const visibleDemographics = await page.evaluate(() => {
            const results: { text: string; location: string }[] = [];

            // Look for elements containing percentage values
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                const text = (el as HTMLElement).innerText || "";
                if (text.match(/\d+%/) && text.length < 500) {
                    // Check if it's related to demographics
                    if (text.includes("Job") || text.includes("Location") ||
                        text.includes("Industry") || text.includes("Company") ||
                        text.includes("Seniority") || text.includes("Senior") ||
                        text.includes("Bengaluru") || text.includes("India")) {
                        results.push({
                            text: text.substring(0, 300),
                            location: `${el.tagName}.${el.className.split(' ').slice(0, 2).join('.')}`
                        });
                    }
                }
            }
            return results;
        });

        console.log(`\n📊 Found ${visibleDemographics.length} elements with demographic-like text:`);
        for (const item of visibleDemographics.slice(0, 10)) {
            console.log(`\n  Location: ${item.location}`);
            console.log(`  Text: ${item.text.replace(/\n/g, " | ").substring(0, 150)}...`);
        }

        // Save all findings
        const allData = {
            jsonScripts: jsonScripts.slice(0, 5).map(s => s.substring(0, 2000)),
            inlineScripts: inlineScripts.slice(0, 3).map(s => s.substring(0, 2000)),
            visibleDemographics,
            embeddedState: embeddedState ? "saved to debug-embedded-state.json" : "not found"
        };

        fs.writeFileSync("debug-extracted-data.json", JSON.stringify(allData, null, 2));
        console.log("\n💾 Saved all extracted data to debug-extracted-data.json");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await browser.close();
    }
}

debugEmbeddedData();
