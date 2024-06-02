import "@/app/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import AppNavbar from "./ui/core/navbar";
import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/db/user";

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home - Lookout",
  description: "AI-Powered Project Management Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  const session = await auth();

  if (session && session.user?.id) {
    user = await getUser({ id: +session.user.id });
  }

  return (
    <html lang="en" className="light">
      <body className={`${inter.className} antialiased`}>
        <AppNavbar user={user} />
        <div className="mt-8 mb-12 sm:ps-12 sm:pe-12 md:ps-28 md:pe-28 lg:ps-32 lg:pe-32 xl:ps-36 xl:pe-36 2xl:ps-48 2xl:pe-48 3xl:ps-64 3xl:pe-64">
          {children}
        </div>
      </body>
    </html>
  );
}
