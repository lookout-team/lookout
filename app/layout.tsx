import "@/app/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import AppNavbar from "./ui/navbar";

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home - Lookout",
  description: "AI-Powered Project Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AppNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
