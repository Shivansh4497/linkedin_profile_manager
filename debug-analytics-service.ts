import { getAnalytics } from "./src/lib/services/analytics";
import { prisma } from "./src/lib/db";
import * as dotenv from "dotenv";
dotenv.config();

async function test() {
    try {
        console.log("Fetching analytics...");
        const userId = "aa0d0ba9-1b3b-4694-b55e-09e0577a9601";
        const data = await getAnalytics(userId);
        console.log("Success:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
