import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLinkedInAuthUrl } from "@/lib/services/linkedin";

// GET /api/auth/linkedin - Initiate LinkedIn OAuth
export async function GET() {
    // Generate random state for CSRF protection
    const state = crypto.randomUUID();

    // Store state in cookie for verification
    const cookieStore = await cookies();
    cookieStore.set("linkedin_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10, // 10 minutes
        path: "/",
    });

    // Redirect to LinkedIn authorization
    const authUrl = getLinkedInAuthUrl(state);

    return NextResponse.redirect(authUrl);
}
