import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Backdrop } from "@/components/visual/Backdrop";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { site } from "@/lib/site";

const title = `${site.displayName} — Software Engineer & Designer`;

export const metadata: Metadata = {
  metadataBase: new URL("https://r-yvan.vercel.app"),
  title: {
    default: title,
    template: `%s — ${site.displayName}`,
  },
  description: site.tagline,
  keywords: [
    "Yvan Rubuto",
    "Rubuto Yvan",
    "Software Engineer",
    "Full-Stack Developer",
    "UI/UX Designer",
    "Kigali",
    "Rwanda",
    "React",
    "Next.js",
    "Three.js",
  ],
  authors: [{ name: site.fullName, url: site.socials.github.url }],
  creator: site.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://r-yvan.vercel.app",
    siteName: site.displayName,
    title,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <SmoothScroll>
          <Backdrop />
          <CustomCursor />
          <ScrollProgress />
          <div className="relative z-10">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
