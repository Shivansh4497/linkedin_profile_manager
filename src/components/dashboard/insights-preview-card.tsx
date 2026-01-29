"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";

export function InsightsPreviewCard() {
    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    AI Insights
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-dashed border-white/10 bg-white/2 p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                        <Lightbulb className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="font-medium">Insights Coming Soon</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        AI-powered recommendations will appear here after we analyze your LinkedIn activity.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
