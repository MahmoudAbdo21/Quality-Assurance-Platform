import { requireAdmin } from "@/lib/auth-helpers"
import Link from "next/link"
import { SignOutButton } from "@/components/admin/SignOutButton"

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white min-h-screen flex-shrink-0 shadow-xl">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white mb-1">لوحة الإدارة</h2>
          <p className="text-gray-400 text-sm">مرحباً، {user.name}</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/courses" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition">
            الدورات التدريبية
          </Link>
          <Link href="/admin/certificates" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition">
            الشهادات
          </Link>
          <Link href="/admin/registrations" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition">
            المسجلين
          </Link>
          <Link href="/admin/messages" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition">
            رسائل التواصل
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition">
            الإعدادات العامة
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700 absolute bottom-0 w-full md:w-64">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
