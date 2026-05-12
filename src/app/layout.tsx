import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Nexora | Student Opportunity Platform",
  description: "AI-powered platform to discover hackathons, internships, and career events.",
  keywords: ["hackathons", "internships", "students", "careers", "events"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          outfit.variable
        )}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
              <Toaster position="top-right" richColors />
            </QueryProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
