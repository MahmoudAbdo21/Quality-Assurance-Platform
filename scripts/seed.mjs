import { Client } from 'pg';

const courses = [
    { id: 1, title: 'المفاهيم الأساسية لنظم الجودة', description: 'التعرف على المبادئ والمفاهيم الأساسية لضمان الجودة والاعتماد الأكاديمي وثقافة الجودة.' },
    { id: 2, title: 'التقويم الذاتي', description: 'إكساب المتدربين مهارات وآليات تنفيذ التقويم الذاتي للمؤسسات وتحديد مجالات التحسين.' },
    { id: 3, title: 'الدراسة الذاتية', description: 'كيفية إعداد وصياغة وثيقة الدراسة الذاتية وفقاً لمعايير الهيئة القومية لضمان جودة التعليم.' },
    { id: 4, title: 'معايير الاعتماد المؤسسي والبرامجي', description: 'دراسة تفصيلية لمعايير الاعتماد وكيفية استيفاء مؤشراتها وشواهدها وأدلتها بدقة.' },
    { id: 5, title: 'توصيف البرامج والمقررات', description: 'التدريب العملي على الصياغة الصحيحة لتوصيف البرامج والمقررات الدراسية وفق اللوائح.' },
    { id: 6, title: 'نواتج التعلم', description: 'كيفية صياغة نواتج التعلم المستهدفة (ILOs) للمقررات وطرق قياسها وربطها بأساليب التدريس.' },
    { id: 7, title: 'مؤشرات الأداء', description: 'تحديد وصياغة مؤشرات الأداء الرئيسية (KPIs) وطرق قياس مدى تحقق الأهداف التشغيلية.' },
    { id: 8, title: 'التخطيط الاستراتيجي', description: 'مهارات إعداد الخطة الاستراتيجية متضمنة الرؤية والرسالة والتحليل البيئي (SWOT).' },
    { id: 9, title: 'إعداد الاستبيانات وتحليل نتائجها', description: 'تصميم الاستبيانات وتحليل بياناتها إحصائياً لدعم اتخاذ القرار المؤسسي.' },
    { id: 10, title: 'تقارير البرامج وخطط التحسين', description: 'إعداد التقرير السنوي وبناء خطط التحسين والمتابعة المستمرة لغلق دائرة الجودة.' }
];

const forumTopics = [
    {
        author: 'د. أحمد كمال',
        title: 'أفضل ممارسات نشر ثقافة الجودة بين الطلاب',
        content: 'كيف يمكننا تحفيز الطلاب على المشاركة الفعالة في تعبئة استبيانات تقويم المقررات بصدق وموضوعية؟ شاركونا تجاربكم الناجحة في هذا السياق.',
        reply_count: 5,
        like_count: 12,
        created_at: '2026-07-15T00:00:00Z'
    },
    {
        author: 'م. منى سعيد',
        title: 'تحديات صياغة نواتج التعلم (ILOs) للمقررات العملية',
        content: 'نرجو تبادل الخبرات حول كيفية صياغة نواتج تعلم تقيس المهارات العملية والأدائية بشكل دقيق ومباشر داخل المعامل والمدرجات التطبيقية.',
        reply_count: 12,
        like_count: 28,
        created_at: '2026-07-13T00:00:00Z'
    }
];

async function runSeed() {
    const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    
    if (!connectionString) {
        console.error("Error: DATABASE_URL or DATABASE_URL_UNPOOLED must be set.");
        process.exit(1);
    }

    console.log("Connecting to the database for seeding...");
    const client = new Client({ connectionString });
    
    try {
        await client.connect();

        console.log("Seeding courses...");
        for (const course of courses) {
            await client.query(
                \`INSERT INTO courses (id, title, description, sort_order) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (id) DO UPDATE 
                 SET title = EXCLUDED.title, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order\`,
                [course.id, course.title, course.description, course.id]
            );
        }

        console.log("Seeding forum topics...");
        // Check if we already have the initial seed topics by title
        for (const topic of forumTopics) {
            const res = await client.query('SELECT 1 FROM forum_topics WHERE title = $1', [topic.title]);
            if (res.rowCount === 0) {
                await client.query(
                    \`INSERT INTO forum_topics (author, title, content, reply_count, like_count, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6)\`,
                    [topic.author, topic.title, topic.content, topic.reply_count, topic.like_count, topic.created_at]
                );
            }
        }

        console.log("Seeding completed successfully.");
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runSeed();
