
import type { Metadata } from "next";
import { AppBody } from "@/components/layout/AppBody";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth";
import { siteConfig } from "@/config/site";
import { Inter, Poppins } from 'next/font/google'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const fontHeading = Poppins({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '600', '700'],
})


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
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌴</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <AuthProvider>
            <AppBody>{children}</AppBody>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
