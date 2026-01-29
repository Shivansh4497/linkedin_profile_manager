
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, Briefcase, MapPin, Building2, TrendingUp, BarChart3, MessageSquare, Share2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DemographicItem {
    category: "JOB_TITLE" | "INDUSTRY" | "LOCATION" | "COMPANY";
    value: string;
    percentage: number;
}

interface Post {
    id: string;
    content: string;
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    demographics?: DemographicItem[];
    publishedAt: string;
}

interface PostAnalyticsModalProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PostAnalyticsModal({ post, isOpen, onClose }: PostAnalyticsModalProps) {
    const [activeTab, setActiveTab] = useState<"jobs" | "companies" | "locations" | "industries">("jobs");

    if (!post) return null;

    // Transform flat demographics to grouped
    const getGroupedDemographics = () => {
        if (!post.demographics) return { jobs: [], companies: [], locations: [], industries: [] };
        return {
            jobs: post.demographics.filter(d => d.category === "JOB_TITLE").sort((a, b) => b.percentage - a.percentage),
            companies: post.demographics.filter(d => d.category === "COMPANY").sort((a, b) => b.percentage - a.percentage),
            locations: post.demographics.filter(d => d.category === "LOCATION").sort((a, b) => b.percentage - a.percentage),
            industries: post.demographics.filter(d => d.category === "INDUSTRY").sort((a, b) => b.percentage - a.percentage),
        };
    };

    const grouped = getGroupedDemographics();

    const getCurrentData = () => {
        switch (activeTab) {
            case "jobs": return grouped.jobs;
            case "companies": return grouped.companies;
            case "locations": return grouped.locations;
            case "industries": return grouped.industries;
            default: return [];
        }
    };

    const data = getCurrentData();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl border-white/10 bg-black/90 backdrop-blur-xl text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        Post Analytics
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Detailed performance and audience insights for this post.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Post Content Preview */}
                    <div className="rounded-lg bg-white/5 p-4 border border-white/10">
                        <p className="text-sm text-gray-300 line-clamp-2 italic">
                            "{post.content}"
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" /> {post.impressions}
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {post.comments}
                            </div>
                            <div className="flex items-center gap-1">
                                <Share2 className="h-3 w-3" /> {post.shares}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Audience Demographics */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-400" />
                                Audience Demographics
                            </h3>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            <TabButton
                                active={activeTab === "jobs"}
                                onClick={() => setActiveTab("jobs")}
                                icon={<Briefcase className="h-3 w-3" />}
                                label="Jobs"
                            />
                            <TabButton
                                active={activeTab === "companies"}
                                onClick={() => setActiveTab("companies")}
                                icon={<Building2 className="h-3 w-3" />}
                                label="Companies"
                            />
                            <TabButton
                                active={activeTab === "locations"}
                                onClick={() => setActiveTab("locations")}
                                icon={<MapPin className="h-3 w-3" />}
                                label="Locations"
                            />
                            <TabButton
                                active={activeTab === "industries"}
                                onClick={() => setActiveTab("industries")}
                                icon={<TrendingUp className="h-3 w-3" />}
                                label="Industries"
                            />
                        </div>

                        {/* Chart / List */}
                        <div className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {data.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg">
                                    No demographic data available for this category.
                                </div>
                            ) : (
                                data.map((item, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-white/90 truncate max-w-[70%]">
                                                {item.value}
                                            </span>
                                            <span className="text-blue-400 font-semibold">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap
                ${active
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
