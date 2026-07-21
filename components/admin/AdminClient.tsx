'use client';

import { useState } from 'react';
import { deleteRegistrationAction, deleteForumTopicAction, deleteContactMessageAction, logoutAction } from '../../app/actions/admin';
import Link from 'next/link';

export default function AdminClient({ stats, registrations, forumTopics, contactMessages }: any) {
    const [activeSection, setActiveSection] = useState('registrations');

    const handleDeleteRegistration = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا التسجيل؟ سيتم حذف الشهادة المرتبطة به.')) {
            await deleteRegistrationAction(id);
        }
    };

    const handleDeleteForumTopic = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
            await deleteForumTopicAction(id);
        }
    };

    const handleDeleteContactMessage = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
            await deleteContactMessageAction(id);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'var(--primary-color)' }}>لوحة التحكم</h1>
                <button onClick={() => logoutAction()} className="action-btn" style={{ width: 'auto', backgroundColor: '#e74c3c' }}>تسجيل الخروج</button>
            </div>

            <div className="stats-row" style={{ marginTop: '0', marginBottom: '30px' }}>
                <div className="stat-item">
                    <h2>{stats.coursesCount}</h2>
                    <p>الدورات</p>
                </div>
                <div className="stat-item">
                    <h2 style={{ color: 'var(--accent-color)' }}>{stats.registrationsCount}</h2>
                    <p>التسجيلات</p>
                </div>
                <div className="stat-item">
                    <h2 style={{ color: 'var(--success-color)' }}>{stats.forumCount}</h2>
                    <p>المواضيع</p>
                </div>
                <div className="stat-item">
                    <h2 style={{ color: '#9b59b6' }}>{stats.contactCount}</h2>
                    <p>الرسائل</p>
                </div>
            </div>

            <nav className="tabs-navigation" style={{ marginBottom: '20px', borderRadius: '10px' }}>
                <button className={`tab-button ${activeSection === 'registrations' ? 'active' : ''}`} onClick={() => setActiveSection('registrations')}>التسجيلات</button>
                <button className={`tab-button ${activeSection === 'forum' ? 'active' : ''}`} onClick={() => setActiveSection('forum')}>مواضيع المنتدى</button>
                <button className={`tab-button ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setActiveSection('contact')}>رسائل الاتصال</button>
            </nav>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
                {activeSection === 'registrations' && (
                    <div>
                        <h2 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>قائمة التسجيلات</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '10px' }}>الاسم</th>
                                        <th style={{ padding: '10px' }}>الدورة</th>
                                        <th style={{ padding: '10px' }}>الجامعة / الكلية</th>
                                        <th style={{ padding: '10px' }}>التاريخ</th>
                                        <th style={{ padding: '10px' }}>إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map((reg: any) => (
                                        <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px' }}>{reg.full_name}</td>
                                            <td style={{ padding: '10px' }}>{reg.course_name}</td>
                                            <td style={{ padding: '10px' }}>{reg.university} - {reg.college}</td>
                                            <td style={{ padding: '10px' }}>{new Date(reg.created_at).toLocaleDateString('ar-EG')}</td>
                                            <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                                                <Link href={`/certificates/${reg.id}`} target="_blank" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>الشهادة</Link>
                                                <button onClick={() => handleDeleteRegistration(reg.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {registrations.length === 0 && <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>لا توجد تسجيلات</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'forum' && (
                    <div>
                        <h2 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>مواضيع المنتدى</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {forumTopics.map((topic: any) => (
                                <div key={topic.id} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ color: 'var(--primary-color)' }}>{topic.title}</h3>
                                        <button onClick={() => handleDeleteForumTopic(topic.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>بواسطة: {topic.author} | {new Date(topic.created_at).toLocaleDateString('ar-EG')}</p>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{topic.content}</p>
                                </div>
                            ))}
                            {forumTopics.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>لا توجد مواضيع</p>}
                        </div>
                    </div>
                )}

                {activeSection === 'contact' && (
                    <div>
                        <h2 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>رسائل الاتصال</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {contactMessages.map((msg: any) => (
                                <div key={msg.id} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ color: 'var(--primary-color)' }}>{msg.full_name}</h3>
                                        <button onClick={() => handleDeleteContactMessage(msg.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>البريد: {msg.email} | {new Date(msg.created_at).toLocaleDateString('ar-EG')}</p>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                                </div>
                            ))}
                            {contactMessages.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>لا توجد رسائل</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
