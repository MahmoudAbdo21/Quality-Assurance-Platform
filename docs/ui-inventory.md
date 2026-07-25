# UI Inventory

This document maps every relevant element from `finishq.html` to the final Next.js component or route.

## Public UI
- **Header**: `src/components/public/Header.tsx`
  - Compacted design, centered navigation, new generated logo.
- **Home Hero**: `src/app/(public)/page.tsx`
- **Statistics Section**: `src/app/(public)/page.tsx` (Displays DB-backed aggregates for Total Certificates, Courses, Registrations).
- **Course Cards**: `src/components/public/CourseCard.tsx`
- **Course Registration Dialog**: `src/components/public/CourseCard.tsx` (Contains dialog for `registerForCourse`).
- **Knowledge Slider**: `src/components/public/KnowledgeSlider.tsx`
- **Forum Topics List**: `src/app/(public)/forum/page.tsx`
- **Add Topic Dialog**: `src/components/public/forum/CreateTopicDialog.tsx`
- **Forum Topic Detail**: `src/app/(public)/forum/[topicId]/page.tsx`
- **Comments List & Form**: `src/components/public/forum/CommentForm.tsx`
- **Like Button**: `src/components/public/forum/LikeButton.tsx`
- **Footer**: `src/components/public/Footer.tsx`
- **Certificate Verification UI**: `src/app/(public)/certificates/verify/page.tsx`

## Admin UI
- **Admin Dashboard Layout**: `src/app/admin/(protected)/layout.tsx`
- **Admin Dashboard Stats**: `src/app/admin/(protected)/dashboard/page.tsx`
- **Admin Courses Manager**: `src/components/admin/CourseManager.tsx`
- **Admin Certificates Manager**: `src/components/admin/CertificateManager.tsx`
- **Admin Registrations**: `src/app/admin/(protected)/registrations/page.tsx`
- **Admin Discussions Moderation**: `src/components/admin/DiscussionsManager.tsx` (In-page)
- **Admin Contact Messages**: `src/components/admin/MessagesManager.tsx`
- **Admin Subscribers**: `src/components/admin/SubscribersManager.tsx`
- **Admin Content Management**: `src/components/admin/ContentManager.tsx`
- **Admin Settings**: `src/components/admin/SettingsManager.tsx`
- **Admin Security**: `src/components/admin/SecurityManager.tsx`
- **Admin Audit Log**: `src/app/admin/(protected)/audit/page.tsx`
