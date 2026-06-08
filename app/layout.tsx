import type { Metadata } from "next";
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
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
