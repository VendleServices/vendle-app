
export const metadata = {
    title: "home-recovery-hub",
    description: "Lovable Generated Project",
    authors: [{ name: "Lovable" }],
    openGraph: {
      images: ["/og-image.png"]
    }
  }

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <div id="root">{children}</div>
        </body>
      </html>
    )
  }