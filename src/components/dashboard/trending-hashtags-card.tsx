import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, TrendingUp, MessageCircle, Eye } from "lucide-react";

interface HashtagMetric {
    hashtag: string;
    postsCount: number;
    totalImpressions: number;
    avgEngagement: number;
}

interface TrendingHashtagsCardProps {
    hashtags?: HashtagMetric[];
    isLoading: boolean;
}

export function TrendingHashtagsCard({ hashtags, isLoading }: TrendingHashtagsCardProps) {
    if (isLoading) {
        return (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="h-5 w-32 animate-pulse rounded bg-white/10" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 w-full animate-pulse rounded bg-white/10" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4 text-purple-400" />
                    Top Hashtags
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {(!hashtags || hashtags.length === 0) ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                            No trending hashtags found.
                        </div>
                    ) : (
                        hashtags.map((tag, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="font-medium text-white/90 group-hover:text-purple-400 transition-colors">
                                        #{tag.hashtag.replace(/^#/, '')}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex gap-2">
                                        <span>{tag.postsCount} posts</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1 text-muted-foreground" title="Total Impressions">
                                        <Eye className="h-3 w-3" />
                                        <span>{formatNumber(tag.totalImpressions)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full" title="Avg Engagement Rate">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>{tag.avgEngagement.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
}
