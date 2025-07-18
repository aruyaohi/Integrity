import type { Metadata } from "next";
import { Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";
import SolanaWalletProvider from '@/app/components/SolanaWalletProvider'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "integrity",
  description: "Make Quicker, informed trade with Probe. Your Personal DYOR Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${geistMono.variable} antialiased bg-[#0d1117] text-white`}
      >
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
