import { prisma } from '@/lib/prisma';
import ContactForm from '@/components/public/ContactForm';

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--primary-green)] mb-4 border-b-2 border-[var(--accent-gold)] inline-block pb-2">اتصل بنا</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          نحن هنا للإجابة على استفساراتكم ودعم مسيرتكم نحو الجودة والاعتماد.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-[var(--primary-green)] mb-6">معلومات التواصل</h3>
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl ml-4 shrink-0">📍</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">العنوان</h4>
                <p className="text-gray-600">{settings?.contactAddress || '١٢ شارع الجودة، مدينة نصر، القاهرة'}</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl ml-4 shrink-0">📞</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">الهاتف</h4>
                <p className="text-gray-600" dir="ltr">{settings?.contactPhone || '+20 2 2345 6789'}</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl ml-4 shrink-0">✉️</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">البريد الإلكتروني</h4>
                <p className="text-gray-600">{settings?.contactEmail || 'info@naqaae.eg'}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-[var(--accent-gold)]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">أرسل رسالة</h3>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
