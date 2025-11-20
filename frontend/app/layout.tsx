import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Summarize Youtube",
    template: "%s | Summarize Youtube",
  },
  description: "Transcribe and summarize your YouTube videos with AI.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "Summarize Youtube",
    description: "Transcribe and summarize your YouTube videos with AI.",
    url: process.env.NEXT_PUBLIC_APP_URL || "/",
    siteName: "Summarize Youtube",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summarize Youtube",
    description: "Transcribe and summarize your YouTube videos with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Summarize Youtube",
    url: process.env.NEXT_PUBLIC_APP_URL || "/",
    description: "Transcribe and summarize your YouTube videos with AI.",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
