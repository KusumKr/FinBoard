import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinBoard - Customizable Finance Dashboard",
  description: "Build your own real-time finance monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

