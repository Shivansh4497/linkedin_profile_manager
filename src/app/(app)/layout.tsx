export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* App navigation will be added in Phase 1.4 */}
            <main className="flex-1">{children}</main>
        </div>
    );
}
