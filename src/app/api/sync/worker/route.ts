import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// POST - Worker marks job as complete or failed
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobId, status, error } = body;

        if (!jobId || !status) {
            return NextResponse.json(
                { error: "Missing jobId or status" },
                { status: 400 }
            );
        }

        if (!["COMPLETED", "FAILED", "RUNNING"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = { status };

        if (status === "RUNNING") {
            updateData.startedAt = new Date();
        } else if (status === "COMPLETED" || status === "FAILED") {
            updateData.completedAt = new Date();
            if (error) updateData.error = error;
        }

        const job = await prisma.syncJob.update({
            where: { id: jobId },
            data: updateData
        });

        return NextResponse.json({ job });

    } catch (error) {
        console.error("Error updating sync job:", error);
        return NextResponse.json(
            { error: "Failed to update sync job" },
            { status: 500 }
        );
    }
}

// GET - Worker polls for pending jobs
export async function GET() {
    try {
        const pendingJob = await prisma.syncJob.findFirst({
            where: { status: "PENDING" },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({ job: pendingJob });

    } catch (error) {
        console.error("Error fetching pending jobs:", error);
        return NextResponse.json(
            { error: "Failed to fetch pending jobs" },
            { status: 500 }
        );
    }
}
