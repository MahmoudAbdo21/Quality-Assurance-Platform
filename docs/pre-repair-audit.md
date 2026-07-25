# Pre-Repair Audit

This document records the pre-existing errors, broken routes, inert controls, and defects prior to the full functional closure repair.

## Broken Routes (404 / Missing)
- `/admin` does not redirect or handle entry properly yet (no page.tsx).
- `/admin/dashboard` is missing.
- `/admin/discussions` is missing.
- `/admin/messages` is missing.
- `/admin/subscribers` is missing.
- `/admin/content` is missing.
- `/admin/settings` is missing.
- `/admin/security` is missing.
- `/admin/audit` is missing.
- `/forum/[topicId]` is missing (dynamic page does not exist).

## Broken/Inert UI Controls
- Public admin login button exists in Header (needs removal).
- Public navigation bar is not horizontally centered.
- Add Course ("إضافة دورة جديدة") button is inert.
- Edit Course ("تعديل") button is inert.
- Delete Course ("حذف") button is inert.
- Forum "موضوع جديد" (New Topic) button is inert.
- Certificate "تحميل الشهادة" (Download Certificate) button is inert.
- Knowledge slider lacks interactions (auto movement, manual arrows, dots).
- Like button on topics is not functional.
- Contact form currently relies on basic action, lacks full validation and admin integration.
- Newsletter form in footer is inert.

## Authentication & Security Defects
- `requireAdmin` logic is basic; needs DB lookup, role check, session version validation.
- Anonymous visitor ID relies on `Date.now()` and `Math.random()`, needs `crypto.randomUUID()`.
- Media uploads are not secured or validated (MIME type, size limit).
- Mutations lack strict Zod validation on the server.

## Execution Output & Errors
*To be filled after `npm run build` and tests complete from the audit step.*

## Execution Output & Errors
Linting failed with 10 errors and 7 warnings (mainly 'any' types in components and auth.ts, unused variables, and 'prefer-const' in visitor.ts). Typecheck and build were aborted due to lint failure.
