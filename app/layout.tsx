import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
  Cormorant_Infant,
} from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"], // include Japanese glyphs
  weight: ["400", "500", "700"], // pick the weights you need
  display: "swap",
});

// const shipporiMincho = Shippori_Mincho({
//   variable: "--font-shippori-mincho",
//   subsets: ["latin"],
//   weight: ["400", "500", "700"], // optional, depending on needs
//   display: "swap",
// });

const cormorantInfant = Cormorant_Infant({
  subsets: ["latin"], // Cormorant Infant only supports "latin"
  variable: "--font-cormorant-infant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"], // choose weights you need
});

export const metadata: Metadata = {
  title: "Star Shop",
  description: "Online Shopping Platform",
  keywords: ["star shop", "online shopping", "shopping platform"],
  icons: {
    icon: "/favico.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta
        name="google-site-verification"
        content="E4e6CtNquAlMc678xcfMpyT2J1xvR0NCwXgfnYlFBzM"
      />
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id=GTM-5TPCD7GP'+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5TPCD7GP');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16985761571"
          strategy="afterInteractive"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16985761571');
            `,
          }}
          strategy="afterInteractive"
          id="gtag-script"
        />
        {/* Event snippet for Contact conversion page */}
        <Script
          id="gtag-contact-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {'send_to': 'AW-16985761571/vXflCKfa1dMaEKPOuKM_'});
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${cormorantInfant.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript id="gtm-noscript">
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5TPCD7GP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>
          {children}

          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
