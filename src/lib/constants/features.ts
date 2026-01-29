import {
    BarChart3,
    Target,
    Sparkles,
    Clock,
    TrendingUp,
    Shield,
} from "lucide-react";

export const FEATURES = [
    {
        icon: Clock,
        title: "Save Time",
        description: "Reduce hours spent on LinkedIn while increasing your impact. Let AI handle the heavy lifting.",
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        description: "Understand what content works with automated insights and trend analysis.",
    },
    {
        icon: Sparkles,
        title: "AI Content",
        description: "Get personalized post suggestions that match your voice and resonate with your audience.",
    },
    {
        icon: Target,
        title: "Goal Tracking",
        description: "Set measurable goals and track your progress with visual dashboards.",
    },
    {
        icon: TrendingUp,
        title: "Grow Consistently",
        description: "Never miss a posting schedule. Build habits that drive real growth.",
    },
    {
        icon: Shield,
        title: "You're in Control",
        description: "Nothing posts without your approval. AI suggests, you decide.",
    },
] as const;
