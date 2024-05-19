import "@/app/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
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
        <Providers>
          <AppNavbar user={user} />
          <div className="mt-8 sm:ps-12 sm:pe-12 md:ps-24 md:pe-24 lg:ps-36 lg:pe-36 xl:ps-48 xl:pe-48 2xl:ps-64 2xl:pe-64 3xl:ps-80 3xl:pe-80">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
