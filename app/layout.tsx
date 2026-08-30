import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Taufiqur Rohman S | Data Analyst & Web Developer",
    template: "%s | Taufiqur Rohman S",
  },
  description:
    "Interactive portfolio & CMS for Taufiqur Rohman S, Informatics student specializing in Data Analysis, Intelligent Computing & Web Development.",
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
