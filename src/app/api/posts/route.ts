import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// GET /api/posts - Get user's posts
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
        const posts = await prisma.linkedInPost.findMany({
            where: { userId },
            orderBy: { publishedAt: "desc" },
            take: 20,
            include: { demographics: true }
        });

        return NextResponse.json({ posts });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
