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

const siteUrl = process.env.NEXTAUTH_URL || "https://digitalhub-mocha.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DigitalHub — Premium Digital Products & Services in Bangladesh",
    template: "%s | DigitalHub",
  },
  description:
    "Your trusted partner for all digital needs. Premium AI subscriptions, apps, digital marketing, web development, online courses, and software licenses in Bangladesh.",
  keywords: [
    "digital products Bangladesh",
    "AI subscriptions",
    "ChatGPT Plus Bangladesh",
    "premium apps",
    "digital marketing Bangladesh",
    "web development Bangladesh",
    "online courses",
    "bKash digital store",
    "DigitalHub",
  ],
  authors: [{ name: "DigitalHub" }],
  creator: "DigitalHub",
  publisher: "DigitalHub",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "DigitalHub — Premium Digital Products & Services in Bangladesh",
    description:
      "Access authentic AI subscriptions, professional design tools, and digital marketing services with instant delivery and secure bKash/Nagad payments.",
    url: siteUrl,
    siteName: "DigitalHub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 800,
        alt: "DigitalHub Bangladesh Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalHub — Premium Digital Products & Services in Bangladesh",
    description:
      "Authentic AI subscriptions, software licenses, and digital solutions with local bKash, Nagad, and Rocket payments.",
    images: ["/images/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Global Structured Data (Organization + WebSite Schema)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "DigitalHub",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/images/logo.jpg`,
          contentUrl: `${siteUrl}/images/logo.jpg`,
          caption: "DigitalHub Bangladesh",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+8801712345678",
          contactType: "customer service",
          areaServed: "BD",
          availableLanguage: ["en", "bn"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "DigitalHub",
        description:
          "Bangladesh's trusted marketplace for authentic AI subscriptions, software licenses, and digital services.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
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
