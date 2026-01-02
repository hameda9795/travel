import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canarische Eilanden Specialist | Expertise in Canarische Reizen",
  description: "Ontdek de mooiste hotels, stranden en bezienswaardigheden op de Canarische Eilanden. Expert reisadvies voor Gran Canaria, Tenerife, Lanzarote en Fuerteventura.",
  keywords: ["Canarische Eilanden", "Gran Canaria", "Tenerife", "Lanzarote", "Fuerteventura", "hotels", "stranden", "reizen"],
  authors: [{ name: "Canarische Eilanden Specialist" }],
  openGraph: {
    title: "Canarische Eilanden Specialist",
    description: "Expert reisadvies voor de Canarische Eilanden",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
