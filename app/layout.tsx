import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ankit Upadhyay — CS PhD Researcher",
  description:
    "PhD Candidate in Computer Science at RPI. Research in AI for Biodiversity Conservation, animal re-identification, foundation models for ecology, and multilingual NLP.",
  keywords: [
    "Ankit Upadhyay",
    "Computer Science PhD",
    "Animal Re-Identification",
    "Wildlife AI",
    "Foundation Models",
    "Conservation AI",
    "Multilingual NLP",
    "RPI",
  ],
  openGraph: {
    title: "Ankit Upadhyay — CS PhD Researcher",
    description:
      "Building AI for biodiversity conservation and social good. PhD student at RPI working on animal re-identification, foundation models, and multilingual NLP.",
    type: "website",
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
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
