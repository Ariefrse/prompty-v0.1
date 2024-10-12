import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prompty - Collaborative Platform for Developers',
  description: 'Share, discover, and contribute programming prompts, code snippets, and project ideas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 pt-16">
              <Sidebar />
              <main className="flex-grow pl-16 transition-all duration-300 ease-in-out">
                {children}
              </main>
            </div>
            {/* <Footer /> */}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}