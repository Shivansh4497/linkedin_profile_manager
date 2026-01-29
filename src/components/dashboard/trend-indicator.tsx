"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type TrendDirection = "up" | "down" | "stable";

interface TrendIndicatorProps {
    trend: TrendDirection;
    value?: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}

export function TrendIndicator({
    trend,
    value,
    showLabel = true,
    size = "md"
}: TrendIndicatorProps) {
    const sizeMap = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    const config = {
        up: {
            icon: TrendingUp,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            label: "Up",
        },
        down: {
            icon: TrendingDown,
            color: "text-red-400",
            bgColor: "bg-red-500/10",
            label: "Down",
        },
        stable: {
            icon: Minus,
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/10",
            label: "Stable",
        },
    };

    const { icon: Icon, color, bgColor, label } = config[trend];

    return (
        <div className={cn("flex items-center gap-1", color)}>
            <div className={cn("rounded-full p-1", bgColor)}>
                <Icon className={sizeMap[size]} />
            </div>
            {showLabel && (
                <span className="text-xs font-medium">
                    {value !== undefined ? `${value > 0 ? "+" : ""}${value.toFixed(1)}%` : label}
                </span>
            )}
        </div>
    );
}
