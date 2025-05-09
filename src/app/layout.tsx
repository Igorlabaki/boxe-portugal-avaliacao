import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boxe Portugal - Avaliações",
  description: "Sistema de avaliações do Boxe Portugal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <Providers>
              <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {children}
              </main>
            </Providers>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
