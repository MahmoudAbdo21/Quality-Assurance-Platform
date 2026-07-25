# Pre-Repair Audit Report

## 1. Confirmed 404s
- `GET /admin/dashboard` returned 404.
- `GET /admin/courses` returned 404.
- `GET /admin/certificates` returned 404.
- `GET /admin/messages` returned 404.
- `GET /admin/subscribers` returned 404.
- `GET /admin/content` returned 404.
- `GET /admin/settings` returned 404.
- `GET /admin/security` returned 404.
- `GET /admin/audit` returned 404.
- `GET /certificates/verify?token=SAMPLE` returned 404.

## 2. Missing Routes
- The entire admin protected routes panel was missing logic (only showing placeholders `??? ???????`).
- Dynamic forum topic page `/forum/[topicId]` was missing.

## 3. Dead Navigation Links
- Forum topics were non-clickable.
- Header admin login button was a dead link or pointed to non-functional auth route.

## 4. Inert Buttons
- "إضافة موضوع جديد" in the forum didn't do anything or just showed an alert.
- "إعجاب" buttons in the forum were inert.
- The contact form submission button did not actually send data to the server.
- Newsletter subscribe button was inert.

## 5. Incomplete Forms
- Contact form lacked real backend validation and persistence.
- Newsletter form lacked backend persistence.

## 6. Fake Tokens
- `token=SAMPLE` was hardcoded in certificate verification links.

## 7. Incomplete CRUD Operations
- Course CRUD lacked creation, editing, suspension, and deletion logic.
- Certificate CRUD lacked generation, mapping to courses, and PDF upload logic.
- Registrations CRUD was incomplete.
- All other Admin CRUDs were completely unwritten.

## 8. Prisma Problems
- Initial schema contained duplicate/mismatched models (`ForumLike` vs `ForumTopicLike`).
- Missing SQLite unique constraints on some tables.

## 9. Authentication & Authorization Problems
- Dummy authentication in proxy without a proper `requireAdmin` logic protecting the actual server actions.
- Any logged-in user (or even unauthenticated if bypassing proxy) might have been able to call server actions if they were unprotected.

## 10. Public UI Regressions
- Header was excessively large and took up too much vertical space.
- Navigation was not centered.
- Visible admin login button was present for public users.
- Missing brand logo (only a text placeholder 'ج' was used).

## 11. Build, Lint, and Typecheck Failures
- The codebase had TS compilation errors related to `errors` vs `issues` in Zod.
- Unused variables and imports.
- TypeScript `any` typings in authentication helper.
