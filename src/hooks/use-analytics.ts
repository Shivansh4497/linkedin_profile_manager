"use client";

import { useState, useEffect, useCallback } from "react";

interface AnalyticsData {
    totals: {
        posts: number;
        impressions: number;
        likes: number;
        comments: number;
        shares: number;
    };
    averages: {
        impressionsPerPost: number;
        engagementRate: number;
        likesPerPost: number;
        commentsPerPost: number;
    };
    followers: {
        current: number;
        change: number;
        changePercent: number;
        trend: "up" | "down" | "stable";
    };
    engagement: {
        rate: number;
        trend: "up" | "down" | "stable";
    };
    profileViews: {
        current: number;
        trend: "up" | "down" | "stable";
    };
    searchAppearances: {
        current: number;
        trend: "up" | "down" | "stable";
    };
    demographics: {
        jobTitles: { value: string; percentage: number }[];
        companies: { value: string; percentage: number }[];
        locations: { value: string; percentage: number }[];
        industries: { value: string; percentage: number }[];
    };
    topHashtags: {
        hashtag: string;
        postsCount: number;
        totalImpressions: number;
        avgEngagement: number;
    }[];
}

interface AnalyticsState {
    data: AnalyticsData | null;
    isLoading: boolean;
    error: string | null;
}

export function useAnalytics() {
    const [state, setState] = useState<AnalyticsState>({
        data: null,
        isLoading: true,
        error: null,
    });

    const fetchAnalytics = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch("/api/analytics");

            if (!response.ok) {
                if (response.status === 401) {
                    setState({ data: null, isLoading: false, error: null });
                    return;
                }
                throw new Error("Failed to fetch analytics");
            }

            const data = await response.json();
            setState({ data, isLoading: false, error: null });
        } catch (error) {
            setState({
                data: null,
                isLoading: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        ...state,
        refetch: fetchAnalytics,
    };
}
