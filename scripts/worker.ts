/**
 * LinkedIn Sync Worker
 * 
 * This script runs on your Mac and polls for pending sync jobs.
 * When a job is found, it runs the LinkedIn scraper and marks the job complete.
 * 
 * Usage: pnpm worker
 * 
 * The worker polls the Vercel-hosted API every 60 seconds for pending jobs.
 */

import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const POLL_INTERVAL = 60000; // 60 seconds

async function pollForJobs() {
    console.log(`[${new Date().toISOString()}] Checking for pending jobs...`);

    try {
        const response = await fetch(`${APP_URL}/api/sync/worker`);
        const data = await response.json();

        if (data.job) {
            console.log(`[${new Date().toISOString()}] Found job: ${data.job.id}`);
            await executeJob(data.job);
        } else {
            console.log(`[${new Date().toISOString()}] No pending jobs`);
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error polling:`, error);
    }
}

async function executeJob(job: { id: string }) {
    console.log(`[${new Date().toISOString()}] Starting job ${job.id}...`);

    // Mark job as running
    await updateJobStatus(job.id, "RUNNING");

    try {
        // Import and run the sync script
        const { syncLinkedInData } = await import("./linkedin/sync");
        await syncLinkedInData();

        // Mark job as complete
        await updateJobStatus(job.id, "COMPLETED");
        console.log(`[${new Date().toISOString()}] Job ${job.id} completed successfully`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[${new Date().toISOString()}] Job ${job.id} failed:`, errorMessage);
        await updateJobStatus(job.id, "FAILED", errorMessage);
    }
}

async function updateJobStatus(jobId: string, status: string, error?: string) {
    try {
        await fetch(`${APP_URL}/api/sync/worker`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId, status, error })
        });
    } catch (e) {
        console.error(`[${new Date().toISOString()}] Failed to update job status:`, e);
    }
}

async function startWorker() {
    console.log("🔄 LinkedIn Sync Worker Started");
    console.log(`   Polling ${APP_URL} every ${POLL_INTERVAL / 1000} seconds`);
    console.log("   Press Ctrl+C to stop\n");

    // Initial poll
    await pollForJobs();

    // Continue polling
    setInterval(pollForJobs, POLL_INTERVAL);
}

startWorker();
