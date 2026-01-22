import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Space_Mono } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';

// Display serif - Cormorant Garamond: elegant, high-contrast, editorial luxury
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

// Body sans - Manrope: geometric, modern, distinctive but readable
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Mono - Space Mono: distinctive character for prices and technical details
const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'AXENT — Curated Chinese Fashion',
    template: '%s | AXENT',
  },
  description: 'Curated Chinese fashion brands for the global market. Quality streetwear and contemporary designs from Shanghai, Beijing, and beyond.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="font-sans min-h-screen flex flex-col antialiased bg-white text-black">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
