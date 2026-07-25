"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الدورات التدريبية', href: '/courses' },
    { name: 'الشهادات المعتمدة', href: '/certificates' },
    { name: 'منتدى النقاش', href: '/forum' },
    { name: 'تعرف أكثر (معلومات تهمك)', href: '/know-more' },
    { name: 'عن المنصة', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <header className="main-header text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-center items-center text-center">
        <div className="flex flex-col items-center space-y-2 mb-4 md:mb-0">
          <div className="bg-white p-2 rounded-full shadow-lg">
            <div className="w-12 h-12 bg-[var(--primary-green)] rounded-full flex items-center justify-center text-white font-bold text-xl">
              ج
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">منصة ضمان الجودة والاعتماد الأكاديمي</h1>
            <p className="text-sm text-[var(--light-yellow)]">جامعة الأزهر</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="tabs-navigation bg-white w-full border-b border-gray-200">
        <div className="w-full overflow-x-auto">
          <ul className="flex min-w-max md:w-full md:justify-center items-center gap-6 py-3 px-4 text-sm font-bold text-gray-700">
            {navItems.map(item => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`inline-block pb-2 px-2 transition-colors border-b-2 ${
                      isActive 
                      ? 'border-[var(--primary-green)] text-[var(--primary-green)]' 
                      : 'border-transparent hover:text-[var(--primary-green)] hover:border-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
