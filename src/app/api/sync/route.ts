import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// POST /api/sync - Trigger a data sync
export async function POST() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // LinkedIn API requires Marketing Developer Platform for full analytics
        // For now, we'll simulate a sync with placeholder data
        // In production, you would call the LinkedIn API here

        const syncedAt = new Date();

        // Update the profile's fetchedAt timestamp
        if (user.profile) {
            await prisma.linkedInProfile.update({
                where: { id: user.profile.id },
                data: { fetchedAt: syncedAt },
            });
        }

        // Create an analytics snapshot for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.analyticsSnapshot.upsert({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
            update: {
                followers: user.profile?.followers || 0,
                createdAt: syncedAt,
            },
            create: {
                userId,
                date: today,
                followers: user.profile?.followers || 0,
            },
        });

        return NextResponse.json({
            success: true,
            syncedAt: syncedAt.toISOString(),
            message: "Data synced successfully",
        });

    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json(
            { error: "Sync failed" },
            { status: 500 }
        );
    }
}

// GET /api/sync - Get last sync time
export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const profile = await prisma.linkedInProfile.findFirst({
            where: { userId },
            select: { fetchedAt: true },
        });

        return NextResponse.json({
            lastSyncedAt: profile?.fetchedAt?.toISOString() || null,
        });

    } catch {
        return NextResponse.json(
            { lastSyncedAt: null }
        );
    }
}
