import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/budget-navbar";


export const metadata: Metadata = {
  title: "Personal Finances",
  description: "Luanjie's Finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" />
        
      </head>
      <body
          className="font-sans bg-cover bg-center min-h-screen bg-[url('/background.jpg')] dark:bg-[url('/dark.jpg')]"

      >
        <Navbar className="absolute top-2" />
        <main>{children}</main>
      </body>
    </html>
  );
}
