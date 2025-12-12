import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "LaCarta! | Tu Menu Inteligente",
  description: "LaCarta! | Tu Menu Inteligente",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`} style={{ fontFamily: 'var(--font-poppins)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}