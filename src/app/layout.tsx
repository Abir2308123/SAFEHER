import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CloakProvider } from "@/context/CloakContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Corporate Dashboard",
  description: "Internal metrics and news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CloakProvider>
          {children}
        </CloakProvider>
      </body>
    </html>
  );
}
