"use client"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/admin/login" })} 
      className="w-full text-right px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded transition font-bold"
    >
      تسجيل الخروج
    </button>
  )
}
