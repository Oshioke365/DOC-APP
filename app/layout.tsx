import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Document Collaboration App",
  description: "Upload documents, leave comments, and get AI insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
