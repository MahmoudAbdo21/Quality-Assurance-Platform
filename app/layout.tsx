import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة ضمان الجودة والاعتماد الأكاديمي - جامعة الأزهر",
  description: "البيئة الرقمية لضمان الجودة والتدريب - نظام متكامل للاعتماد الأكاديمي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="main-header">
            <div className="brand">البيئة الرقمية لضمان الجودة والتدريب</div>
            <div style={{ fontSize: "14px" }}>نظام متكامل للاعتماد الأكاديمي</div>
        </header>
        {children}
      </body>
    </html>
  );
}
