import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@repo/ui";

const fontSans = Chakra_Petch({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Grit Digital Performance - Sports Organization Websites & Event Registration",
  description: "Professional website development and event registration systems for sports organizations. Transform your digital presence with our cutting-edge solutions.",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    shortcut: "/favicon/favicon.ico",
  },
  openGraph: {
    title: "Grit Digital Performance - Sports Organization Websites & Event Registration",
    description: "Professional website development and event registration systems for sports organizations. Transform your digital presence with our cutting-edge solutions.",
    url: "https://grit-website-six.vercel.app/",
    siteName: "Grit Digital Performance",
    images: [
      {
        url: "https://grit-website-six.vercel.app/logo/gritLogo.png", // updated path
        width: 1200,
        height: 630,
        alt: "Grit Digital Performance - Sports Websites & Event Registration",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grit Digital Performance | Sports Websites & Event Registration",
    description: "Professional website development and event registration systems for sports organizations.",
    site: "@GritDigital",
    creator: "@GritDigital",
    images: [
      {
        url: "https://grit-website-six.vercel.app/logo/gritLogo.png",
        width: 1200,
        height: 630,
        alt: "Grit Digital Performance - Sports Websites & Event Registration",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}


