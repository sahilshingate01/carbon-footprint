import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#2d8a4e',
};

export const metadata: Metadata = {
  title: {
    default: "CarbonTrack — Carbon Footprint Awareness Platform",
    template: "%s | CarbonTrack",
  },
  description:
    "Track, analyze, and reduce your carbon footprint with AI-powered insights. Calculate emissions from transport, energy, and diet to build a more sustainable future.",
  keywords: [
    "carbon footprint",
    "carbon calculator",
    "sustainability",
    "emissions tracker",
    "eco score",
    "climate action",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CarbonTrack",
    title: "CarbonTrack — Carbon Footprint Awareness Platform",
    description:
      "Track, analyze, and reduce your carbon footprint with AI-powered insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonTrack — Carbon Footprint Awareness Platform",
    description:
      "Track, analyze, and reduce your carbon footprint with AI-powered insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-brand-blue)] focus:text-white focus:rounded focus:outline-none"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
