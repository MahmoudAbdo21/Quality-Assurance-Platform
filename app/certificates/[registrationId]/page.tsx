import { getRegistrationById } from '../../../lib/repositories/registrations';
import { getVisitorId } from '../../../lib/auth/visitor';
import { getSession } from '../../../lib/auth/admin';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CertificatePage({ params }: { params: { registrationId: string } }) {
    const { registrationId } = params;

    let registration;
    try {
        registration = await getRegistrationById(registrationId);
    } catch (e) {
        return notFound();
    }

    if (!registration) {
        return notFound();
    }

    const visitorId = getVisitorId();
    const adminSession = await getSession();

    if (registration.visitor_id !== visitorId && !adminSession) {
        // Return 404 instead of 401 to not disclose existence
        return notFound();
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div className="certificate-print-frame" id="certificateFrame" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="cert-header">شهادة إتمام برنامج تدريبي</div>
                <div className="cert-sub">مركز ضمان الجودة والتدريب الأكاديمي</div>
                <div className="cert-body">
                    تشهد إدارة المركز بأن السيد / السيدّة: <span className="highlight-text">{registration.full_name}</span>، 
                    البالغ من العمر (<span className="highlight-text">{registration.age}</span>) عاماً والمقيم في (<span className="highlight-text">{registration.address}</span>)، <br/>
                    والمقيد بـ <span className="highlight-text">{registration.university}</span> - <span className="highlight-text">{registration.college}</span> 
                    باعتباره حاصلاً على درجة: (<span className="highlight-text">{registration.degree}</span>) في تخصص: (<span className="highlight-text">{registration.specialty}</span>)، <br/>
                    قد اجتاز بنجاح متطلبات البرنامج التدريبي التفاعلي والمعنون بـ:<br/>
                    <div style={{ margin: "15px 0", fontSize: "20px", fontWeight: "bold", color: "var(--primary-color)", textShadow: "1px 1px 1px #eee" }}>
                        " {registration.course_name} "
                    </div>
                    والذي تم عقده وتنظيمه رقمياً لرفع كفاءة أطراف المنظومة التعليمية في مجالات الجودة والاعتماد، واستوفى كافة أدوات القياس والتقييم المطلوبة في تاريخ: <span className="highlight-text">{new Date(registration.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>.
                </div>
                <div className="cert-footer-row">
                    <div><strong>إدارة مركز ضمان الجودة</strong><br/><br/>ــــــــــــــــــــــــــــــــــــــــ</div>
                    <div><strong>إدارة التدريب وتطوير القدرات</strong><br/><br/>ــــــــــــــــــــــــــــــــــــــــ</div>
                </div>
            </div>
        </div>
    );
}
