"use client";

import { useState } from 'react';
import { unlockUser, toggleUserActive, saveAdminUser } from '@/actions/admin-security';
import type { AdminUser } from '@prisma/client';

export default function SecurityManager({ users, currentUserId }: { users: AdminUser[], currentUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  function openNew() {
    setEditingUser(null);
    setIsOpen(true);
    setError('');
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user);
    setIsOpen(true);
    setError('');
  }

  async function handleUnlock(id: string) {
    if (confirm('هل أنت متأكد من فك قفل هذا الحساب؟')) {
      const result = await unlockUser(id);
      if (result.error) alert(result.error);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    if (confirm(`هل أنت متأكد من ${isActive ? 'تعطيل' : 'تفعيل'} هذا الحساب؟`)) {
      const result = await toggleUserActive(id, !isActive);
      if (result.error) alert(result.error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await saveAdminUser(formData);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsOpen(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المدراء والأمان</h2>
        <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold transition">
          + إضافة مدير جديد
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">اسم المستخدم</th>
              <th className="p-4 font-bold border-b">الاسم المعروض</th>
              <th className="p-4 font-bold border-b">الدور</th>
              <th className="p-4 font-bold border-b">الحالة</th>
              <th className="p-4 font-bold border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={`border-b transition hover:bg-gray-50 ${user.id === currentUserId ? 'bg-blue-50/20' : ''}`}>
                <td className="p-4 text-gray-800 font-mono" dir="ltr">{user.username}</td>
                <td className="p-4 font-semibold text-gray-800">
                  {user.displayName}
                  {user.id === currentUserId && <span className="mr-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">(أنت)</span>}
                </td>
                <td className="p-4">
                  {user.role === 'SUPER_ADMIN' ? 'مدير عام' : 'محرر'}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {user.isActive ? (
                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit">نشط</span>
                    ) : (
                      <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-full w-fit">معطل</span>
                    )}
                    {user.lockedUntil && new Date(user.lockedUntil) > new Date() && (
                      <span className="text-orange-600 font-bold text-xs bg-orange-50 px-2 py-1 rounded-full w-fit">مقفل أمنياً</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(user)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-blue-200">تعديل</button>
                    {user.lockedUntil && new Date(user.lockedUntil) > new Date() && (
                      <button onClick={() => handleUnlock(user.id)} className="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs rounded px-2 py-1 font-bold border border-orange-200">فك القفل</button>
                    )}
                    {user.id !== currentUserId && (
                      <button onClick={() => handleToggle(user.id, user.isActive)} className={`text-xs rounded px-2 py-1 font-bold border transition ${user.isActive ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white'}`}>
                        {user.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md fade-in p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
              {editingUser ? 'تعديل بيانات المدير' : 'إضافة مدير جديد'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {editingUser && <input type="hidden" name="id" value={editingUser.id} />}
              {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold">{error}</div>}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">اسم المستخدم (للدخول) <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="username" 
                  type="text" 
                  dir="ltr"
                  defaultValue={editingUser?.username || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-left" 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">الاسم المعروض <span className="text-red-500">*</span></label>
                <input 
                  required 
                  name="displayName" 
                  type="text" 
                  defaultValue={editingUser?.displayName || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">الدور <span className="text-red-500">*</span></label>
                <select 
                  required 
                  name="role" 
                  defaultValue={editingUser?.role || 'SUPER_ADMIN'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white" 
                >
                  <option value="SUPER_ADMIN">مدير عام (SUPER_ADMIN)</option>
                  <option value="EDITOR">محرر (EDITOR)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  كلمة المرور 
                  {!editingUser && <span className="text-red-500"> *</span>}
                </label>
                <input 
                  name="password" 
                  type="password" 
                  required={!editingUser}
                  dir="ltr"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-left" 
                />
                {editingUser && <p className="text-xs text-gray-500 mt-1">اتركه فارغاً إذا لم تكن تريد تغيير كلمة المرور. (تغيير كلمة المرور سيخرج المستخدم من كافة الجلسات النشطة).</p>}
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition font-bold text-sm"
                >
                  إلغاء
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
