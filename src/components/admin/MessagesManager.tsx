"use client";

import { markMessageRead, deleteMessage } from '@/actions/admin-messages';
import type { ContactMessage } from '@prisma/client';

export default function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  async function handleMarkRead(id: string) {
    const res = await markMessageRead(id);
    if (res.error) alert(res.error);
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const res = await deleteMessage(id);
      if (res.error) alert(res.error);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">رسائل التواصل</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">المرسل</th>
              <th className="p-4 font-bold border-b">البريد الإلكتروني</th>
              <th className="p-4 font-bold border-b">محتوى الرسالة</th>
              <th className="p-4 font-bold border-b">التاريخ</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">لا توجد رسائل حالياً</td>
              </tr>
            ) : (
              messages.map(msg => (
                <tr key={msg.id} className={`border-b hover:bg-gray-50 transition ${msg.status === 'NEW' ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 font-semibold text-gray-800">
                    {msg.fullName}
                    {msg.status === 'NEW' && <span className="mr-2 inline-block w-2 h-2 rounded-full bg-blue-500"></span>}
                  </td>
                  <td className="p-4 text-gray-600" dir="ltr">{msg.email}</td>
                  <td className="p-4 text-gray-700 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                  <td className="p-4 text-gray-500" dir="ltr">{msg.createdAt.toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {msg.status === 'NEW' && (
                        <button onClick={() => handleMarkRead(msg.id)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-blue-200">مقروءة</button>
                      )}
                      <button onClick={() => handleDelete(msg.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-red-200">حذف</button>
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
