"use client";

import { toggleSubscriberStatus, deleteSubscriber } from '@/actions/admin-subscribers';
import type { NewsletterSubscriber } from '@prisma/client';

export default function SubscribersManager({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  async function handleToggle(id: string, currentStatus: boolean) {
    const res = await toggleSubscriberStatus(id, !currentStatus);
    if (res.error) alert(res.error);
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المشترك نهائياً؟')) {
      const res = await deleteSubscriber(id);
      if (res.error) alert(res.error);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">مشتركو القائمة البريدية</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">البريد الإلكتروني</th>
              <th className="p-4 font-bold border-b">الحالة</th>
              <th className="p-4 font-bold border-b">تاريخ الاشتراك</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">لا يوجد مشتركون حالياً</td>
              </tr>
            ) : (
              subscribers.map(sub => (
                <tr key={sub.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800" dir="ltr">{sub.email}</td>
                  <td className="p-4">
                    {sub.isActive ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">نشط</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">غير نشط</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500" dir="ltr">{sub.subscribedAt.toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleToggle(sub.id, sub.isActive)} className="bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-gray-200">
                        {sub.isActive ? 'إلغاء الاشتراك' : 'تفعيل'}
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-red-200">حذف</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
