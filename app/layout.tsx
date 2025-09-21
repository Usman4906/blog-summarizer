import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ORIGIN_URL } from "@/utils/helpers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SnapSummary - Blog & PDF Summarizer | AI-Powered Article Summaries",
  description:
    "SnapSummary is an AI-powered web app for summarizing blogs, articles, and PDF documents. Instantly get concise, SEO-friendly summaries to save time and boost productivity.",
  openGraph: {
    images: [{ url: "/opengrapgh-image.png" }],
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${inter.variable} antialiased`} suppressHydrationWarning>
          <div className="flex relative min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
