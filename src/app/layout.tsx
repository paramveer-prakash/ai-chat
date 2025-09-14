import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OIDCAuthProvider } from "@/components/providers/oidc-auth-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Chat - Powered by Amazon Nova Pro",
  description: "A modern ChatGPT-like interface for AI conversations using Amazon Nova Pro model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <OIDCAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </OIDCAuthProvider>
      </body>
    </html>
  );
}