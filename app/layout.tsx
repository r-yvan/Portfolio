import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent();
  const title = `${profile.displayName} — ${profile.title}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${profile.displayName}` },
    description: profile.tagline,
    keywords: [
      profile.fullName,
      profile.displayName,
      ...profile.roles,
      profile.location,
      "React",
      "Next.js",
      "Three.js",
    ],
    authors: [{ name: profile.fullName, url: SITE_URL }],
    creator: profile.fullName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: profile.displayName,
      title,
      description: profile.tagline,
    },
    twitter: { card: "summary_large_image", title, description: profile.tagline },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Satoshi (roman + true italic, variable 300–900) from the official
            Fontshare API — the license-sanctioned way to use it on the web
            without committing the font files to this public repository. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@1,2&display=swap"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
