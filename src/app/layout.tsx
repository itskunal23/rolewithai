import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "RoleWithAI - AI-Powered Career Development Platform",
  description:
    "RoleWithAI is an AI-powered career development platform that helps professionals navigate their career journey through personalized guidance, skill tracking, and interactive learning experiences.",
  keywords:
    "career development, AI mentor, skill tracking, learning paths, professional growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
