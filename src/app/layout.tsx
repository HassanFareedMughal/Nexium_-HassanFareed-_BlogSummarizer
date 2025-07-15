// src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] }); // ✅ Loads Google font safely

export const metadata: Metadata = {
  title: "Blog Summariser",
  description: "Summarises blogs and translates summaries to Urdu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
