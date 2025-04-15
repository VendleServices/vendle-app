import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "home-recovery-hub",
  description: "Lovable Generated Project",
  authors: [{ name: "Lovable" }],
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
      <body>
        <div id ="root">{children}</div>
        </body>
    </html>
  );
}