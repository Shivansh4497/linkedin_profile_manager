"use client";

import { useState, useEffect, useCallback } from "react";

export interface LinkedInProfile {
    linkedinId: string;
    name: string;
    headline?: string;
    avatarUrl?: string;
    followers: number;
    connections: number;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    profile: LinkedInProfile | null;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        error: null,
    });

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/me");
            const data = await response.json();

            setState({
                user: data.user,
                isLoading: false,
                error: null,
            });
        } catch {
            setState({
                user: null,
                isLoading: false,
                error: "Failed to fetch user",
            });
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = useCallback(() => {
        // Redirect to LinkedIn OAuth
        window.location.href = "/api/auth/linkedin";
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setState({
                user: null,
                isLoading: false,
                error: null,
            });
            window.location.href = "/";
        } catch {
            setState((prev) => ({
                ...prev,
                error: "Failed to logout",
            }));
        }
    }, []);

    return {
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: !!state.user,
        error: state.error,
        login,
        logout,
        refetch: fetchUser,
    };
}
