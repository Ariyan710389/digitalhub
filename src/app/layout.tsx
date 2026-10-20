import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { ToastContainer } from "@/components/ui/Toast";

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
    default: "DigitalHub — Premium Digital Products & Services",
    template: "%s | DigitalHub",
  },
  description:
    "Your trusted partner for all digital needs. Premium AI subscriptions, apps, digital marketing, web development, online courses, and more in Bangladesh.",
  keywords: [
    "digital products",
    "AI subscriptions",
    "premium apps",
    "digital marketing",
    "web development",
    "online courses",
    "Bangladesh",
    "DigitalHub",
  ],
  openGraph: {
    title: "DigitalHub — Premium Digital Products & Services",
    description:
      "Your trusted partner for all digital needs in Bangladesh.",
    type: "website",
    locale: "en_US",
    siteName: "DigitalHub",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-dark-main text-text-primary"
      >
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
