import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة ضمان الجودة والاعتماد الأكاديمي - جامعة الأزهر",
  description: "نظام متكامل للاعتماد الأكاديمي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-gray-50 text-gray-800 font-sans">
        {children}
      </body>
    </html>
  );
}
