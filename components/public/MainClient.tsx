'use client';

import { useState, useEffect, FormEvent } from 'react';
import { submitRegistrationAction, submitForumTopicAction, submitContactMessageAction } from '../../app/actions/public';
import Link from 'next/link';

export default function MainClient({ initialCourses, initialForumTopics, registrations, dbError }: any) {
    const [activeTab, setActiveTab] = useState('home');
    const [knowSlideIdx, setKnowSlideIdx] = useState(0);
    const [aboutSlideIndex, setAboutSlideIndex] = useState(0);
    
    // Modals state
    const [regModalOpen, setRegModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [newTopicModalOpen, setNewTopicModalOpen] = useState(false);
    const [certPrintModalOpen, setCertPrintModalOpen] = useState(false);
    const [certData, setCertData] = useState<any>(null);

    const totalRegs = registrations.length;
    const isRegistered = (courseId: number) => registrations.some((r: any) => r.course_id === courseId);

    // Sliders effect
    useEffect(() => {
        const knowTimer = setInterval(() => {
            if (activeTab === 'know-more') {
                setKnowSlideIdx((prev) => (prev + 1) % 8);
            }
        }, 6000);
        
        const aboutTimer = setInterval(() => {
            if (activeTab === 'about') {
                setAboutSlideIndex((prev) => (prev + 1) % 7);
            }
        }, 4500);

        return () => { clearInterval(knowTimer); clearInterval(aboutTimer); };
    }, [activeTab]);

    if (dbError) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                <h2>عذراً، حدث خطأ في الاتصال بقاعدة البيانات.</h2>
                <p>يرجى التأكد من إعدادات الاتصال.</p>
            </div>
        );
    }

    const handleRegistrationSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('course_id', selectedCourse.id.toString());
        
        const res = await submitRegistrationAction(formData);
        if (res.error) {
            alert(res.error);
        } else {
            alert(`تم الحفظ بنجاح! شهادة دورة "${selectedCourse.title}" أصبحت متاحة للطباعة.`);
            setRegModalOpen(false);
        }
    };

    const handleNewTopicSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const res = await submitForumTopicAction(formData);
        if (res.error) {
            alert(res.error);
        } else {
            alert('تم نشر موضوعك بنجاح في المنتدى.');
            setNewTopicModalOpen(false);
        }
    };

    const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const res = await submitContactMessageAction(formData);
        if (res.error) {
            alert(res.error);
        } else {
            alert('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
            (e.target as HTMLFormElement).reset();
        }
    };

    const openCertificatePreview = (reg: any) => {
        setCertData(reg);
        setCertPrintModalOpen(true);
    };

    const knowSlidesContent = [
        { title: "1. ثقافة الجودة الشاملة (TQM)", desc: "التزام مؤسسي كامل بالارتقاء بكافة مفاصل العملية التعليمية والإدارية لتحقيق التميز، لتصبح الجودة أسلوب حياة وليس مجرد متطلب شكلي." },
        { title: "2. التركيز المستمر على الطلاب", desc: "الجودة الحقيقية تبدأ بتفهم احتياجات الطلاب والمجتمع، والعمل الدؤوب على تجاوز توقعاتهم وتطوير مهاراتهم التنافسية." },
        { title: "3. القيادة الأكاديمية الفعالة", desc: "توحيد الرؤية والرسالة لتهيئة بيئة تدعم الابتكار، حيث تلعب القيادة الدور المحوري في توجيه المؤسسة نحو الاعتماد." },
        { title: "4. التحسين المستمر (Kaizen)", desc: "عملية ديناميكية لا تتوقف، تعتمد على التقييم الدوري وتحديث البرامج والمقررات لمواكبة التطورات العالمية المتسارعة." },
        { title: "5. منهجية إدارة العمليات", desc: "إدارة الأنشطة الأكاديمية والموارد كعمليات مترابطة، مما يضمن كفاءة المخرجات وتقليل الهدر في الوقت والجهد." },
        { title: "6. القرارات المبنية على الأدلة", desc: "الاعتماد الكلي على تحليل البيانات الدقيقة، واستبيانات التقييم، ومؤشرات الأداء (KPIs) لاتخاذ قرارات تطويرية صائبة." },
        { title: "7. مشاركة جميع الأطراف المعنية", desc: "الجودة مسؤولية جماعية، تتطلب تضافر وتفاعل الإدارة، وأعضاء هيئة التدريس، والطلاب، وسوق العمل لبناء شراكات ناجحة." },
        { title: "8. الاعتماد كأداة وليس غاية", desc: "الحصول على شهادة الاعتماد هو تتويج لجهود الجودة، ولكنه يمثل نقطة الانطلاق نحو مرحلة جديدة من التميز والمنافسة الدولية." }
    ];

    const aboutSlidesContent = [
        { title: "1. مفهوم الجودة الشاملة", desc: "الجودة ممارسة يومية ترتكز على إتقان العمل الأكاديمي." },
        { title: "2. الاعتماد المؤسسي والبرامجي", desc: "الاعتراف الرسمي بكفاءة المؤسسة وفقاً للمعايير القياسية للهيئة القومية." },
        { title: "3. دورة التحسين (كايزن)", desc: "التخطيط، التنفيذ، التقييم، والمراجعة بشكل دائم لضمان استدامة الريادة." },
        { title: "4. نواتج التعلم المستهدفة (ILOs)", desc: "تُقاس الجودة بما يكتسبه المتعلم فعلياً من مهارات ومعارف قابلة للتطبيق." },
        { title: "5. المشاركة المجتمعية", desc: "الجودة تتطلب تضافر جهود الطلاب وأعضاء هيئة التدريس والمجتمع المدني." },
        { title: "6. الشفافية والمحاسبية", desc: "توفير أدلة وشواهد دقيقة تدعم اتخاذ القرارات الإدارية المبنية على البيانات." },
        { title: "7. الرقمنة والابتكار الأكاديمي", desc: "التحول الرقمي هو الأداة الرئيسية لتسريع عمليات الجودة وتحليل المؤشرات." }
    ];

    return (
        <>
            <nav className="tabs-navigation">
                <button className={`tab-button ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>الرئيسية</button>
                <button className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>الدورات التدريبية</button>
                <button className={`tab-button ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>الشهادات والاعتمادات</button>
                <button className={`tab-button ${activeTab === 'forum' ? 'active' : ''}`} onClick={() => setActiveTab('forum')}>منتدى النقاش</button>
                <button className={`tab-button ${activeTab === 'know-more' ? 'active' : ''}`} onClick={() => setActiveTab('know-more')}>اعرف المزيد</button>
                <button className={`tab-button ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>من نحن</button>
                <button className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>اتصل بنا</button>
            </nav>

            <main className="content-container">
                {/* Home */}
                <section id="home" className={`tab-content ${activeTab === 'home' ? 'active' : ''}`}>
                    <div className="hero-section">
                        <h1 style={{ color: "var(--primary-color)", marginBottom: "10px" }}>أهلاً بكم في بيئة التدريب التفاعلية الشاملة</h1>
                        <p>نظام ذكي لجمع بيانات المتدربين وبناء الكفايات وإصدار وثائق الاجتياز المعتمدة فورياً، مصمم لتقديم الدعم وبناء قدرات الطلاب وأعضاء هيئة التدريس في مجالات الجودة والاعتماد.</p>
                        
                        <div className="stats-row">
                            <div className="stat-item">
                                <h2>10</h2>
                                <p>البرامج المتاحة</p>
                            </div>
                            <div className="stat-item">
                                <h2 id="myRegistrationCount" style={{ color: "var(--accent-color)" }}>{totalRegs}</h2>
                                <p>الدورات المسجلة</p>
                            </div>
                            <div className="stat-item">
                                <h2 id="myCertificatesCount" style={{ color: "var(--success-color)" }}>{totalRegs}</h2>
                                <p>الشهادات المكتسبة</p>
                            </div>
                        </div>

                        <h3 style={{ textAlign: "center", color: "var(--primary-color)", marginTop: "50px" }}>أدوات القياس والتقييم الأساسية</h3>
                        <div className="horizontal-grid" style={{ marginTop: "25px" }}>
                            <div className="interactive-card" style={{ minWidth: "280px" }}>
                                <h3 style={{ color: "var(--secondary-color)" }}>1. الاختبار التحصيلي</h3>
                                <p>قياس الجوانب المعرفية ومستويات التذكر والفهم والتطبيق لدى المتدربين لضمان جودة المخرجات بدقة.</p>
                            </div>
                            <div className="interactive-card" style={{ minWidth: "280px" }}>
                                <h3 style={{ color: "var(--secondary-color)" }}>2. بطاقة ملاحظة الأداء</h3>
                                <p>رصد الجوانب المهارية والعملية أثناء التطبيقات الميدانية وورش العمل ومقارنتها بمعايير الاعتماد.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses */}
                <section id="courses" className={`tab-content ${activeTab === 'courses' ? 'active' : ''}`}>
                    <h2 style={{ textAlign: "center", marginBottom: "30px", color: "var(--primary-color)" }}>برامج الجودة والاعتماد الأكاديمي</h2>
                    <div className="horizontal-grid">
                        {initialCourses.map((course: any) => {
                            const registered = isRegistered(course.id);
                            return (
                                <div key={course.id} className="interactive-card" id={`course-card-${course.id}`}>
                                    <div>
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                    </div>
                                    <button 
                                        className={`action-btn ${registered ? 'registered' : ''}`} 
                                        id={`btn-course-${course.id}`} 
                                        onClick={() => {
                                            if (!registered) {
                                                setSelectedCourse(course);
                                                setRegModalOpen(true);
                                            } else {
                                                alert("أنت مسجل بالفعل في هذا البرنامج التدريبي.");
                                            }
                                        }}
                                        style={registered ? { backgroundColor: 'var(--success-color)' } : {}}
                                    >
                                        {registered ? '✓ تم التسجيل بنجاح' : 'تسجيل الآن'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Certificates */}
                <section id="certificates" className={`tab-content ${activeTab === 'certificates' ? 'active' : ''}`}>
                    <h2 style={{ textAlign: "center", marginBottom: "10px", color: "var(--primary-color)" }}>الشهادات والاعتمادات الرقمية</h2>
                    <p style={{ textAlign: "center", marginBottom: "40px", color: "#64748b" }}>تظهر الشهادات هنا فور تسجيلك بالدورات، مدمجة ببياناتك الأكاديمية الجاهزة للطباعة.</p>
                    
                    <div className="horizontal-grid">
                        {initialCourses.map((course: any) => {
                            const reg = registrations.find((r: any) => r.course_id === course.id);
                            const unlocked = !!reg;
                            return (
                                <div key={course.id} className={`certificate-box ${unlocked ? 'unlocked' : ''}`} id={`cert-box-${course.id}`}>
                                    <span className={`status-badge ${unlocked ? 'badge-unlocked' : 'badge-locked'}`} id={`cert-badge-${course.id}`}>
                                        {unlocked ? 'متاحة للطباعة' : 'مغلقة'}
                                    </span>
                                    <h4 style={{ marginTop: "15px", color: "var(--primary-color)" }}>{`شهادة ${course.title}`}</h4>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "15px 0", flexGrow: 1 }}>تمنح للمتدرب لتوثيق الجدارة والكفاءة في هذا المجال الأكاديمي.</p>
                                    <button 
                                        className="action-btn" 
                                        id={`cert-btn-${course.id}`} 
                                        style={unlocked ? { backgroundColor: 'var(--primary-color)', cursor: 'pointer' } : { backgroundColor: '#cbd5e1', cursor: 'not-allowed' }} 
                                        disabled={!unlocked}
                                        onClick={() => openCertificatePreview(reg)}
                                    >
                                        {unlocked ? 'استعراض وطباعة الشهادة الرقمية' : 'معاينة أو طباعة الشهادة'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Forum */}
                <section id="forum" className={`tab-content ${activeTab === 'forum' ? 'active' : ''}`}>
                    <div className="hero-section" style={{ background: "transparent", boxShadow: "none", padding: "10px 0" }}>
                        <div className="forum-toolbar">
                            <h2>النقاشات الأكاديمية الفعالة</h2>
                            <button className="add-topic-btn" onClick={() => setNewTopicModalOpen(true)}>
                                <span>+</span> أضف موضوعاً جديداً
                            </button>
                        </div>
                        <div id="forumThreadsContainer">
                            {initialForumTopics.map((topic: any) => (
                                <div key={topic.id} className="forum-thread-modern">
                                    <div className="thread-avatar" style={topic.author.includes('منى') ? { background: "linear-gradient(135deg, #f39c12, #d68910)" } : {}}>
                                        {topic.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="thread-content">
                                        <div className="thread-title">{topic.title}</div>
                                        <div className="thread-meta">
                                            <span>بواسطة: {topic.author}</span>
                                            <span>تاريخ: {new Date(topic.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <p className="thread-text" style={{ whiteSpace: 'pre-wrap' }}>{topic.content}</p>
                                        <div className="thread-actions">
                                            <button className="thread-action-btn">💬 {topic.reply_count} ردود</button>
                                            <button className="thread-action-btn">👍 {topic.like_count} إعجاب</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Know More */}
                <section id="know-more" className={`tab-content ${activeTab === 'know-more' ? 'active' : ''}`}>
                    <h2 style={{ textAlign: "center", marginBottom: "30px", color: "var(--primary-color)" }}>مضامين ومعلومات هامة عن إدارة الجودة</h2>
                    <div className="know-slider-container">
                        {knowSlidesContent.map((slide, idx) => (
                            <div key={idx} className={`know-slide ${idx === knowSlideIdx ? 'active' : ''}`}>
                                <div className="know-slide-content">
                                    <h3>{slide.title}</h3>
                                    <p>{slide.desc}</p>
                                </div>
                            </div>
                        ))}
                        <button className="know-nav-btn know-prev" onClick={() => setKnowSlideIdx((prev) => (prev + 1) % 8)}>&#10095;</button> 
                        <button className="know-nav-btn know-next" onClick={() => setKnowSlideIdx((prev) => (prev - 1 + 8) % 8)}>&#10094;</button> 
                        <div className="know-dots-container" id="knowDotsWrapper">
                            {knowSlidesContent.map((_, idx) => (
                                <div key={idx} className={`know-dot ${idx === knowSlideIdx ? 'active' : ''}`} onClick={() => setKnowSlideIdx(idx)}></div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="about" className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
                    <div className="hero-section" style={{ maxWidth: "900px", margin: "0 auto", textAlign: "justify", lineHeight: "2" }}>
                        <h2 style={{ textAlign: "center", color: "var(--primary-color)", marginBottom: "20px" }}>عن المنصة وهيئة التدريب</h2>
                        <p style={{ fontSize: "16px" }}>
                            تعتبر هيئة التدريب بجامعة الأزهر صرحاً أكاديمياً رائداً يهدف إلى نشر ثقافة الجودة والاعتماد المؤسسي. وتعمل الهيئة بصفة مستمرة على توفير بيئة تفاعلية تخدم مسيرة التطوير المهني لجميع منسوبي الجامعة لتلبية الاحتياجات الأكاديمية والتقنية المعاصرة.
                        </p>
                        <p style={{ fontSize: "16px", marginTop: "15px" }}>
                            يشرف على تصميم وتطوير البرامج والمواد الأكاديمية ونظم التقويم الذاتي بالمنصة نخبة من الخبراء وأعضاء هيئة التدريس ذوي الكفاءة العالية، نذكر منهم <strong>أ.م.د. سيد سيد أحمد غريب</strong> (أستاذ تكنولوجيا التعليم المساعد)، و <strong>د. محمود عتاقي</strong>، و <strong>د. أسامة زينهم</strong>، و <strong>د. هاشم الشرنوبي</strong>، وذلك لضمان تقديم مخرجات تعليمية تحقق أعلى مقاييس الجودة وتدعم بنية التعلم الإلكتروني.
                        </p>
                    </div>

                    <h3 style={{ textAlign: "center", color: "var(--primary-color)", marginTop: "50px" }}>الركائز السبع لضمان الجودة</h3>
                    <div className="modern-slider-wrapper">
                        <div className="modern-slides-inner" id="aboutSliderInner" style={{ transform: `translateX(${aboutSlideIndex * 100}%)` }}>
                            {aboutSlidesContent.map((slide, idx) => (
                                <div key={idx} className="modern-slide">
                                    <h3>{slide.title}</h3>
                                    <p>{slide.desc}</p>
                                </div>
                            ))}
                        </div>
                        <button className="modern-nav-btn modern-prev" onClick={() => setAboutSlideIndex((prev) => (prev + 1) % 7)}>&#10095;</button> 
                        <button className="modern-nav-btn modern-next" onClick={() => setAboutSlideIndex((prev) => (prev - 1 + 7) % 7)}>&#10094;</button> 
                        <div className="modern-dots" id="aboutDots">
                            {aboutSlidesContent.map((_, idx) => (
                                <div key={idx} className={`mdot ${idx === aboutSlideIndex ? 'active' : ''}`} onClick={() => setAboutSlideIndex(idx)}></div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className={`tab-content ${activeTab === 'contact' ? 'active' : ''}`}>
                    <div className="hero-section" style={{ maxWidth: "700px", margin: "0 auto" }}>
                        <h2 style={{ color: "var(--primary-color)", marginBottom: "20px" }}>تواصل معنا</h2>
                        <p style={{ marginBottom: "25px", color: "#666" }}>نسعد باستقبال استفساراتكم واقتراحاتكم لتطوير منظومة التدريب والجودة.</p>
                        <form onSubmit={handleContactSubmit} style={{ textAlign: "right" }}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>الاسم الكريم:</label>
                                    <input type="text" name="full_name" required placeholder="أدخل اسمك" />
                                </div>
                                <div className="form-group full-width">
                                    <label>البريد الإلكتروني:</label>
                                    <input type="email" name="email" required placeholder="example@alazhar.edu.eg" />
                                </div>
                                <div className="form-group full-width">
                                    <label>الرسالة أو الاستفسار:</label>
                                    <textarea name="message" rows={5} required placeholder="اكتب رسالتك هنا..."></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <button type="submit" className="action-btn">إرسال الرسالة</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            {/* Modals */}
            {regModalOpen && selectedCourse && (
                <div id="registrationModal" className="modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setRegModalOpen(false); }}>
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setRegModalOpen(false)}>&times;</span>
                        <h3 id="regModalTitle" style={{ color: "var(--primary-color)", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
                            استمارة التسجيل ببرنامج تدريبي: {selectedCourse.title}
                        </h3>
                        <form id="courseRegForm" onSubmit={handleRegistrationSubmit}>
                            <div className="form-grid" style={{ textAlign: "right" }}>
                                <div className="form-group full-width">
                                    <label htmlFor="traineeName">الاسم الكامل (سيظهر في الشهادة):</label>
                                    <input type="text" name="full_name" id="traineeName" required placeholder="أدخل اسمك رباعياً" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="traineeAge">السن:</label>
                                    <input type="number" name="age" id="traineeAge" required min="18" placeholder="مثال: 25" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="traineeAddress">العنوان الكامل:</label>
                                    <input type="text" name="address" id="traineeAddress" required placeholder="المحافظة - المدينة" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="traineeUni">الجامعة التابع لها:</label>
                                    <input type="text" name="university" id="traineeUni" required defaultValue="جامعة الأزهر" placeholder="الجامعة" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="traineeCollege">الكلية / المعهد:</label>
                                    <input type="text" name="college" id="traineeCollege" required placeholder="الكلية المقيد بها" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="traineeDegree">الدرجة العلمية الحالية:</label>
                                    <select name="degree" id="traineeDegree" required defaultValue="عضو هيئة تدريس">
                                        <option value="" disabled>اختر الدرجة</option>
                                        <option value="طالب بكالوريوس/ليسانس">طالب بكالوريوس/ليسانس</option>
                                        <option value="طالب دبلوم">طالب دبلوم</option>
                                        <option value="باحث ماجستير">باحث ماجستير</option>
                                        <option value="باحث دكتوراه">باحث دكتوراه</option>
                                        <option value="عضو هيئة تدريس">عضو هيئة تدريس / معاون</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="traineeSpecialty">التخصص العام أو الدقيق:</label>
                                    <input type="text" name="specialty" id="traineeSpecialty" required placeholder="القسم الأكاديمي" />
                                </div>
                            </div>
                            <button type="submit" className="action-btn" style={{ backgroundColor: "var(--success-color)" }}>تأكيد الحفظ والتسجيل الفوري</button>
                        </form>
                    </div>
                </div>
            )}

            {newTopicModalOpen && (
                <div id="newTopicModal" className="modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setNewTopicModalOpen(false); }}>
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setNewTopicModalOpen(false)}>&times;</span>
                        <h3 style={{ color: "var(--primary-color)", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>إنشاء موضوع نقاش جديد</h3>
                        <form id="newTopicForm" onSubmit={handleNewTopicSubmit} style={{ textAlign: "right" }}>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label htmlFor="topicAuthor">اسم الكاتب:</label>
                                <input type="text" name="author" id="topicAuthor" required placeholder="أدخل اسمك أو صفتك الأكاديمية" />
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label htmlFor="topicTitle">عنوان الموضوع:</label>
                                <input type="text" name="title" id="topicTitle" required placeholder="اكتب عنواناً واضحاً وموجزاً" />
                            </div>
                            <div className="form-group" style={{ marginBottom: "20px" }}>
                                <label htmlFor="topicContent">محتوى النقاش:</label>
                                <textarea name="content" id="topicContent" rows={6} required placeholder="اطرح فكرتك، استفسارك، أو موضوع النقاش هنا بالتفصيل..."></textarea>
                            </div>
                            <button type="submit" className="action-btn" style={{ backgroundColor: "var(--primary-color)" }}>نشر الموضوع الآن</button>
                        </form>
                    </div>
                </div>
            )}

            {certPrintModalOpen && certData && (
                <div id="certPrintModal" className="modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setCertPrintModalOpen(false); }}>
                    <div className="modal-content" style={{ maxWidth: "800px" }}>
                        <span className="close-modal" onClick={() => setCertPrintModalOpen(false)}>&times;</span>
                        <div className="certificate-print-frame" id="certificateFrame">
                            <div className="cert-header">شهادة إتمام برنامج تدريبي</div>
                            <div className="cert-sub">مركز ضمان الجودة والتدريب الأكاديمي</div>
                            <div className="cert-body">
                                تشهد إدارة المركز بأن السيد / السيدّة: <span className="highlight-text">{certData.full_name}</span>، 
                                البالغ من العمر (<span className="highlight-text">{certData.age}</span>) عاماً والمقيم في (<span className="highlight-text">{certData.address}</span>)، <br/>
                                والمقيد بـ <span className="highlight-text">{certData.university}</span> - <span className="highlight-text">{certData.college}</span> 
                                باعتباره حاصلاً على درجة: (<span className="highlight-text">{certData.degree}</span>) في تخصص: (<span className="highlight-text">{certData.specialty}</span>)، <br/>
                                قد اجتاز بنجاح متطلبات البرنامج التدريبي التفاعلي والمعنون بـ:<br/>
                                <div style={{ margin: "15px 0", fontSize: "20px", fontWeight: "bold", color: "var(--primary-color)", textShadow: "1px 1px 1px #eee" }}>
                                    " {certData.course_name} "
                                </div>
                                والذي تم عقده وتنظيمه رقمياً لرفع كفاءة أطراف المنظومة التعليمية في مجالات الجودة والاعتماد، واستوفى كافة أدوات القياس والتقييم المطلوبة في تاريخ: <span className="highlight-text">{new Date(certData.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>.
                            </div>
                            <div className="cert-footer-row">
                                <div><strong>إدارة مركز ضمان الجودة</strong><br/><br/>ــــــــــــــــــــــــــــــــــــــــ</div>
                                <div><strong>إدارة التدريب وتطوير القدرات</strong><br/><br/>ــــــــــــــــــــــــــــــــــــــــ</div>
                            </div>
                        </div>
                        <div className="print-btn-container" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <Link href={`/certificates/${certData.id}`} target="_blank" className="action-btn" style={{ backgroundColor: "var(--primary-color)", flex: 1, textAlign: 'center', textDecoration: 'none' }}>فتح الشهادة في صفحة مستقلة للطباعة</Link>
                            <button className="action-btn" onClick={() => setCertPrintModalOpen(false)} style={{ backgroundColor: "#7f8c8d", width: "auto" }}>إغلاق المعاينة</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
