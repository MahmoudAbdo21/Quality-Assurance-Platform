# Security Verification

## Authentication
- Handled safely via `next-auth` using `credentials` provider.
- Admin sessions verified using `requireAdminApi` or `requireAdmin` logic.
- Passwords stored securely using bcrypt hashing, plaintext never saved or sent to client.
- Brute-force protection: Locks account after 5 failed attempts for 15 minutes.
- Global session invalidation is active via `sessionVersion`.

## Authorization
- Access to all `/admin/*` routes is completely protected (except `/admin/login`).
- `requireAdmin()` explicitly checks whether the AdminUser row exists, `isActive`, and verifies `sessionVersion` matches exactly before executing admin logic.
- Admin operations return `{ error: "Unauthorized" }` gracefully.

## SQL Injection / ORM Issues
- Using Prisma strictly with typed data, protecting against manual string concatenation vulnerabilities.

## Mass Assignment
- Using `zod` object schemas to explicitly extract only allowed fields from request objects, ignoring any unrelated/injected JSON properties.

## Insecure Direct Object Reference (IDOR)
- Public certificate verification relies on a completely random `token`, rendering enumeration attacks useless.

## XSS (Cross Site Scripting)
- Inputs such as `ForumComment` content are displayed as string texts, with React safely escaping the outputs and completely blocking `dangerouslySetInnerHTML`.
