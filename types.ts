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

export type StudentStatus = 'Prospect' | 'Admitted' | 'Rejected' | string;

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
  createdAt: string;
  studentId: string;
  name: string;
  type: 'O-Level Result' | 'Birth Certificate' | 'JAMB Result' | 'NIN' | 'LGA Certificate' | string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: 'Not Uploaded' | 'Pending Verification' | 'Verified' | 'Rejected' | string;
  url: string;
}

export interface Student {
  id: string;
  createdAt: string;
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
  permissionLevel: number;
  applicationFeePaid: boolean;
  isRegistered: boolean;
  documents?: StudentDocument[];
  isFeesCleared?: boolean;
  isHostelFeePaid?: boolean;
  isJambVerified?: boolean;
}

export interface Transaction {
  id: string;
  createdAt: string;
  studentId: string;
  studentName?: string;
  amount: number;
  category: 'Tuition' | 'Hostel' | 'Transcript' | 'Application' | 'Other' | string;
  reference: string;
  status: 'Pending' | 'Verified' | 'Failed' | 'Reversed' | string;
  paymentChannel?: string;
  verifiedBy?: string;
}

export interface StudentFinancialRecord {
  id: string;
  studentId: string;
  totalFees: number;
  amountPaid: number;
  balance: number;
  isCleared: boolean;
  paymentStatus: 'No Payment' | 'Part Payment' | 'Fully Paid' | string;
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
}

export interface LibraryLoan {
  id: string;
  bookId: string;
  // Fix: Add bookTitle and memberName to LibraryLoan type
  bookTitle: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Active' | 'Returned' | 'Overdue' | string;
  fineAmount: number;
  // FIX: Added missing property `isFineWaived` which is used in CirculationTerminal.tsx
  isFineWaived?: boolean;
}

export interface Room {
  id: string;
  hostelName: string;
  roomNumber: string;
  typeId: string;
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
  createdAt: string;
  title: string;
  units: number;
  type: 'Compulsory' | 'Elective' | string;
  prerequisites?: string[];
  department: string;
}

export interface Result {
  id: string;
  createdAt: string;
  studentId: string;
  courseCode: string;
  courseTitle: string; // This is in the DB table
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | string;
  score: number;
  session: string;
  semester: string;
}

export type AttendanceStatus = 'P' | 'A' | 'L' | 'H';

export interface AttendanceRecord {
  courseCode: string;
  days: Record<number, AttendanceStatus>;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
}

export interface ElectionPosition {
  title: string;
  candidates: Candidate[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  type: 'Physical' | 'E-Book';
  available: boolean;
  coverUrl: string;
  downloadUrl?: string;
}

export interface ExamSchedule {
  courseCode: string;
  courseTitle: string;
  date: string;
  time: string;
  venue: string;
}

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

export interface LecturerCourse {
  code: string;
  title: string;
  units: number;
  type: string;
  studentsEnrolled: number;
  semester: string;
}

export interface CourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: 'Slide' | 'Assignment' | 'Reading' | 'Other';
  url: string;
  dateAdded: string;
}

export type AdmissionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';

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

export interface HostelBuilding {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Mixed';
  totalRooms: number;
  location: string;
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  price: number;
  amenities: string[];
}

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

export interface LibraryRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface FeeStructure {
  id: string;
  faculty: string;
  department: string;
  level: string;
  tuition: number;
  acceptance: number;
  otherCharges: number;
}

export interface GlobalAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  module: string;
  action: string;
  details: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface StudentScore {
    matricNumber: string;
    studentName: string;
    caScore: number;
    examScore: number;
    total: number;
    grade: string;
}