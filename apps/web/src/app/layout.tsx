import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "~/components/ui/sonner";
import { QueryClientProvider } from "~/lib/query-client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeContext } from "~/contexts";
import { constructMetadata } from "~/lib/utils";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <NuqsAdapter>
          <QueryClientProvider>
            <ThemeContext
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeContext>
          </QueryClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
