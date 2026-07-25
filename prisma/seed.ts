import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // Seed Admin User
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) throw new Error('ADMIN_PASSWORD not set in .env')

  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      displayName: process.env.ADMIN_DISPLAY_NAME || 'مدير النظام',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  })
  console.log(`Admin user '${adminUsername}' seeded.`)

  // Courses Data
  const coursesData = [
    { slug: 'basic-concepts', title: 'المفاهيم الأساسية لنظم الجودة', summary: 'التعرف على المبادئ والمفاهيم الأساسية لضمان الجودة والاعتماد الأكاديمي وثقافة الجودة.', description: 'التعرف على المبادئ والمفاهيم الأساسية لضمان الجودة والاعتماد الأكاديمي وثقافة الجودة.' },
    { slug: 'self-evaluation', title: 'التقويم الذاتي', summary: 'إكساب المتدربين مهارات وآليات تنفيذ التقويم الذاتي للمؤسسات وتحديد مجالات التحسين.', description: 'إكساب المتدربين مهارات وآليات تنفيذ التقويم الذاتي للمؤسسات وتحديد مجالات التحسين.' },
    { slug: 'self-study', title: 'الدراسة الذاتية', summary: 'كيفية إعداد وصياغة وثيقة الدراسة الذاتية وفقاً لمعايير الهيئة القومية لضمان جودة التعليم.', description: 'كيفية إعداد وصياغة وثيقة الدراسة الذاتية وفقاً لمعايير الهيئة القومية لضمان جودة التعليم.' },
    { slug: 'accreditation-standards', title: 'معايير الاعتماد المؤسسي والبرامجي', summary: 'دراسة تفصيلية لمعايير الاعتماد وكيفية استيفاء مؤشراتها وشواهدها وأدلتها بدقة.', description: 'دراسة تفصيلية لمعايير الاعتماد وكيفية استيفاء مؤشراتها وشواهدها وأدلتها بدقة.' },
    { slug: 'programs-description', title: 'توصيف البرامج والمقررات', summary: 'التدريب العملي على الصياغة الصحيحة لتوصيف البرامج والمقررات الدراسية وفق اللوائح.', description: 'التدريب العملي على الصياغة الصحيحة لتوصيف البرامج والمقررات الدراسية وفق اللوائح.' },
    { slug: 'learning-outcomes', title: 'نواتج التعلم', summary: 'كيفية صياغة نواتج التعلم المستهدفة (ILOs) للمقررات وطرق قياسها وربطها بأساليب التدريس.', description: 'كيفية صياغة نواتج التعلم المستهدفة (ILOs) للمقررات وطرق قياسها وربطها بأساليب التدريس.' },
    { slug: 'kpis', title: 'مؤشرات الأداء', summary: 'تحديد وصياغة مؤشرات الأداء الرئيسية (KPIs) وطرق قياس مدى تحقق الأهداف التشغيلية.', description: 'تحديد وصياغة مؤشرات الأداء الرئيسية (KPIs) وطرق قياس مدى تحقق الأهداف التشغيلية.' },
    { slug: 'strategic-planning', title: 'التخطيط الاستراتيجي', summary: 'مهارات إعداد الخطة الاستراتيجية متضمنة الرؤية والرسالة والتحليل البيئي (SWOT).', description: 'مهارات إعداد الخطة الاستراتيجية متضمنة الرؤية والرسالة والتحليل البيئي (SWOT).' },
    { slug: 'questionnaires-analysis', title: 'إعداد الاستبيانات وتحليل نتائجها', summary: 'تصميم الاستبيانات وتحليل بياناتها إحصائياً لدعم اتخاذ القرار المؤسسي.', description: 'تصميم الاستبيانات وتحليل بياناتها إحصائياً لدعم اتخاذ القرار المؤسسي.' },
    { slug: 'programs-reports', title: 'تقارير البرامج وخطط التحسين', summary: 'إعداد التقرير السنوي وبناء خطط التحسين والمتابعة المستمرة لغلق دائرة الجودة.', description: 'إعداد التقرير السنوي وبناء خطط التحسين والمتابعة المستمرة لغلق دائرة الجودة.' }
  ]

  const certTitlesList = [
    "شهادة المفاهيم الأساسية للجودة", "شهادة مهارات التقويم الذاتي", "شهادة إعداد الدراسة الذاتية",
    "شهادة معايير الاعتماد", "شهادة توصيف البرامج والمقررات", "شهادة صياغة نواتج التعلم",
    "شهادة مؤشرات الأداء KPIs", "شهادة التخطيط الاستراتيجي", "شهادة تحليل الاستبيانات", "شهادة التقارير وخطط التحسين"
  ]

  for (let i = 0; i < coursesData.length; i++) {
    const course = await prisma.course.upsert({
      where: { slug: coursesData[i].slug },
      update: {},
      create: {
        slug: coursesData[i].slug,
        title: coursesData[i].title,
        summary: coursesData[i].summary,
        description: coursesData[i].description,
        displayOrder: i + 1,
      }
    });

    const existingCert = await prisma.certificate.findFirst({
      where: { courseId: course.id }
    });

    if (existingCert) {
      await prisma.certificate.update({
        where: { id: existingCert.id },
        data: {
          title: certTitlesList[i],
          description: 'تمنح للمتدرب لتوثيق الجدارة والكفاءة في هذا المجال الأكاديمي.',
          certificateBody: 'تمنح للمتدرب لتوثيق الجدارة والكفاءة في هذا المجال الأكاديمي.',
          displayOrder: i + 1,
        }
      });
    } else {
      await prisma.certificate.create({
        data: {
          courseId: course.id,
          title: certTitlesList[i],
          description: 'تمنح للمتدرب لتوثيق الجدارة والكفاءة في هذا المجال الأكاديمي.',
          certificateBody: 'تمنح للمتدرب لتوثيق الجدارة والكفاءة في هذا المجال الأكاديمي.',
          displayOrder: i + 1,
        }
      });
    }
  }
  console.log(`10 courses and certificates seeded.`)

  // Knowledge Slides
  const knowSlidesData = [
    { title: 'مفهوم الجودة', content: 'الجودة ليست وجهة نصل إليها، بل هي رحلة مستمرة من التحسين والتطوير لتلبية وتجاوز توقعات المستفيدين.' },
    { title: 'أهمية الاعتماد الأكاديمي', content: 'الاعتماد يضمن للمجتمع أن المؤسسة التعليمية تقدم خدمة ذات مستوى عالٍ وتلتزم بالمعايير الوطنية والدولية.' },
    { title: 'ثقافة الجودة', content: 'نشر الوعي بأهمية الجودة وجعلها ممارسة يومية لدى جميع العاملين في المؤسسة التعليمية.' },
    { title: 'التحسين المستمر', content: 'عملية تقييم الأداء بشكل دوري وتحديد فرص التحسين وتطبيق الحلول المبتكرة لرفع الكفاءة.' },
    { title: 'مشاركة المعنيين', content: 'إشراك الطلاب، وأعضاء هيئة التدريس، والمجتمع المحلي في عمليات التقويم والتطوير لضمان شمولية الرؤية.' },
    { title: 'المساءلة والشفافية', content: 'الالتزام بإعلان النتائج ومستوى الأداء بشفافية تامة لتعزيز الثقة وبناء جسور التواصل.' },
    { title: 'التخطيط الاستراتيجي', content: 'رسم خارطة طريق واضحة للمستقبل بناءً على تحليل دقيق للواقع وتحديد أهداف طموحة وقابلة للقياس.' },
    { title: 'التميز المؤسسي', content: 'السعي الدؤوب لتحقيق أفضل الممارسات في كافة جوانب العمل الأكاديمي والإداري للوصول للريادة.' }
  ]

  await prisma.knowledgeSlide.deleteMany({}) // Reset slides for simplicity of displayOrder seeding
  for (let i = 0; i < knowSlidesData.length; i++) {
    await prisma.knowledgeSlide.create({
      data: {
        title: knowSlidesData[i].title,
        content: knowSlidesData[i].content,
        displayOrder: i + 1
      }
    })
  }
  console.log(`8 knowledge slides seeded.`)

  // Ensure settings exist
  const count = await prisma.siteSettings.count()
  if (count === 0) {
    await prisma.siteSettings.create({ data: {} })
    console.log(`SiteSettings seeded.`)
  }
  
  // Seed initial Forum Topics
  const topic1 = await prisma.forumTopic.findFirst({ where: { title: 'أفضل ممارسات نشر ثقافة الجودة بين الطلاب' } })
  if (!topic1) {
    await prisma.forumTopic.create({
      data: {
        authorName: 'د. أحمد كمال',
        title: 'أفضل ممارسات نشر ثقافة الجودة بين الطلاب',
        content: 'كيف يمكننا تحفيز الطلاب على المشاركة الفعالة في تعبئة استبيانات تقويم المقررات بصدق وموضوعية؟ شاركونا تجاربكم الناجحة في هذا السياق.',
      }
    })
  }
  
  const topic2 = await prisma.forumTopic.findFirst({ where: { title: 'تحديات صياغة نواتج التعلم (ILOs) للمقررات العملية' } })
  if (!topic2) {
    await prisma.forumTopic.create({
      data: {
        authorName: 'م. منى سعيد',
        title: 'تحديات صياغة نواتج التعلم (ILOs) للمقررات العملية',
        content: 'نرجو تبادل الخبرات حول كيفية صياغة نواتج تعلم تقيس المهارات العملية والأدائية بشكل دقيق ومباشر داخل المعامل والمدرجات التطبيقية.',
      }
    })
  }
  console.log(`Forum topics seeded.`)

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
