import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Axom AI - Assam's First AI Study Platform",
  description: "Axom AI is Assam's premium AI-powered education startup. We explain complex science, math, and social topics in simple Assamese with personalized practice, mock interviews, and notes breakdown.",
  keywords: [
    "Axom AI", "AI study platform Assam", "Assamese AI learning", "AI education Assam",
    "AI study assistant Assam", "Assam AI education", "Assamese study AI",
    "Rural AI education India", "AI learning platform Assam", "Assamese learning app"
  ],
  alternates: {
    canonical: "https://axom.ai",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Axom AI",
  },
  openGraph: {
    title: "Axom AI - Assam's First AI Study Platform",
    description: "Axom AI is Assam's premium AI-powered education startup. We explain complex science, math, and social topics in simple Assamese.",
    url: "https://axom.ai",
    siteName: "Axom AI",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://axom.ai/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Axom AI Study Assistant",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axom AI - Assam's First AI Study Platform",
    description: "Assam's first AI learning assistant tailored for students. Study in simple Assamese and boost your scores.",
    images: ["https://axom.ai/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://axom.ai/#organization",
      "name": "Axom AI",
      "url": "https://axom.ai",
      "logo": "https://axom.ai/logo.png",
      "description": "Assam's First AI-Powered Study Assistant. Bridging the gap in rural Indian education using generative AI and local language instruction.",
      "sameAs": [
        "https://facebook.com/axom.ai",
        "https://twitter.com/axom_ai",
        "https://instagram.com/axom.ai"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://axom.ai/#website",
      "url": "https://axom.ai",
      "name": "Axom AI",
      "publisher": {
        "@id": "https://axom.ai/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://axom.ai/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Verification tags for search engines */}
        <meta name="google-site-verification" content="google-verification-code-axom-ai" />
      </head>
      <body className={clsx(outfit.className, "min-h-screen bg-background text-foreground antialiased")}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
