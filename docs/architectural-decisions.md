# 🏛 Architectural Decisions Record (ADR)

This document outlines the engineering and design choices made to ensure the portal remains scalable, compliant, and user-friendly.

## 1. UI/UX Hierarchy & Institutional Branding
- **Decision**: Adopted a high-contrast Navy (#004a7c) and Accent Orange (#FF7043) palette.
- **Rationale**: Navy conveys authority and stability (Institutional), while Orange highlights action-oriented items like "Pay Now" or "Apply".
- **Implementation**: 
    - `Primary`: Navy for submission.
    - `Accent`: Orange for transactions.
    - `Input Background`: #F8FAFC (Light Slate) to distinguish fields from white page backgrounds.
    - `Radius`: Consistent `rounded-lg` (8px) across all components for a modern, professional aesthetic.

## 2. Global Data Repository (State Management)
- **Decision**: Centralized "Source of Truth" in `App.tsx` acting as a mock database.
- **Rationale**: Nigerian polytechnic workflows are highly interdependent (e.g., Bursary clearance is a prerequisite for Exams). A centralized state allows for real-time "Cross-Portal Data Streams."
- **Example**: Updating `isCleared` in the Bursary portal immediately locks/unlocks the Exam Card in the Student's Result view.

## 3. NBTE Compliance Engineering
- **Decision**: Hard-coded constraints in the `CourseRegistration` and `Exams` modules.
- **Rationale**: Regulatory compliance is non-negotiable. 
- **Key Constraints**:
    - **Unit Load**: Maximum 24 units per semester.
    - **Carry-Over**: Failing grades ('F') are automatically injected into registration forms and cannot be unselected.
    - **Grading**: Standardized 5.0 CGPA scale with strict 0-100 score validation.

## 4. Document Integrity & Validation
- **Decision**: Client-side validation for all administrative uploads.
- **Rationale**: Prevents server/storage bloat and ensures document legibility for admissions officers.
- **Constraints**: 
    - Max 2MB file size.
    - Allowed types: `.pdf`, `.jpg`, `.png`.

## 5. Security & RBAC (Role-Based Access Control)
- **Decision**: Prefix-based identifier detection during the Auth phase.
- **Rationale**: Simplifies the simulation of complex staff hierarchies (Registrar, Bursar, Lecturer) without needing a backend database during the prototyping phase.
