import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-background" />

            {/* Animated gradient orbs */}
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse delay-1000" />

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 text-center">
                {/* Badge */}
                <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
                    <Sparkles className="h-4 w-4" />
                    AI-Powered LinkedIn Growth
                </Badge>

                {/* Headline */}
                <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Your LinkedIn,{" "}
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        on autopilot
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                    Stop spending hours on LinkedIn. Let AI handle your analytics, suggest content
                    that resonates, and help you hit your growth goals—while you stay in control.
                </p>

                {/* CTAs */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg px-8"
                        asChild
                    >
                        <Link href="/dashboard">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto text-lg px-8"
                        asChild
                    >
                        <Link href="#features">See How It Works</Link>
                    </Button>
                </div>

                {/* Social proof */}
                <p className="mt-8 text-sm text-muted-foreground">
                    No credit card required • Free forever tier • Cancel anytime
                </p>
            </div>
        </section>
    );
}
