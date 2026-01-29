// LinkedIn OAuth Configuration
export const LINKEDIN_CONFIG = {
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`,

    // OAuth endpoints
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",

    // API endpoints
    userInfoUrl: "https://api.linkedin.com/v2/userinfo",

    // Scopes for OpenID Connect
    scopes: ["openid", "profile", "email"],
} as const;

// Generate LinkedIn OAuth authorization URL
export function getLinkedInAuthUrl(state: string): string {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: LINKEDIN_CONFIG.clientId,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
        state,
        scope: LINKEDIN_CONFIG.scopes.join(" "),
    });

    return `${LINKEDIN_CONFIG.authorizationUrl}?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<{
    access_token: string;
    expires_in: number;
    id_token?: string;
}> {
    const params = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
        client_id: LINKEDIN_CONFIG.clientId,
        client_secret: LINKEDIN_CONFIG.clientSecret,
    });

    const response = await fetch(LINKEDIN_CONFIG.tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn token exchange failed: ${error}`);
    }

    return response.json();
}

// Fetch user profile from LinkedIn
export async function getLinkedInProfile(accessToken: string): Promise<{
    sub: string;        // LinkedIn ID
    name: string;
    email: string;
    email_verified: boolean;
    picture?: string;
}> {
    const response = await fetch(LINKEDIN_CONFIG.userInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn profile fetch failed: ${error}`);
    }

    return response.json();
}
