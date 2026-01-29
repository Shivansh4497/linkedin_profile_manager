import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAnalytics } from "@/lib/services/analytics";

// GET /api/analytics - Get user analytics
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
        const analytics = await getAnalytics(userId);
        return NextResponse.json(analytics);
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
