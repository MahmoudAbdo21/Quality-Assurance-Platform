import { prisma } from "@/lib/prisma"
import SettingsManager from "@/components/admin/SettingsManager"

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst()
  
  return (
    <div>
      <SettingsManager settings={settings} />
    </div>
  )
}
