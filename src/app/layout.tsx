import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { getChains } from "@/lib/getChainData";
import { ChainProvider } from "@/context/ChainContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superchain Registry",
  description: "Explore all the chains on the superchain ecosystem",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chains = await getChains();

  return (
    <html lang="en" className="h-full">
      <ChainProvider initialChains={chains}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
      >
        <NavBar />
        <div className="flex-grow">
          {children}
        </div>
        <footer className="bg-stone-900 text-white w-full py-2">
          <div className="container mx-auto flex gap-6 flex-wrap items-center justify-center">
            ...
          </div>
          <Toaster />
        </footer>
      </body>
      </ChainProvider>
    </html>
  );
}

