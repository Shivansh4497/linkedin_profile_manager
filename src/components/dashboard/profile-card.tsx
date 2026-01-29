"use client";

import { User } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User as UserIcon,
    Users,
    Eye,
    TrendingUp,
    Calendar
} from "lucide-react";

interface ProfileCardProps {
    user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
    const profile = user.profile;

    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
            <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {profile?.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={user.name || "User"}
                            className="h-20 w-20 rounded-2xl object-cover ring-2 ring-blue-500/20"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-2 ring-blue-500/20">
                            <UserIcon className="h-10 w-10 text-blue-400" />
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold truncate">{user.name || "User"}</h2>
                        {profile?.headline && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {profile.headline}
                            </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                Connected
                            </Badge>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatItem
                        icon={Users}
                        value={profile?.followers || 0}
                        label="Followers"
                        color="blue"
                    />
                    <StatItem
                        icon={UserIcon}
                        value={profile?.connections || 0}
                        label="Connections"
                        color="purple"
                    />
                    <StatItem
                        icon={Eye}
                        value={0}
                        label="Impressions"
                        color="emerald"
                    />
                    <StatItem
                        icon={TrendingUp}
                        value="0%"
                        label="Engagement"
                        color="orange"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

interface StatItemProps {
    icon: React.ElementType;
    value: number | string;
    label: string;
    color: "blue" | "purple" | "emerald" | "orange";
}

function StatItem({ icon: Icon, value, label, color }: StatItemProps) {
    const colorMap = {
        blue: "from-blue-500/20 to-blue-600/20 text-blue-400",
        purple: "from-purple-500/20 to-purple-600/20 text-purple-400",
        emerald: "from-emerald-500/20 to-emerald-600/20 text-emerald-400",
        orange: "from-orange-500/20 to-orange-600/20 text-orange-400",
    };

    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[color]}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <p className="text-2xl font-bold">
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}
