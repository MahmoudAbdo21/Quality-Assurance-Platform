import Link from 'next/link';

export function Footer({ settings }: { settings: any }) {
  return (
    <footer className="bg-gray-800 text-white mt-16 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-[var(--accent-gold)] rounded-full flex items-center justify-center text-gray-900 font-bold">
                ج
              </div>
              <h3 className="text-xl font-bold">منصة الجودة والاعتماد</h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              {settings?.footerDescription || "المظلة الرسمية لضمان جودة التعليم في مصر والارتقاء به لمستوى المعايير الدولية."}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[var(--accent-gold)]">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition">الرئيسية</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">الدورات التدريبية</Link></li>
              <li><Link href="/certificates" className="hover:text-white transition">الشهادات المعتمدة</Link></li>
              <li><Link href="/about" className="hover:text-white transition">عن المنصة</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">اتصل بنا</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[var(--accent-gold)]">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-400">
              <li>{settings?.contactAddress || "١٢ شارع الجودة، مدينة نصر، القاهرة"}</li>
              <li dir="ltr" className="text-right">{settings?.contactPhone || "+20 2 2345 6789"}</li>
              <li>{settings?.contactEmail || "info@naqaae.eg"}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>{settings?.copyrightText || "جميع الحقوق محفوظة © ٢٠٢٤ الهيئة القومية لضمان جودة التعليم والاعتماد."}</p>
          <div className="mt-4 md:mt-0 space-x-4 space-x-reverse">
            <a href="#" className="hover:text-white transition">{settings?.privacyText || "سياسة الخصوصية"}</a>
            <a href="#" className="hover:text-white transition">{settings?.termsText || "شروط الاستخدام"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
