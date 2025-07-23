import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from '@/components/AuthContext';
import { Inter, Poppins } from 'next/font/google';
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({ subsets: ['latin'], weight: ["400"] });
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Election Management System",
  description: "Manage and participate in elections with ease and security.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>        
        {/* <Navbar /> */}
        <AuthProvider>
        <main className="flex-grow">
          {children}
        </main>
          </AuthProvider>
        <footer className="w-full bg-gray-800 text-white py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="flex justify-between">
              Election Management System. All rights reserved. 
              <Link href="/about">
                <button className="underline">About</button>
              </Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}