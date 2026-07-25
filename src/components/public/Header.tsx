import Link from 'next/link';

export function Header() {
  return (
    <header className="main-header text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
          <div className="bg-white p-2 rounded-full shadow-lg">
            {/* Logo placeholder */}
            <div className="w-12 h-12 bg-[var(--primary-green)] rounded-full flex items-center justify-center text-white font-bold text-xl">
              ج
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">منصة ضمان الجودة والاعتماد الأكاديمي</h1>
            <p className="text-sm text-[var(--light-yellow)]">جامعة الأزهر</p>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-6 space-x-reverse text-sm font-medium">
            <li>
              <Link href="/admin/login" className="bg-[var(--accent-gold)] text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-300 transition shadow">
                تسجيل الدخول للنظام
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Navigation Tabs */}
      <div className="tabs-navigation overflow-x-auto">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 space-x-reverse whitespace-nowrap py-3">
            <li>
              <Link href="/" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">الرئيسية</Link>
            </li>
            <li>
              <Link href="/courses" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">الدورات التدريبية</Link>
            </li>
            <li>
              <Link href="/certificates" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">الشهادات المعتمدة</Link>
            </li>
            <li>
              <Link href="/forum" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">منتدى النقاش</Link>
            </li>
            <li>
              <Link href="/know-more" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">تعرف أكثر (معلومات تهمك)</Link>
            </li>
            <li>
              <Link href="/about" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">عن المنصة</Link>
            </li>
            <li>
              <Link href="/contact" className="tab-button inline-block pb-2 px-2 hover:text-[var(--primary-green)]">اتصل بنا</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
