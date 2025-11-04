import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/Navbar";
import { Provider } from "@/components/ui/provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import StoreProvider from "./StoreProvider";
import LoadStore from "@/components/Redux/loadStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management Portal",
  description: "Liquid",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <LoadStore superAdmin={process.env.SUPER_ADMIN!}/>
            <Provider>
              <NavBar/>
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <AnimatedBackground/>
              {children}
              <Toaster />
            </Provider>
          </body>
        </html>
      </ClerkProvider>
    </StoreProvider>
  );
}
