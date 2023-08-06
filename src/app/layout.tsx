import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import ActiveStatus from "@/components/providers/active-status";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Pusher",
    "Chat",
    "Realtime",
    "Chatterbox",
  ],
  authors: [
    {
      name: "leojuriolli7",
      url: "https://github.com/leojuriolli7",
    },
  ],
  creator: "leojuriolli7",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        className={cn(
          inter.className,
          "sm:h-screen h-[100dvh] overflow-y-auto mx-auto bg-white dark:bg-neutral-900 selection:bg-pink-500 selection:text-white"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ActiveStatus />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
