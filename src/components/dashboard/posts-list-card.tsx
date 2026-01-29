
"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    ThumbsUp,
    MessageSquare,
    Share2,
    Eye,
    Calendar,
    BarChart3,
    PlusCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PostAnalyticsModal } from "./post-analytics-modal";

interface DemographicItem {
    category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY";
    value: string;
    percentage: number;
}

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
    demographics?: DemographicItem[];
}

interface PostsListCardProps {
    posts: Post[];
    isLoading?: boolean;
}

export function PostsListCard({ posts, isLoading }: PostsListCardProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    if (isLoading) {
        return (
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        Recent Posts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-24 rounded-lg border border-white/10 bg-white/5 animate-pulse"
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        Recent Posts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/2 p-6 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                            <FileText className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="font-medium">No posts yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Your LinkedIn posts will appear here after syncing.
                        </p>
                        <Button className="mt-4" variant="outline" size="sm" disabled>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create First Post
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        Recent Posts
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {posts.length} posts
                    </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                    {posts.slice(0, 5).map((post) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            onViewAnalytics={() => setSelectedPost(post)}
                        />
                    ))}

                    {posts.length > 5 && (
                        <Button variant="ghost" className="w-full" size="sm">
                            View all {posts.length} posts
                        </Button>
                    )}
                </CardContent>
            </Card>

            <PostAnalyticsModal
                post={selectedPost}
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
            />
        </>
    );
}

function PostItem({ post, onViewAnalytics }: { post: Post, onViewAnalytics: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const PostTypeIcon = {
        TEXT: FileText,
        IMAGE: FileText,
        CAROUSEL: FileText,
        VIDEO: FileText,
        ARTICLE: FileText,
    }[post.postType] || FileText;

    const shouldTruncate = post.content.length > 150;
    const displayContent = isExpanded || !shouldTruncate
        ? post.content
        : post.content.slice(0, 150) + "...";

    return (
        <div
            className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/8 cursor-pointer relative"
            onClick={() => shouldTruncate && setIsExpanded(!isExpanded)}
        >
            <div className="flex gap-3">
                {/* Post Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <PostTypeIcon className="h-5 w-5 text-blue-400" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <p className={`text-sm whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {displayContent}
                    </p>

                    {shouldTruncate && (
                        <button
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        >
                            {isExpanded ? "Show less" : "Read more"}
                        </button>
                    )}

                    {/* Meta */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-5">
                            {post.postType}
                        </Badge>
                    </div>

                    {/* Stats */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {post.impressions.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {post.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Share2 className="h-3 w-3" />
                            {post.shares.toLocaleString()}
                        </span>
                        {post.engagementRate !== null && (
                            <span className="text-emerald-400">
                                {(post.engagementRate * 100).toFixed(1)}% engagement
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-start">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-400"
                        title="View Detailed Analytics"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewAnalytics();
                        }}
                    >
                        <BarChart3 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
