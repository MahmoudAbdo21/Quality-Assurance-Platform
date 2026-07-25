"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "بيانات الدخول غير صحيحة أو الحساب موقوف.";
        default:
          return "حدث خطأ ما. يرجى المحاولة مرة أخرى.";
      }
    }
    throw error;
  }
}
