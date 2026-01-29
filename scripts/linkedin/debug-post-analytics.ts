
import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "linkedin-session.json");

interface ScrapedDemographic {
    category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY";
    value: string;
    percentage: number;
}

async function debugPostAnalytics() {
    console.log("🔍 Starting Debug Post Analytics...");

    const browser = await chromium.launch({ headless: true }); // Headless true for speed, or false to watch
    const context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
        viewport: { width: 1280, height: 900 },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    });

    const page = await context.newPage();
    const urn = "urn:li:activity:7355819364740198400"; // The post used in testing

    try {
        console.log(`Navigate: https://www.linkedin.com/analytics/post-summary/${urn}/`);
        await page.goto(`https://www.linkedin.com/analytics/post-summary/${urn}/`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(5000);

        console.log(`Current URL: ${page.url()}`);
        console.log(`Page Title: ${await page.title()}`);
        await page.screenshot({ path: "debug-screenshot.png", fullPage: true });
        console.log("Taken screenshot: debug-screenshot.png");
        await page.waitForTimeout(3000);

        console.log("Scrolling to bottom...");
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000);

        try {
            const showAllBtn = page.getByText("Show all").first();
            if (await showAllBtn.isVisible({ timeout: 2000 })) {
                console.log("Found 'Show all' button, clicking...");
                await showAllBtn.click();
                await page.waitForTimeout(3000);
            } else {
                console.log("'Show all' button not visible");
            }
        } catch (e) { console.log("Show all error:", e); }

        const demographics: ScrapedDemographic[] = [];

        // Debug: Print all class names of lists to see what matches
        const lists = await page.locator("ul, li").all();
        console.log(`Total UL/LI elements: ${lists.length}`);

        // Try the selector
        const chartSelector = ".member-analytics-addon-color-bar-chart__chart";
        const chartContainers = await page.locator(chartSelector).all();
        console.log(`Found ${chartContainers.length} chart containers with selector: ${chartSelector}`);

        if (chartContainers.length === 0) {
            // Dump body HTML to see what classes are there
            const body = await page.content();
            fs.writeFileSync("debug-body.html", body);
            console.log("Dumped body to debug-body.html");
        }

        for (const container of chartContainers) {
            const containerText = await container.innerText();
            console.log("---------------------------------------------------");
            console.log("Container Text:", containerText.replace(/\n/g, "\\n"));

            let category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY" | null = null;
            if (containerText.includes("Job title")) category = "JOB_TITLE";
            else if (containerText.includes("Location")) category = "LOCATION";
            else if (containerText.includes("Company size") || containerText.includes("Companies")) category = "COMPANY";
            else if (containerText.includes("Industry")) category = "INDUSTRY";
            else if (containerText.includes("Seniority")) category = "JOB_TITLE";

            console.log("Identified Category:", category);

            if (category) {
                const percentageEls = await container.locator(".member-analytics-addon-color-bar-chart-bar__percentage").all();
                console.log(`Found ${percentageEls.length} percentage elements`);

                for (const pctEl of percentageEls) {
                    const pctText = await pctEl.innerText();
                    const val = parseFloat(pctText.replace("%", "").trim());
                    console.log(`   Pct: ${pctText} -> ${val}`);

                    const row = pctEl.locator("xpath=..");
                    const rowText = await row.innerText();
                    console.log(`   Row Text: ${rowText.replace(/\n/g, "\\n")}`);

                    const label = rowText.replace(pctText, "").trim();
                    console.log(`   Extracted Label: "${label}"`);

                    if (label && val) {
                        demographics.push({
                            category,
                            value: label,
                            percentage: val
                        });
                    }
                }
            }
        }

        console.log(`\nFinal Demographics: ${demographics.length} items`);
        console.log(JSON.stringify(demographics, null, 2));

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await browser.close();
    }
}

debugPostAnalytics();
