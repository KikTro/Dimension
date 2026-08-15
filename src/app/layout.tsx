import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Dimension — Digital Fabrication Studio | KikTro Labs",
  description:
    "Send us a shape. We'll make it real. Precision additive manufacturing for industrial designers, architects, and engineering teams.",
  keywords: [
    "Digital Fabrication",
    "Additive Manufacturing",
    "3D Printing Studio",
    "Industrial Design",
    "Architectural Models",
    "STL Slicing",
    "KikTro Labs",
    "Carbon Fiber Polymer",
    "Custom Fabrication",
  ],
  authors: [{ name: "KikTro Labs" }],
  openGraph: {
    title: "Dimension — Digital Fabrication Studio by KikTro Labs",
    description: "Send us a shape. We'll make it real. High-tolerance physical manufacturing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-paper-100 text-ink antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
