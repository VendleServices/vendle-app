import type { Metadata } from "next";
import "../styles/index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/app/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Vendle - Home Recovery Hub",
  description: "Manage your home recovery projects with ease",
  authors: [{ name: "Vendle" }],
  openGraph: {
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <AuthProvider>
            <main id ="root">
              {children}
            </main>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}