import type { Metadata } from "next";
import {Jost}  from "next/font/google";
import "./globals.css";
import  SessionProvider from "../components/SessionProvider";
import { CartProvider } from "@/lib/CardContext";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

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
    <body className={inter.className}>
    <CartProvider>
    <SessionProvider>
    <main className="p-4 max-w-7xl m-auto min-w-[300px] ">
    <Header />
    {children}
            <Toaster />

    </main>
    </SessionProvider>
    </CartProvider>
    
    </body>
    </html>
  );
}
