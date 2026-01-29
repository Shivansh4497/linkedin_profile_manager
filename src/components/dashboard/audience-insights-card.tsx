import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, MapPin, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemographicItem {
    value: string;
    percentage: number;
}

interface AudienceInsightsCardProps {
    demographics?: {
        jobTitles: DemographicItem[];
        companies: DemographicItem[];
        locations: DemographicItem[];
        industries: DemographicItem[];
    };
    isLoading: boolean;
}

export function AudienceInsightsCard({ demographics, isLoading }: AudienceInsightsCardProps) {
    const [activeTab, setActiveTab] = useState<"jobs" | "companies" | "locations" | "industries">("jobs");

    if (isLoading) {
        return (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="h-5 w-40 animate-pulse rounded bg-white/10" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-full animate-pulse rounded bg-white/10" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getData = () => {
        switch (activeTab) {
            case "jobs": return demographics?.jobTitles || [];
            case "companies": return demographics?.companies || [];
            case "locations": return demographics?.locations || [];
            case "industries": return demographics?.industries || [];
            default: return [];
        }
    };

    const data = getData();

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        Audience Demographics
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {/* Custom Tabs */}
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

                <div className="space-y-3 mt-2">
                    {data.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No demographic data available yet.
                            <br />
                            Run a sync to update.
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
            </CardContent>
        </Card>
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
