import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// IBM Plex Sans — structure, headings, navigation, UI elements
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// IBM Plex Mono — technical metadata, labels, dates, tags
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

// Bell MT / Calisto MT — editorial body text and narrative (system fonts, no loading needed)

export const metadata: Metadata = {
  title: "Portfolio — Engineering, Systems & Product",
  description:
    "Engineering and product portfolio — exploring how complex systems are designed, researched, and built into resilient products.",
  openGraph: {
    title: "Portfolio — Engineering, Systems & Product",
    description:
      "Engineering and product portfolio — exploring how complex systems are designed, researched, and built.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
