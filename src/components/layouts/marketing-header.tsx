"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants/site";
import { Linkedin } from "lucide-react";

export function MarketingHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                        <Linkedin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold">{SITE_CONFIG.name}</span>
                </Link>

                {/* Nav Links - Hidden on mobile */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard">Sign In</Link>
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" asChild>
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
