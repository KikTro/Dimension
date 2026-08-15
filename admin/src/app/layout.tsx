import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dimension Admin — Operations Portal",
  description: "Internal business management console for Dimension 3D Digital Fabrication",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-admin-bg text-admin-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
