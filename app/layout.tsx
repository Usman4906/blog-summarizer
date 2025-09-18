import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ORIGIN_URL } from "@/utils/helpers";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
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
      <html lang="en">
        <body className={`font-sans ${fontSans.variable} antialiased`}>
          <div className="flex relative min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
