# Certificate Domain Redesign Precheck

## Root Causes of Current Defects
1. **Modal Constraint Defect:** The previous certificate preview was implemented directly within the `CertificateCard` component (or inside a similar grid item) without using a React Portal. As a result, the `position: absolute` or `fixed` styling was still bounded by the parent container's `overflow: hidden`, `transform`, or `relative` context, constraining the certificate dimensions to the card itself instead of the viewport.
2. **Domain Model Flaw:** The `Certificate` model was originally designed as a 1-to-1 representation of a completed course tied implicitly to a visitor's `CourseRegistration`. There was no separate entity for an "Issued Certificate" (representing a real-world issuance with a serial number, date, and specific recipient) versus a "Certificate Template" (the reusable design for the course).
3. **Verification Defect:** Public verification depended on `CourseRegistration.publicToken`, linking a simple registration to a certificate before it was ever formally issued or graded by an admin. 

## Required Fix
- Retain the `Certificate` model as the **Certificate Template**.
- Introduce a new `CertificateIssue` model to represent an **Issued Certificate** to a specific person.
- Break the hard link between a public visitor and the certificate; an Admin will issue certificates with snapshots of the current template.
- Re-architect the preview modal using `ReactDOM.createPortal` so it attaches directly to `document.body` and escapes all parent constraints.
