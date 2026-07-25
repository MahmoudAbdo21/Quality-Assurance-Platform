# Route Inventory

## Public Routes
- `/` - Home Page
- `/courses` - Courses Listing
- `/certificates` - Certificates Verification Landing
- `/certificates/verify` - Secure Verification endpoint (`?token=...`)
- `/forum` - Public Discussions
- `/forum/[topicId]` - Public Discussion Topic details
- `/know-more` - Knowledge Slides
- `/about` - About Platform
- `/contact` - Contact Us (Messages)

## Authentication Routes
- `/api/auth/[...nextauth]` - Auth.js provider configuration
- `/admin/login` - Admin Login Interface

## Protected Admin Routes (Require Admin Session)
- `/admin` - Redirects to `/admin/dashboard`
- `/admin/dashboard` - Statistics and aggregates
- `/admin/courses` - Course Manager
- `/admin/certificates` - Certificates Manager
- `/admin/certificates/[certificateId]/preview` - Admin preview certificate
- `/admin/registrations` - Course Registrations Manager
- `/admin/discussions` - Forum Moderation Manager
- `/admin/messages` - Contact Messages Manager
- `/admin/subscribers` - Newsletter Subscribers Manager
- `/admin/content` - Knowledge Slider and Content Config
- `/admin/settings` - General Settings Manager
- `/admin/security` - Admin Security and Passwords
- `/admin/audit` - Audit Logs View
