import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// GET /api/auth/me - Get current user
export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
        return NextResponse.json({ user: null });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
            },
        });

        if (!user) {
            // Clear invalid cookie
            cookieStore.delete("user_id");
            return NextResponse.json({ user: null });
        }

        // Don't expose sensitive tokens
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profile: user.profile ? {
                    linkedinId: user.profile.linkedinId,
                    name: user.profile.name,
                    headline: user.profile.headline,
                    avatarUrl: user.profile.avatarUrl,
                    followers: user.profile.followers,
                    connections: user.profile.connections,
                } : null,
            },
        });

    } catch {
        return NextResponse.json({ user: null });
    }
}
