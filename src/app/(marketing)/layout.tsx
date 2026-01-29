import { MarketingHeader } from "@/components/layouts/marketing-header";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <MarketingHeader />
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} LinkedIn Profile Manager. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
