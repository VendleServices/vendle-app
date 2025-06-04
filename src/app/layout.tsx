import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "../styles/index.css";

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
      <body>
        <Navbar />
        <main id ="root" className="">
          {children}
        </main>
      </body>
    </html>
  );
}