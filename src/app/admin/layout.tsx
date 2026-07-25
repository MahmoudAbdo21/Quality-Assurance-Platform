export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // If we just wrap children, login page will use this layout.
  // The protected routes will have their own layout wrapper for Sidebar etc.
  return <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">{children}</div>;
}
