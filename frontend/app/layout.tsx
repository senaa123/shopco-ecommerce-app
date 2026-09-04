import type { Metadata } from "next";
import { Archivo_Black, Geist } from "next/font/google";
import { AuthBootstrap } from "@/lib/stores/auth-bootstrap";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHOP.CO",
  description:
    "SHOP.CO — find clothes that match your style. A minimalist fashion store.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AuthBootstrap>{children}</AuthBootstrap>
      </body>
    </html>
  );
}
