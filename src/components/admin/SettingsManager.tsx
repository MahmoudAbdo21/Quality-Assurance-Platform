"use client";

import { useState } from 'react';
import { saveSiteSettings } from '@/actions/admin-settings';
import type { SiteSettings } from '@prisma/client';

export default function SettingsManager({ settings }: { settings: SiteSettings | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const result = await saveSiteSettings(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setSuccess(''), 3000);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">إعدادات الموقع</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {settings && <input type="hidden" name="id" value={settings.id} />}
        {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg text-sm font-bold">{error}</div>}
        {success && <div className="text-green-600 bg-green-50 p-4 rounded-lg text-sm font-bold">{success}</div>}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-green-700 border-b pb-2">المعلومات الأساسية</h3>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">اسم الموقع</label>
              <input required name="siteTitle" type="text" defaultValue={settings?.siteTitle || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">الشعار النصي (Subtitle)</label>
              <input required name="siteSubtitle" type="text" defaultValue={settings?.siteSubtitle || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">نص الفوتر</label>
              <input required name="footerDescription" type="text" defaultValue={settings?.footerDescription || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">حقوق النشر</label>
              <input required name="copyrightText" type="text" defaultValue={settings?.copyrightText || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-green-700 border-b pb-2">بيانات الاتصال</h3>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">العنوان</label>
              <input required name="contactAddress" type="text" defaultValue={settings?.contactAddress || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">رقم الهاتف</label>
              <input required name="contactPhone" type="text" defaultValue={settings?.contactPhone || ''} dir="ltr" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-right" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">البريد الإلكتروني</label>
              <input required name="contactEmail" type="email" defaultValue={settings?.contactEmail || ''} dir="ltr" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-right" />
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="font-bold text-lg text-green-700 border-b pb-2">الرئيسية (Hero Section)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">شارة البداية (Badge)</label>
                <input required name="heroBadge" type="text" defaultValue={settings?.heroBadge || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">العنوان الرئيسي</label>
                <input required name="heroTitle" type="text" defaultValue={settings?.heroTitle || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">الكلمة المميزة باللون الذهبي</label>
                <input required name="heroHighlightedText" type="text" defaultValue={settings?.heroHighlightedText || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">وصف الرئيسية</label>
                <textarea required name="heroDescription" rows={2} defaultValue={settings?.heroDescription || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"></textarea>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-bold text-lg text-green-700 border-b pb-2">من نحن (عن المنصة)</h3>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">المقدمة</label>
              <textarea required name="aboutIntro" rows={2} defaultValue={settings?.aboutIntro || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"></textarea>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">الرؤية</label>
                <textarea required name="visionContent" rows={3} defaultValue={settings?.visionContent || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">الرسالة</label>
                <textarea required name="missionContent" rows={3} defaultValue={settings?.missionContent || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="font-bold text-lg text-green-700 border-b pb-2">روابط التواصل الاجتماعي</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">فيسبوك</label>
                <input required name="facebookUrl" type="url" defaultValue={settings?.facebookUrl || ''} dir="ltr" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-left" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">إكس (تويتر)</label>
                <input required name="xUrl" type="url" defaultValue={settings?.xUrl || ''} dir="ltr" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-left" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">يوتيوب</label>
                <input required name="youtubeUrl" type="url" defaultValue={settings?.youtubeUrl || ''} dir="ltr" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-left" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">لينكد إن</label>
                <input required name="linkedinUrl" type="url" defaultValue={settings?.linkedinUrl || ''} dir="ltr" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-left" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex justify-end">
          <button 
            disabled={isSubmitting}
            type="submit" 
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg shadow"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </form>
    </div>
  );
}
