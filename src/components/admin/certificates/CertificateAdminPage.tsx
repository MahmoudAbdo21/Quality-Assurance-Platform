"use client";

import { useState } from 'react';
import CertificateTemplatesTable from './CertificateTemplatesTable';
import CertificateIssuesTable from './CertificateIssuesTable';
import type { Certificate, Course, CertificateAward } from '@prisma/client';

type CertificateWithCourse = Certificate & { course: Course; _count: { awards: number } };
type AwardWithRelations = CertificateAward & { certificate: Certificate & { course: Course } };

export default function CertificateAdminPage({
  certificates,
  awards,
  courses
}: {
  certificates: CertificateWithCourse[];
  awards: AwardWithRelations[];
  courses: Course[];
}) {
  const [activeTab, setActiveTab] = useState<'certificates' | 'awards'>('certificates');

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">إدارة شهادات الدورات</h1>
      <div className="flex gap-4 border-b pb-2">
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 font-bold text-lg transition border-b-4 ${activeTab === 'certificates' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          شهادات الدورات
        </button>
        <button 
          onClick={() => setActiveTab('awards')}
          className={`px-4 py-2 font-bold text-lg transition border-b-4 ${activeTab === 'awards' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          الشهادات الممنوحة
        </button>
      </div>

      <div>
        {activeTab === 'certificates' ? (
          <CertificateTemplatesTable certificates={certificates} courses={courses} />
        ) : (
          <CertificateIssuesTable awards={awards} certificates={certificates} />
        )}
      </div>
    </div>
  );
}
