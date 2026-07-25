import LoginForm from "@/components/admin/LoginForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect("/admin/courses") // Default redirect to dashboard/courses
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border-t-4 border-[var(--primary-green)]">
        <div>
          <div className="mx-auto w-16 h-16 bg-[var(--primary-green)] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">
            🛡️
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">تسجيل الدخول للإدارة</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            لوحة تحكم منصة الجودة والاعتماد
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
