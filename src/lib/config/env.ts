// Environment variable validation

function getEnvVar(key: string, required = true): string {
    const value = process.env[key];

    if (required && !value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value ?? "";
}

export const env = {
    // Supabase
    supabaseUrl: () => getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: () => getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceKey: () => getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),

    // LinkedIn OAuth
    linkedinClientId: () => getEnvVar("LINKEDIN_CLIENT_ID"),
    linkedinClientSecret: () => getEnvVar("LINKEDIN_CLIENT_SECRET"),

    // App
    appUrl: () => getEnvVar("NEXT_PUBLIC_APP_URL", false) || "http://localhost:3000",
    nodeEnv: () => getEnvVar("NODE_ENV", false) || "development",

    // Helpers
    isDev: () => env.nodeEnv() === "development",
    isProd: () => env.nodeEnv() === "production",
} as const;
