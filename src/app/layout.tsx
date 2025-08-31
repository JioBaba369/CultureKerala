
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import dynamic from 'next/dynamic';
const AuthProvider = dynamic(() => import("@/lib/firebase/auth").then(m => m.AuthProvider), { ssr: false });
import { siteConfig } from "@/config/site";
import { Suspense } from "react";
import { AppBody } from "@/components/layout/AppBody";

// Use system fonts as fallback when Google Fonts are not available
const fontSans = {
  className: 'font-sans',
  variable: '--font-sans',
};

const fontHeading = {
  className: 'font-heading', 
  variable: '--font-heading',
};


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.meta.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.meta.description,
  keywords: siteConfig.meta.keywords,
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@culturekerala",
  },
  icons: {
    icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐘</text></svg>`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <Suspense>
            <AuthProvider>
                <AppBody>
                    {children}
                </AppBody>
                <Toaster />
            </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
