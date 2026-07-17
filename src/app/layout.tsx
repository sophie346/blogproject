import type { Metadata } from "next";
import { Source_Serif_4, Syne } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/lib/config";
import { getTenant } from "@/lib/tenant";
import { themeTokensToStyle } from "@/lib/theme";
import { absoluteUrl, getDefaultOgImage, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ogImage = getDefaultOgImage();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} Blog`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author, url: absoluteUrl("/") }],
  creator: siteConfig.author,
  publisher: siteConfig.name,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: absoluteUrl("/"),
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: `${siteConfig.name} Blog`,
    description: siteConfig.description,
    images: ogImage
      ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: siteConfig.name,
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Blog`,
    description: siteConfig.description,
    images: ogImage ? [ogImage] : undefined,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = getTenant();
  const themeStyle = themeTokensToStyle(tenant.theme.tokens);

  return (
    <html
      lang={siteConfig.language}
      className={`${syne.variable} ${sourceSerif.variable} theme-${tenant.theme.id} h-full antialiased`}
      style={themeStyle}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <div className="site-shell flex min-h-full flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
