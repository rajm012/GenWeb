import type { Metadata } from "next";
import type React from "react";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GenWeb",
  description: "Generate Websites",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} relative`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <SidebarProvider defaultOpen={true}>
              <div className="relative flex min-h-screen">
                <Sidebar />
                <div className="flex-1">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
          {/* <div className="absolute top-4 right-4 flex gap-4">
            <SignedOut>
              <Button><SignInButton /></Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
