import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/lib/constants/features";

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to{" "}
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            grow on LinkedIn
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From analytics to AI content—all the tools to build your personal brand.
                    </p>
                </div>

                {/* Features grid */}
                <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature) => (
                        <Card
                            key={feature.title}
                            className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                        >
                            <CardContent className="p-6">
                                {/* Icon */}
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 transition-transform group-hover:scale-110">
                                    <feature.icon className="h-6 w-6 text-blue-400" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold">{feature.title}</h3>

                                {/* Description */}
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
