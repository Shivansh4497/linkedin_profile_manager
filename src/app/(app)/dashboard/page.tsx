"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, ArrowLeft, Linkedin, Loader2, LogOut } from "lucide-react";
import { useAuth, useAnalytics } from "@/hooks";
import {
    ProfileCard,
    QuickActionsCard,
    InsightsPreviewCard,
    PostsListCard,
    AnalyticsOverviewCard,
    AudienceInsightsCard,
    TrendingHashtagsCard
} from "@/components/dashboard";

interface Post {
    id: string;
    content: string;
    postType: string;
    publishedAt: string;
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number | null;
}

export default function DashboardPage() {
    const { user, isLoading, isAuthenticated, login, logout, refetch } = useAuth();
    const { data: analytics, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useAnalytics();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Fetch posts
    const fetchPosts = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoadingPosts(true);
        try {
            const response = await fetch("/api/posts");
            const data = await response.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoadingPosts(false);
        }
    }, [isAuthenticated]);

    // Sync data
    const handleSync = useCallback(async () => {
        setIsSyncing(true);
        try {
            const response = await fetch("/api/sync", { method: "POST" });
            const data = await response.json();

            if (data.success) {
                // Refetch all data
                await Promise.all([refetch(), fetchPosts(), refetchAnalytics()]);
            }
        } catch (error) {
            console.error("Sync error:", error);
        } finally {
            setIsSyncing(false);
        }
    }, [refetch, fetchPosts, refetchAnalytics]);

    // Fetch posts on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated, fetchPosts]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
        );
    }

    // Authenticated view
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <LayoutDashboard className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold">LPM</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {user.email}
                            </span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Your LinkedIn growth at a glance</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Profile & Analytics & Posts */}
                        <div className="space-y-6 lg:col-span-2">
                            <ProfileCard user={user} />
                            <AnalyticsOverviewCard data={analytics} isLoading={isLoadingAnalytics} />
                            <AudienceInsightsCard demographics={analytics?.demographics} isLoading={isLoadingAnalytics} />
                            <PostsListCard posts={posts} isLoading={isLoadingPosts} />
                        </div>

                        {/* Right Column - Actions & Insights */}
                        <div className="space-y-6">
                            <QuickActionsCard onSync={handleSync} isSyncing={isSyncing} />
                            <TrendingHashtagsCard hashtags={analytics?.topHashtags} isLoading={isLoadingAnalytics} />
                            <InsightsPreviewCard />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Not authenticated - show login
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
                <CardContent className="flex flex-col items-center p-8 text-center">
                    {/* Icon */}
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <LayoutDashboard className="h-8 w-8 text-blue-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold">Dashboard</h1>

                    {/* Description */}
                    <p className="mt-3 text-muted-foreground">
                        Connect your LinkedIn account to unlock your personalized dashboard.
                    </p>

                    {/* LinkedIn Login */}
                    <div className="mt-8 w-full space-y-3">
                        <Button
                            className="w-full bg-[#0A66C2] hover:bg-[#004182]"
                            onClick={login}
                        >
                            <Linkedin className="mr-2 h-5 w-5" />
                            Connect LinkedIn
                        </Button>

                        <Button variant="ghost" asChild className="w-full">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
