"use client";

import { useState } from 'react';
import { submitContact } from '@/actions/contact';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      e.currentTarget.reset();
    }
    setIsSubmitting(false);
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center font-bold">
        تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
        <button 
          onClick={() => setSuccess(false)}
          className="block w-full mt-4 text-[var(--primary-green)] underline text-sm font-normal"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">الاسم <span className="text-red-500">*</span></label>
        <input required name="fullName" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني <span className="text-red-500">*</span></label>
        <input required name="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none" dir="ltr" />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">الرسالة <span className="text-red-500">*</span></label>
        <textarea required name="message" rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary-green)] outline-none"></textarea>
      </div>

      <button 
        disabled={isSubmitting}
        type="submit" 
        className="w-full bg-[var(--primary-green)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--secondary-green)] transition disabled:opacity-50"
      >
        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
      </button>
    </form>
  );
}
