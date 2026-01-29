"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, Target, TrendingUp } from "lucide-react";

interface QuickActionsCardProps {
    onSync?: () => void;
    isSyncing?: boolean;
}

export function QuickActionsCard({ onSync, isSyncing }: QuickActionsCardProps) {
    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                <ActionButton
                    icon={RefreshCw}
                    label="Sync Data"
                    description="Pull latest from LinkedIn"
                    onClick={onSync}
                    isLoading={isSyncing}
                    color="blue"
                />
                <ActionButton
                    icon={Sparkles}
                    label="Generate Content"
                    description="AI-powered post ideas"
                    disabled
                    color="purple"
                />
                <ActionButton
                    icon={Target}
                    label="Set Goal"
                    description="Track your progress"
                    disabled
                    color="emerald"
                />
                <ActionButton
                    icon={TrendingUp}
                    label="View Analytics"
                    description="Deep dive into stats"
                    disabled
                    color="orange"
                />
            </CardContent>
        </Card>
    );
}

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    description: string;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    color: "blue" | "purple" | "emerald" | "orange";
}

function ActionButton({
    icon: Icon,
    label,
    description,
    onClick,
    isLoading,
    disabled,
    color
}: ActionButtonProps) {
    const colorMap = {
        blue: "group-hover:from-blue-500/10 group-hover:to-blue-600/10",
        purple: "group-hover:from-purple-500/10 group-hover:to-purple-600/10",
        emerald: "group-hover:from-emerald-500/10 group-hover:to-emerald-600/10",
        orange: "group-hover:from-orange-500/10 group-hover:to-orange-600/10",
    };

    const iconColorMap = {
        blue: "text-blue-400",
        purple: "text-purple-400",
        emerald: "text-emerald-400",
        orange: "text-orange-400",
    };

    return (
        <Button
            variant="outline"
            className={`group h-auto flex-col items-start gap-1 border-white/10 p-4 text-left transition-all bg-gradient-to-br from-transparent to-transparent ${colorMap[color]} ${disabled ? "opacity-50" : ""}`}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${iconColorMap[color]} ${isLoading ? "animate-spin" : ""}`} />
                <span className="font-medium">{label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{description}</span>
            {disabled && (
                <span className="text-[10px] text-muted-foreground/60">Coming soon</span>
            )}
        </Button>
    );
}
