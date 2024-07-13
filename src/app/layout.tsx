import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import StoreProvider from "./storeProvider";
import { AuthWrapper } from "@/components/auth-wrapper";
import { ThemeProvider } from "@/components/next-theme-provider";
import { ToastContainer } from "react-toastify";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "-",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthWrapper>{children}</AuthWrapper>
            <ToastContainer />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
