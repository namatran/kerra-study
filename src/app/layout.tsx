import type { Metadata } from "next";
import { Chakra_Petch, Open_Sans, Young_Serif } from "next/font/google";
import { site } from "@/data/content";
import "./globals.css";

// Open Sans is a variable font, so every weight from 300 to 800 comes in one file.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "600"],
});

// Stands in for the original's custom wordmark.
const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${chakraPetch.variable} ${youngSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
