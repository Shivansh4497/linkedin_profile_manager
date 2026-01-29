import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 sm:p-12 lg:p-16">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        {/* Icon */}
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                            <Linkedin className="h-8 w-8 text-white" />
                        </div>

                        {/* Headline */}
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Ready to grow your LinkedIn presence?
                        </h2>

                        {/* Subheadline */}
                        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
                            Join thousands of professionals who are building their personal brand
                            with AI-powered insights and content.
                        </p>

                        {/* CTA */}
                        <div className="mt-8">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8"
                                asChild
                            >
                                <Link href="/dashboard">
                                    Connect LinkedIn
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Trust text */}
                        <p className="mt-4 text-sm text-blue-200">
                            Free to start • No credit card required
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
