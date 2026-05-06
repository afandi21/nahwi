import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single()

    const siteName = settings?.site_name || "Nahwu"
    const tagline = settings?.tagline || "Belajar Tata Bahasa Arab Interaktif"
    const description = settings?.meta_description || "Platform modern untuk belajar Nahwu."

    return {
      title: `${siteName} - ${tagline}`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Nahwu - Belajar Tata Bahasa Arab",
      description: "Platform interaktif belajar Nahwu.",
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${amiri.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

