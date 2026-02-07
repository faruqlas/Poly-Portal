import React from 'react';
import { 
    View, Student, Course, Result, RRRTransaction, ElectionPosition, Candidate, Book, ExamSchedule, 
    Lecturer, LecturerCourse, CourseMaterial, AttendanceRecord, Applicant, HostelBuilding, RoomType, 
    StudentFinancialRecord, GlobalAuditEntry, Room, Transaction, LibraryLoan, LibraryBook, HostelAllocationRequest 
} from './types';

export const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Accountancy',
  'Business Administration',
  'Mass Communication',
];

export const ICONS: { [key in View]?: React.ReactNode } = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  'application-form': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  'document-center': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" /></svg>,
  'letter-printing': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V5a2 2 0 012-2h2a2 2 0 012 2v3m-6 0h6" /></svg>,
  'course-registration': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
  'course-materials': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  'department-transfer': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  payments: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  'transcript-request': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  elections: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  profile: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  'it-support': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'hostel-request': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  library: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  results: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" /></svg>,
  attendance: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  'lecturer-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
  'admissions-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  'registrar-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>,
  'exams-records-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  'hostel-management-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 4h.01M9 16h.01" /></svg>,
  'library-management-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  'bursary-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  'super-admin-portal': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
};

export const MOCK_STUDENT: Student = {
  id: 'STU001',
  name: 'Adebayo Chukwuemeka',
  matricNumber: 'POLY/CS/21/001',
  applicationNumber: 'APP-2023-12345',
  department: 'Computer Science',
  level: 'ND II',
  email: 'adebayo.c@polystudent.edu.ng',
  phone: '+2348012345678',
  address: '123 University Road, Lagos, Nigeria',
  avatarUrl: 'https://i.pravatar.cc/150?u=student1',
  session: '2023/2024',
  semester: 'First Semester',
  status: 'Admitted',
  permissionLevel: 3,
  applicationFeePaid: true,
  is_registered: true,
  documents: [
    { id: 'doc1', name: 'jamb_result.pdf', type: 'JAMB Result', fileType: 'application/pdf', fileSize: 512000, uploadDate: '2023-01-15', status: 'Verified', url: '#' },
    { id: 'doc2', name: 'olevel_cert.jpg', type: 'O-Level Result', fileType: 'image/jpeg', fileSize: 1200000, uploadDate: '2023-01-16', status: 'Pending Verification', url: '#' },
  ],
  is_fees_cleared: true,
  is_hostel_fee_paid: true,
  is_jamb_verified: true,
};

export const MOCK_COURSES: Course[] = [
    { code: 'COM 211', title: 'Java I', units: 3, type: 'Compulsory' },
    { code: 'COM 212', title: 'Web Development', units: 3, type: 'Compulsory' },
    { code: 'COM 213', title: 'Database Management', units: 3, type: 'Compulsory' },
    { code: 'GNS 201', title: 'Use of English II', units: 2, type: 'Compulsory' },
    { code: 'MTH 211', title: 'Calculus II', units: 3, type: 'Compulsory' },
    { code: 'COM 215', title: 'Intro to AI', units: 2, type: 'Elective' },
    { code: 'COM 121', title: 'Intro to Programming', units: 3, type: 'Compulsory' }, // For carry-over demo
];

export const MOCK_ALL_RESULTS: Result[] = [
    { session: '2022/2023', semester: 'First Semester', courseCode: 'COM 111', courseTitle: 'Intro to CS', units: 3, score: 75, grade: 'A' },
    { session: '2022/2023', semester: 'First Semester', courseCode: 'MTH 111', courseTitle: 'Algebra', units: 3, score: 68, grade: 'B' },
    { session: '2022/2023', semester: 'First Semester', courseCode: 'GNS 101', courseTitle: 'Use of English I', units: 2, score: 35, grade: 'F' }, // Failed course
    { session: '2022/2023', semester: 'Second Semester', courseCode: 'COM 121', courseTitle: 'Intro to Programming', units: 3, score: 38, grade: 'F' }, // Failed course for carry-over demo
    { session: '2022/2023', semester: 'Second Semester', courseCode: 'GNS 101', courseTitle: 'Use of English I', units: 2, score: 55, grade: 'C' }, // Passed the failed course
    { session: '2023/2024', semester: 'First Semester', courseCode: 'COM 211', courseTitle: 'Java I', units: 3, score: 82, grade: 'A' },
    { session: '2023/2024', semester: 'First Semester', courseCode: 'COM 212', courseTitle: 'Web Development', units: 3, score: 71, grade: 'B' },
];

export const MOCK_RRR_TRANSACTIONS: RRRTransaction[] = [
    { rrr: '1234-5678-9012', studentId: 'POLY/CS/21/001', studentName: 'Adebayo Chukwuemeka', amount: 85000, feeType: 'Tuition Fee', dateGenerated: '2024-02-01', status: 'Paid', paymentChannel: 'Card', paymentDate: '2024-02-02' },
    { rrr: '9876-5432-1098', studentId: 'POLY/CS/21/001', studentName: 'Adebayo Chukwuemeka', amount: 30000, feeType: 'Hostel Fee', dateGenerated: '2024-02-03', status: 'Generated' },
];

export const MOCK_ELECTIONS: ElectionPosition[] = [
    { title: 'President', candidates: [{ id: 'pres1', name: 'John Doe', position: 'President', photoUrl: 'https://i.pravatar.cc/150?u=pres1' }, { id: 'pres2', name: 'Jane Smith', position: 'President', photoUrl: 'https://i.pravatar.cc/150?u=pres2' }] },
    { title: 'Vice President', candidates: [{ id: 'vp1', name: 'Peter Jones', position: 'Vice President', photoUrl: 'https://i.pravatar.cc/150?u=vp1' }] },
];

export const MOCK_BOOKS: Book[] = [
    { id: 'book1', title: 'Clean Code', author: 'Robert C. Martin', type: 'Physical', available: true, coverUrl: 'https://m.media-amazon.com/images/I/41xShlnTZTL._AC_UF894,1000_QL80_.jpg' },
    { id: 'book2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', type: 'Physical', available: false, coverUrl: 'https://m.media-amazon.com/images/I/71f743sOPoL._AC_UF894,1000_QL80_.jpg' },
    { id: 'book3', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', type: 'E-Book', available: true, coverUrl: 'https://m.media-amazon.com/images/I/61Pgdnr695L._AC_UF894,1000_QL80_.jpg', downloadUrl: '#' },
];

export const MOCK_EXAM_TIMETABLE: ExamSchedule[] = [
    { courseCode: 'COM 211', courseTitle: 'Java I', date: '2024-06-10', time: '09:00 AM - 11:00 AM', venue: 'Hall A' },
    { courseCode: 'COM 212', courseTitle: 'Web Development', date: '2024-06-12', time: '12:00 PM - 02:00 PM', venue: 'Hall B' },
];

export const MOCK_LECTURER: Lecturer = {
    id: 'LEC01', name: 'Dr. Evelyn Anya', staffNumber: 'STF/2010/05', department: 'Computer Science', rank: 'Senior Lecturer', email: 'e.anya@polystaff.edu.ng', avatarUrl: 'https://i.pravatar.cc/150?u=lec1', phone: '+2348098765432', address: 'Staff Quarters, Polytechnic Campus'
};

export const MOCK_LECTURER_COURSES: LecturerCourse[] = [
    { code: 'COM 211', title: 'Java I', units: 3, type: 'Compulsory', studentsEnrolled: 85, semester: 'First Semester' },
    { code: 'COM 212', title: 'Web Development', units: 3, type: 'Compulsory', studentsEnrolled: 85, semester: 'First Semester' },
];

export const MOCK_MATERIALS: CourseMaterial[] = [
    { id: 'mat1', courseCode: 'COM 211', title: 'Week 1 - Intro to Java', type: 'Slide', url: '#', dateAdded: '2024-02-10' },
    { id: 'mat2', courseCode: 'COM 211', title: 'Assignment 1', type: 'Assignment', url: '#', dateAdded: '2024-02-15' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { courseCode: 'COM 211', days: { 1: 'P', 2: 'P', 3: 'A', 4: 'H', 5: 'P' } },
    { courseCode: 'COM 212', days: { 1: 'L', 2: 'P', 3: 'P', 4: 'H', 5: 'A' } },
];

export const MOCK_APPLICANTS: Applicant[] = [
    { id: 'APP-2024-001', name: 'Chioma Nwosu', email: 'chi@test.com', phone: '123', department: 'Computer Science', score: 250, status: 'Pending', dateApplied: '2024-01-10', program: 'ND Full-Time', oLevelCredits: 5, isNew: true },
    { id: 'APP-2024-002', name: 'Tunde Adebayo', email: 'tunde@test.com', phone: '123', department: 'Mechanical Engineering', score: 190, status: 'Approved', dateApplied: '2024-01-11', program: 'ND Full-Time', oLevelCredits: 6 },
];

export const MOCK_HOSTELS: HostelBuilding[] = [
    { id: 'HOS1', name: 'Queen Amina Hall', gender: 'Female', totalRooms: 100, location: 'North Campus' },
    { id: 'HOS2', name: 'King Jaja Hall', gender: 'Male', totalRooms: 120, location: 'South Campus' },
];

export const MOCK_ROOM_TYPES: RoomType[] = [
    { id: 'RT1', name: '4-person Room', capacity: 4, price: 30000, amenities: ['Bunk bed', 'Wardrobe', 'Fan'] },
    { id: 'RT2', name: '2-person Room (Premium)', capacity: 2, price: 60000, amenities: ['Single bed', 'Wardrobe', 'Fan', 'Reading Table'] },
];

export const MOCK_FINANCIAL_RECORDS: StudentFinancialRecord[] = [
    { studentId: 'STU001', matricNumber: 'POLY/CS/21/001', name: 'Adebayo Chukwuemeka', department: 'Computer Science', level: 'ND II', totalFees: 100000, amountPaid: 100000, balance: 0, isCleared: true, isRegCleared: true, paymentStatus: 'Fully Paid' },
    { studentId: 'STU002', matricNumber: 'POLY/EE/21/002', name: 'Jane Doe', department: 'Electrical Engineering', level: 'ND II', totalFees: 100000, amountPaid: 50000, balance: 50000, isCleared: false, isRegCleared: false, paymentStatus: 'Part Payment' },
];

export const GLOBAL_AUDIT_LOG: GlobalAuditEntry[] = [
    { id: 'log1', timestamp: '2 mins ago', actor: 'Dr. E. Anya', module: 'Exams Portal', action: 'SCORE_UPDATE', details: 'Updated CA for COM 211' },
    { id: 'log2', timestamp: '5 mins ago', actor: 'Admin (Bursary)', module: 'Payments', action: 'MANUAL_VERIFY', details: 'Verified RRR for STU002' },
];

export const MOCK_ROOMS: Room[] = [
    { id: 'RM101', hostel_name: 'Queen Amina Hall', room_number: 'A101', type_id: 'RT1', capacity: 4, occupants: ['STU003', 'STU004'], isUnderMaintenance: false },
    { id: 'RM102', hostel_name: 'Queen Amina Hall', room_number: 'A102', type_id: 'RT1', capacity: 4, occupants: [], isUnderMaintenance: true },
];
