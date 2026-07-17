import type { Metadata } from "next";
import { Source_Serif_4, Syne } from "next/font/google";
import { ComingSoon } from "@/components/ComingSoon";
import { ThemeCustomCss } from "@/components/ThemeCustomCss";
import { ThemeFooter } from "@/components/themed/ThemeFooter";
import { ThemeHeader } from "@/components/themed/ThemeHeader";
import { getSiteConfig } from "@/lib/config";
import { getTenantOrNull } from "@/lib/tenant";
import { themeTokensToStyle } from "@/lib/theme";
import { absoluteUrl, getDefaultOgImage, getSiteUrl } from "@/lib/seo";
import { sanitizeCustomCss } from "@/lib/sanitize-html";
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

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantOrNull();
  if (!tenant) {
    return {
      title: "Coming soon",
      description: "This site isn’t available yet.",
      robots: { index: false, follow: false },
    };
  }

  const siteConfig = await getSiteConfig();
  const ogImage = await getDefaultOgImage();
  const siteUrl = await getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteConfig.name} Blog`,
      template: `%s · ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author, url: await absoluteUrl("/") }],
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
      canonical: await absoluteUrl("/"),
      types: {
        "application/rss+xml": await absoluteUrl("/feed.xml"),
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: await absoluteUrl("/"),
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenantOrNull();

  if (!tenant) {
    return (
      <html
        lang="en"
        className={`${syne.variable} ${sourceSerif.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full" suppressHydrationWarning>
          <ComingSoon />
        </body>
      </html>
    );
  }

  const siteConfig = await getSiteConfig();
  const themeStyle = themeTokensToStyle(tenant.theme.tokens);
  const customCss = sanitizeCustomCss(tenant.theme.customCss);

  return (
    <html
      lang={siteConfig.language}
      className={`${syne.variable} ${sourceSerif.variable} theme-${tenant.theme.id} h-full antialiased`}
      style={themeStyle}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <ThemeCustomCss css={customCss} />
        <div className="site-shell flex min-h-full flex-col">
          <ThemeHeader />
          <main className="flex-1">{children}</main>
          <ThemeFooter />
        </div>
      </body>
    </html>
  );
}
