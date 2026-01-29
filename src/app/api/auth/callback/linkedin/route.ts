import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, getLinkedInProfile } from "@/lib/services/linkedin";
import { prisma } from "@/lib/db";

// GET /api/auth/callback/linkedin - Handle OAuth callback
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handle LinkedIn errors
    if (error) {
        console.error("LinkedIn OAuth error:", error, errorDescription);
        return NextResponse.redirect(
            new URL(`/dashboard?error=${encodeURIComponent(errorDescription || error)}`, request.url)
        );
    }

    // Validate required parameters
    if (!code || !state) {
        return NextResponse.redirect(
            new URL("/dashboard?error=missing_params", request.url)
        );
    }

    // Verify state for CSRF protection
    const cookieStore = await cookies();
    const savedState = cookieStore.get("linkedin_oauth_state")?.value;

    if (!savedState || savedState !== state) {
        return NextResponse.redirect(
            new URL("/dashboard?error=invalid_state", request.url)
        );
    }

    // Clear the state cookie
    cookieStore.delete("linkedin_oauth_state");

    try {
        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);

        // Fetch user profile
        const profile = await getLinkedInProfile(tokens.access_token);

        // Calculate token expiry
        const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

        // Upsert user in database
        const user = await prisma.user.upsert({
            where: { email: profile.email },
            update: {
                name: profile.name,
                liAccessToken: tokens.access_token,
                tokenExpiresAt,
            },
            create: {
                email: profile.email,
                name: profile.name,
                liAccessToken: tokens.access_token,
                tokenExpiresAt,
            },
        });

        // Upsert LinkedIn profile
        await prisma.linkedInProfile.upsert({
            where: { linkedinId: profile.sub },
            update: {
                name: profile.name,
                avatarUrl: profile.picture,
                fetchedAt: new Date(),
            },
            create: {
                userId: user.id,
                linkedinId: profile.sub,
                name: profile.name,
                avatarUrl: profile.picture,
                fetchedAt: new Date(),
            },
        });

        // Set session cookie with user ID
        cookieStore.set("user_id", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        // Redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));

    } catch (err) {
        console.error("LinkedIn OAuth callback error:", err);
        return NextResponse.redirect(
            new URL("/dashboard?error=auth_failed", request.url)
        );
    }
}
