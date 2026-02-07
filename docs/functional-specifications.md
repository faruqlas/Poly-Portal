# 📝 Functional Specifications

## 1. Admissions Module
- **UTME Pool**: Allows officers to approve/reject applicants based on scores and O-Level credits.
- **Matric Gate**: A transition state where "Prospects" are assigned official Matriculation Numbers before becoming full students.
- **Quota Management**: Departments are capped at 50 students (NBTE standard) with visual "Dept Full" warnings.

## 2. Bursary & Treasury
- **RRR Lifecycle**: Generation of Remita Retrieval Reference codes for various fee categories.
- **Manual Post**: Capability for staff to manually verify bank deposits that haven't auto-synced.
- **Eligibility Sync**: Automatic broadcast of "Cleared" status to the Exams & Records module.

## 3. Academic Records (Exams)
- **Score Audit**: A grid view for officers to verify CA (30%) and Exam (70%) marks.
- **Anomaly Detection**: Highlights scores >100 or <0 in red, disabling the "Commit" action until corrected.
- **Transcript Engine**: Chronological result tracking with automated GPA calculation per session.

## 4. Document Hub
- **Dynamic PDF Generation**: Uses `html2canvas` and `jsPDF` to generate printable letters directly from verified portal data.
- **Status Tracking**: Visual badges (Verified, Pending, Rejected) for every uploaded credential.

## 5. Registrar Tools
- **Session Rollover**: A high-security action requiring a confirmation phrase to progress the entire institution to the next academic year.
- **Mapping Matrix**: Drag-and-drop interface to assign master courses to specific departments and levels.
