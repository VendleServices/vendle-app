export default function NoNavbarLayout({
   children,
}: {
    children: React.ReactNode
}) {
    return (
        <main id="root">
            {children}
        </main>
    );
} 