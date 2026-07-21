import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة التحكم - ضمان الجودة",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ backgroundColor: '#f8fafc' }}>
        <header className="main-header" style={{ padding: '15px 30px' }}>
            <div className="brand" style={{ fontSize: '20px' }}>الإدارة - ضمان الجودة والتدريب</div>
        </header>
        {children}
      </body>
    </html>
  );
}
