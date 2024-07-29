import type { Metadata } from "next";
import {Jost}  from "next/font/google";
import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediamasses",
  description: "Buy Social Media Following from Us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <main className="p-4 max-w-7xl m-auto min-w-[300px] ">
    <body className={inter.className}>{children}</body>
    </main>
    </html>
  );
}
