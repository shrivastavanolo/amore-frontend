import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Amore Invites Co. — Wedding Invitation Studio",
  description: "Design beautiful wedding invitations with ease",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}