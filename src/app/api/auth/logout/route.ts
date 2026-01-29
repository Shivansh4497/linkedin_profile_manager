import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST /api/auth/logout - Logout user
export async function POST() {
    const cookieStore = await cookies();

    // Clear the session cookie
    cookieStore.delete("user_id");

    return NextResponse.json({ success: true });
}

// GET /api/auth/logout - Redirect logout
export async function GET() {
    const cookieStore = await cookies();

    // Clear the session cookie
    cookieStore.delete("user_id");

    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));
}
