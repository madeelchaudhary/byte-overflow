import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/store/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "Byte Overflow | Stack Overflow for Developers",
  description: "Stack Overflow for Developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ClerkProvider
        appearance={{
          elements: {
            formButtonPrimary: "primary-gradient",
            footerActionLink: "primary-text-gradient hover:text-primary-500",
          },
        }}
      >
        <html
          lang="en"
          className={`${inter.variable} ${spaceGrotesk.variable}`}
        >
          <body>{children}</body>
        </html>
      </ClerkProvider>
    </ThemeProvider>
  );
}
