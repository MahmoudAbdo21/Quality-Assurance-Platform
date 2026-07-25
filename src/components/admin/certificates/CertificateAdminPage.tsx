"use client";

import { useState } from 'react';
import CertificateTemplatesTable from './CertificateTemplatesTable';
import CertificateIssuesTable from './CertificateIssuesTable';
import type { Certificate, Course, CertificateIssue } from '@prisma/client';

type TemplateWithCourse = Certificate & { course: Course; _count: { issues: number } };
type IssueWithRelations = CertificateIssue & { certificate: Certificate & { course: Course } };

export default function CertificateAdminPage({
  templates,
  issues,
  courses
}: {
  templates: TemplateWithCourse[];
  issues: IssueWithRelations[];
  courses: Course[];
}) {
  const [activeTab, setActiveTab] = useState<'templates' | 'issues'>('templates');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b pb-2">
        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-bold text-lg transition border-b-4 ${activeTab === 'templates' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          قوالب الشهادات
        </button>
        <button 
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 font-bold text-lg transition border-b-4 ${activeTab === 'issues' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          الشهادات الصادرة
        </button>
      </div>

      <div>
        {activeTab === 'templates' ? (
          <CertificateTemplatesTable templates={templates} courses={courses} />
        ) : (
          <CertificateIssuesTable issues={issues} templates={templates} courses={courses} />
        )}
      </div>
    </div>
  );
}
