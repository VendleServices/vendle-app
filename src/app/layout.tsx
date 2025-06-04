import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "../styles/index.css";

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
        <Navbar />
        <main id ="root" className="">
          {children}
        </main>
      </body>
    </html>
  );
}