import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// POST - Create a new sync job (trigger from dashboard)
export async function POST() {
    try {
        // Get the user (for now, just get the first user)
        const user = await prisma.user.findFirst();

        if (!user) {
            return NextResponse.json(
                { error: "No user found" },
                { status: 404 }
            );
        }

        // Check if there's already a pending or running job
        const existingJob = await prisma.syncJob.findFirst({
            where: {
                userId: user.id,
                status: { in: ["PENDING", "RUNNING"] }
            }
        });

        if (existingJob) {
            return NextResponse.json({
                message: "Sync already in progress",
                job: existingJob
            });
        }

        // Create new sync job
        const job = await prisma.syncJob.create({
            data: {
                userId: user.id,
                status: "PENDING"
            }
        });

        return NextResponse.json({
            message: "Sync job created",
            job
        });

    } catch (error) {
        console.error("Error creating sync job:", error);
        return NextResponse.json(
            { error: "Failed to create sync job" },
            { status: 500 }
        );
    }
}

// GET - Get latest sync job status
export async function GET() {
    try {
        const user = await prisma.user.findFirst();

        if (!user) {
            return NextResponse.json(
                { error: "No user found" },
                { status: 404 }
            );
        }

        // Get most recent job
        const latestJob = await prisma.syncJob.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" }
        });

        // Get last successful sync
        const lastCompletedJob = await prisma.syncJob.findFirst({
            where: {
                userId: user.id,
                status: "COMPLETED"
            },
            orderBy: { completedAt: "desc" }
        });

        return NextResponse.json({
            currentJob: latestJob,
            lastSyncAt: lastCompletedJob?.completedAt || null
        });

    } catch (error) {
        console.error("Error getting sync status:", error);
        return NextResponse.json(
            { error: "Failed to get sync status" },
            { status: 500 }
        );
    }
}
