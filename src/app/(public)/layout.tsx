import { Header } from "@/components/public/Header"
import { Footer } from "@/components/public/Footer"
import { prisma } from "@/lib/prisma"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findFirst()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  )
}
