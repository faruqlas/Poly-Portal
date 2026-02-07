
export type View = 
  | 'dashboard'
  | 'application-form'
  | 'document-center'
  | 'letter-printing'
  | 'course-registration'
  | 'course-materials'
  | 'department-transfer'
  | 'payments'
  | 'transcript-request'
  | 'elections'
  | 'profile'
  | 'it-support'
  | 'hostel-request'
  | 'library'
  | 'results'
  | 'attendance'
  | 'lecturer-portal'
  | 'admissions-portal'
  | 'registrar-portal'
  | 'exams-records-portal'
  | 'hostel-management-portal'
  | 'library-management-portal'
  | 'bursary-portal'
  | 'super-admin-portal';

export type UserRole = 
  | 'Student' 
  | 'Lecturer' 
  | 'Admissions_Officer' 
  | 'Registrar' 
  | 'Admin' 
  | 'Exams_Officer' 
  | 'Hostel_Manager' 
  | 'Librarian' 
  | 'Bursar';

export const ROLE_PERMISSIONS: Record<UserRole, View[]> = {
  Student: ['dashboard', 'application-form', 'document-center', 'letter-printing', 'course-registration', 'course-materials', 'department-transfer', 'payments', 'transcript-request', 'elections', 'profile', 'it-support', 'hostel-request', 'library', 'results', 'attendance'],
  Lecturer: ['lecturer-portal', 'profile', 'library', 'dashboard'],
  Admissions_Officer: ['admissions-portal', 'profile', 'dashboard'],
  Registrar: ['registrar-portal', 'profile', 'dashboard'],
  Exams_Officer: ['exams-records-portal', 'profile', 'dashboard'],
  Hostel_Manager: ['hostel-management-portal', 'profile', 'dashboard'],
  Librarian: ['library-management-portal', 'profile', 'dashboard'],
  Bursar: ['bursary-portal', 'profile', 'dashboard'],
  Admin: [
    'dashboard', 'application-form', 'document-center', 'letter-printing', 
    'course-registration', 'course-materials', 'department-transfer', 'payments', 
    'transcript-request', 'elections', 'profile', 'it-support', 'hostel-request', 
    'library', 'results', 'attendance', 'lecturer-portal', 'admissions-portal', 
    'registrar-portal', 'exams-records-portal', 'hostel-management-portal', 
    'library-management-portal', 'bursary-portal', 'super-admin-portal'
  ],
};

export type StudentStatus = 'Prospect' | 'Admitted' | 'Rejected';

export type RRRStatus = 'Generated' | 'Paid' | 'Expired' | 'Pending Verification' | 'Failed';

export interface RRRTransaction {
  rrr: string;
  studentId: string;
  studentName: string;
  amount: number;
  feeType: string;
  dateGenerated: string;
  status: RRRStatus;
  paymentChannel?: 'Bank Branch' | 'Card' | 'USSD' | 'Internet Banking';
  paymentDate?: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: 'O-Level Result' | 'Birth Certificate' | 'JAMB Result' | 'NIN' | 'LGA Certificate';
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: 'Not Uploaded' | 'Pending Verification' | 'Verified' | 'Rejected';
  url: string;
}

export interface Student {
  id: string;
  name: string;
  matricNumber?: string;
  applicationNumber?: string;
  department: string;
  level: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  session: string;
  semester: string;
  status: StudentStatus;
  permissionLevel: number; // 1: Applicant, 2: Admitted, 3: Matriculated
  applicationFeePaid: boolean;
  is_registered: boolean;
  documents: StudentDocument[];
  is_fees_cleared?: boolean;
  is_hostel_fee_paid?: boolean;
  is_jamb_verified?: boolean;
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  category: 'Tuition' | 'Hostel' | 'Transcript' | 'Application' | 'Other';
  date: string;
  reference: string;
  status: 'Pending' | 'Verified' | 'Failed' | 'Reversed';
  // Added verifiedBy to resolve TS errors in constants.tsx
  verifiedBy?: string;
  // Added paymentChannel to resolve TS errors in constants.tsx
  paymentChannel?: string;
}

export interface StudentFinancialRecord {
  studentId: string;
  matricNumber: string;
  name: string;
  department: string;
  level: string;
  totalFees: number;
  amountPaid: number;
  balance: number;
  isCleared: boolean;
  isRegCleared: boolean;
  paymentStatus: 'No Payment' | 'Part Payment' | 'Fully Paid';
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  purchaseDate: string;
  condition: 'Mint' | 'Good' | 'Fair' | 'Poor';
  price: number;
}

export interface LibraryLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Active' | 'Returned' | 'Overdue';
  fineAmount: number;
  isFineWaived?: boolean;
}

export interface Room {
  id: string;
  hostel_name: string;
  room_number: string;
  type_id: string;
  capacity: number;
  occupants: string[];
  isUnderMaintenance: boolean;
}

export interface HostelAllocationRequest {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  preferredTypeId: string;
  dateRequested: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Course {
  code: string;
  title: string;
  units: number;
  type: 'Compulsory' | 'Elective';
  prerequisites?: string[];
}

export interface Result {
  courseCode: string;
  courseTitle: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  score: number;
  session: string;
  semester: string;
}

// Added missing AttendanceStatus type
export type AttendanceStatus = 'P' | 'A' | 'L' | 'H';

// Added missing AttendanceRecord interface
export interface AttendanceRecord {
  courseCode: string;
  days: Record<number, AttendanceStatus>;
}

// Added missing Candidate interface
export interface Candidate {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
}

// Added missing ElectionPosition interface
export interface ElectionPosition {
  title: string;
  candidates: Candidate[];
}

// Added missing Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  type: 'Physical' | 'E-Book';
  available: boolean;
  coverUrl: string;
  downloadUrl?: string;
}

// Added missing ExamSchedule interface
export interface ExamSchedule {
  courseCode: string;
  courseTitle: string;
  date: string;
  time: string;
  venue: string;
}

// Added missing Lecturer interface
export interface Lecturer {
  id: string;
  name: string;
  staffNumber: string;
  department: string;
  rank: string;
  email: string;
  avatarUrl: string;
  phone: string;
  address: string;
}

// Added missing LecturerCourse interface
export interface LecturerCourse {
  code: string;
  title: string;
  units: number;
  type: string;
  studentsEnrolled: number;
  semester: string;
}

// Added missing CourseMaterial interface
export interface CourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: 'Slide' | 'Assignment' | 'Reading' | 'Other';
  url: string;
  dateAdded: string;
}

// Added missing AdmissionStatus type
export type AdmissionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';

// Added missing Applicant interface
export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  score: number;
  status: AdmissionStatus;
  dateApplied: string;
  program: string;
  oLevelCredits: number;
  isNew?: boolean;
  rejectionReason?: string;
}

// Added missing HostelBuilding interface
export interface HostelBuilding {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Mixed';
  totalRooms: number;
  location: string;
}

// Added missing RoomType interface
export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  price: number;
  amenities: string[];
}

// Added missing LibraryMember interface
export interface LibraryMember {
  id: string;
  name: string;
  type: 'Student' | 'Staff';
  department: string;
  identifier: string;
  joinedDate: string;
  borrowingStatus: 'Active' | 'Suspended';
  totalFinesOwed: number;
}

// Added missing LibraryRequest interface
export interface LibraryRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Added missing FeeStructure interface
export interface FeeStructure {
  id: string;
  faculty: string;
  department: string;
  level: string;
  tuition: number;
  acceptance: number;
  otherCharges: number;
}

// Added missing GlobalAuditEntry interface
export interface GlobalAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  module: string;
  action: string;
  details: string;
}

// Added missing AuditEntry interface
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

// Added missing StudentScore interface
export interface StudentScore {
    matricNumber: string;
    studentName: string;
    caScore: number;
    examScore: number;
    total: number;
    grade: string;
}
