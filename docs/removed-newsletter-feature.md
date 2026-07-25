# Removed Newsletter Feature

The "Newsletter Subscribers" (المشتركين) feature was removed from the application UI and Admin dashboard.
The users currently rely on `/admin/registrations` for course registrations.

## Database Note
The `NewsletterSubscriber` model remains in the Prisma schema for database backward compatibility and to avoid destructive migrations. 
However, it is no longer exposed or used in the application.

* Date of removal: 2026-07-26
