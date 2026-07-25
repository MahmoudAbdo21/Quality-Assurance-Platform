"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الدورات التدريبية', href: '/courses' },
    { name: 'الشهادات المعتمدة', href: '/certificates' },
    { name: 'منتدى النقاش', href: '/forum' },
    { name: 'تعرف أكثر', href: '/know-more' },
    { name: 'عن المنصة', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <header className="main-header text-white sticky top-0 z-50 shadow-md">
      {/* Brand Section */}
      <div className="bg-[var(--primary-green)]">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center md:items-start justify-center gap-3">
          <div className="flex-shrink-0 bg-white p-1 rounded-lg shadow-sm">
            <Image 
              src="/brand/quality-accreditation-logo.svg" 
              alt="شعار منصة ضمان الجودة والاعتماد الأكاديمي"
              width={68}
              height={68}
              className="object-contain w-12 h-12 md:w-[68px] md:h-[68px]"
              priority
            />
          </div>
          <div className="flex flex-col text-center md:text-right mt-1 md:mt-2">
            <h1 className="text-xl md:text-[28px] md:leading-tight font-bold text-white">منصة ضمان الجودة والاعتماد الأكاديمي</h1>
            <p className="text-sm md:text-base font-semibold text-[var(--light-yellow)] mt-1">جامعة الأزهر</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="tabs-navigation bg-white w-full border-b border-gray-200">
        <div className="w-full overflow-x-auto">
          <ul className="flex min-w-max md:w-full md:justify-center items-center gap-4 md:gap-8 py-3 px-4 text-sm md:text-base font-bold text-gray-700">
            {navItems.map(item => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`inline-block pb-1 px-1 md:px-2 transition-colors border-b-[3px] ${
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
