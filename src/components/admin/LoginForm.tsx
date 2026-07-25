"use client";

import { useActionState } from "react";
import { authenticate } from "@/actions/auth";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="username" className="sr-only">اسم المستخدم</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] focus:z-10 sm:text-sm"
            placeholder="اسم المستخدم"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">كلمة المرور</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] focus:z-10 sm:text-sm"
            placeholder="كلمة المرور"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-[var(--primary-green)] focus:ring-[var(--primary-green)] border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 mr-2">
            تذكرني
          </label>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
          {errorMessage}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-[var(--primary-green)] hover:bg-[var(--secondary-green)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-green)] transition disabled:opacity-50"
        >
          {isPending ? 'جاري التحقق...' : 'دخول'}
        </button>
      </div>
    </form>
  );
}
