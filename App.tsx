
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { View, Student, UserRole, StudentFinancialRecord, Transaction, LibraryBook, LibraryLoan, HostelAllocationRequest, Room, ROLE_PERMISSIONS } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CourseRegistration from './components/CourseRegistration';
import CourseMaterials from './components/CourseMaterials';
import DepartmentTransfer from './components/DepartmentTransfer';
import Payments from './components/Payments';
import TranscriptRequest from './components/TranscriptRequest';
import Elections from './components/Elections';
import Profile from './components/Profile';
import ITSupport from './components/ITSupport';
import HostelRequest from './components/HostelRequest';
import Library from './components/Library';
import Results from './components/Results';
import AttendanceReport from './components/AttendanceReport';
import LecturerPortal from './components/LecturerPortal';
import AdmissionsPortal from './components/AdmissionsPortal';
import RegistrarPortal from './components/RegistrarPortal';
import ExamsRecordsPortal from './components/ExamsRecordsPortal';
import HostelManagementPortal from './components/HostelManagementPortal';
import LibraryManagementPortal from './components/LibraryManagementPortal';
import BursaryPortal from './components/BursaryPortal';
import ApplicationForm from './components/ApplicationForm';
import DocumentUploadCenter from './components/DocumentCenter';
import LetterPrinting from './components/LetterPrinting';
import ExecutiveInsights from './components/ExecutiveInsights';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
    // AUTH & PERMISSIONS
    const [session, setSession] = useState<Session | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // CENTRALIZED DATA REPOSITORY (Now fetched from Supabase)
    const [students, setStudents] = useState<Student[]>([]);
    const [currentUser, setCurrentUser] = useState<Student | null>(null);
    const [allFinancialRecords, setAllFinancialRecords] = useState<StudentFinancialRecord[]>([]);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [allLibraryBooks, setAllLibraryBooks] = useState<LibraryBook[]>([]);
    const [allLibraryLoans, setAllLibraryLoans] = useState<LibraryLoan[]>([]);
    const [allRooms, setAllRooms] = useState<Room[]>([]);
    const [allHostelRequests, setAllHostelRequests] = useState<HostelAllocationRequest[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                // Clear all data on logout
                setUserRole(null);
                setCurrentUser(null);
                setStudents([]);
                setAllFinancialRecords([]);
                setAllTransactions([]);
                setAllLibraryBooks([]);
                setAllLibraryLoans([]);
                setAllRooms([]);
                setAllHostelRequests([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                setIsLoading(true);
                // Fetch user profile to determine role
                const { data: profile } = await supabase.from('profiles').select('role, student_id').eq('id', session.user.id).single();
                
                if (profile) {
                    setUserRole(profile.role);
                    
                    // Fetch all institutional data
                    const [studentsRes, financialsRes, txnsRes, booksRes, loansRes, roomsRes, requestsRes] = await Promise.all([
                        supabase.from('students').select('*'),
                        supabase.from('financial_records').select('*'),
                        supabase.from('transactions').select('*'),
                        supabase.from('library_books').select('*'),
                        supabase.from('library_loans').select('*'),
                        supabase.from('rooms').select('*'),
                        supabase.from('hostel_requests').select('*'),
                    ]);

                    setStudents(studentsRes.data || []);
                    setAllFinancialRecords(financialsRes.data || []);
                    setAllTransactions(txnsRes.data || []);
                    setAllLibraryBooks(booksRes.data || []);
                    setAllLibraryLoans(loansRes.data || []);
                    setAllRooms(roomsRes.data || []);
                    setAllHostelRequests(requestsRes.data || []);

                    // If user is a student, fetch their specific record
                    if (profile.role === 'Student' && profile.student_id) {
                        const { data: studentData } = await supabase.from('students').select('*, documents:documents(*)').eq('id', profile.student_id).single();
                        setCurrentUser(studentData);
                    } else if (studentsRes.data && studentsRes.data.length > 0) {
                        // Fallback for non-student roles to have a default user context
                        const { data: studentData } = await supabase.from('students').select('*, documents:documents(*)').eq('id', 'STU001').single();
                        setCurrentUser(studentData);
                    }
                }
                setIsLoading(false);
            }
        };
        fetchData();
    }, [session]);
    
    // DATA SYNCHRONIZATION ENGINES (Now async Supabase calls)
    const syncFinancialRecord = async (updatedRecord: StudentFinancialRecord) => {
        const { data, error } = await supabase.from('financial_records').update(updatedRecord).eq('student_id', updatedRecord.studentId).select().single();
        if (data && !error) {
            setAllFinancialRecords(prev => prev.map(r => r.studentId === data.studentId ? data : r));
        }
    };

    const syncJambVerification = async (studentId: string, isVerified: boolean) => {
        const { data, error } = await supabase.from('students').update({ is_jamb_verified: isVerified }).eq('id', studentId).select().single();
        if (data && !error) {
            setStudents(prev => prev.map(s => s.id === data.id ? data : s));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setActiveView('dashboard');
    };

    // PERMISSION CHECKER
    const hasPermission = (view: View): boolean => {
        if (!userRole) return false;
        return ROLE_PERMISSIONS[userRole]?.includes(view) ?? false;
    };

    const renderView = () => {
        if (isLoading || (!session && !isApplying)) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-16 h-16 border-4 border-navy-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        
        if (isApplying) {
            return <ApplicationForm onComplete={async (s) => { 
                const { data } = await supabase.from('students').insert(s).select().single();
                if (data) {
                    setStudents(prev => [...prev, data]); 
                    alert("Application successful! Please check your email to set a password and log in.");
                }
                setIsApplying(false);
            }} />;
        }

        if (!hasPermission(activeView)) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white rounded-[40px] border border-slate-100 shadow-sm animate-in fade-in zoom-in-95">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Access Restricted</h2>
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto">Your institutional role <b>({userRole?.replace('_', ' ')})</b> does not have authorization for the <b>{activeView.replace('-', ' ')}</b> module.</p>
                    <button onClick={() => setActiveView('dashboard')} className="btn-primary mt-8 px-8 py-3 text-xs font-black uppercase tracking-widest shadow-xl">Return to Safe Zone</button>
                </div>
            );
        }

        // Render views but ensure currentUser is not null for student-specific views
        if (!currentUser) {
            // This can be a loading spinner or a message
            return <div className="text-center p-12">Loading user data...</div>;
        }

        switch (activeView) {
            case 'dashboard': return <Dashboard setActiveView={setActiveView} />;
            case 'bursary-portal': return <BursaryPortal records={allFinancialRecords} setRecords={setAllFinancialRecords} onSyncRecord={syncFinancialRecord} transactions={allTransactions} setTransactions={setAllTransactions} />;
            case 'exams-records-portal': return <ExamsRecordsPortal financialRecords={allFinancialRecords} />;
            case 'registrar-portal': return <RegistrarPortal onVerifyStudent={syncJambVerification} />;
            case 'library-management-portal': return <LibraryManagementPortal students={students} books={allLibraryBooks} setBooks={setAllLibraryBooks} loans={allLibraryLoans} setLoans={setAllLibraryLoans} />;
            case 'course-registration': return <CourseRegistration student={currentUser} setStudent={setCurrentUser} />;
            case 'payments': return <Payments student={currentUser} />;
            case 'results': return <Results student={currentUser} />;
            case 'profile': return <Profile student={currentUser} setStudent={setCurrentUser} />;
            case 'document-center': return <DocumentUploadCenter student={currentUser} setStudent={setCurrentUser} />;
            case 'letter-printing': return <LetterPrinting student={currentUser} />;
            case 'admissions-portal': return <AdmissionsPortal />;
            case 'lecturer-portal': return <LecturerPortal />;
            case 'hostel-management-portal': return <HostelManagementPortal rooms={allRooms} setRooms={setAllRooms} requests={allHostelRequests} setRequests={setAllHostelRequests} />;
            case 'super-admin-portal': return <ExecutiveInsights />;
            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    if (!session && !isApplying) {
        return <Auth />;
    }
    
    // This is a simple landing page router
    if (!session && !window.location.pathname.startsWith('/app')) {
        return <LandingPage onSignIn={() => window.history.pushState({}, '', '/app')} onApply={() => setIsApplying(true)} />;
    }
    
    if (isLoading || (!currentUser && !isApplying)) return (
        <div className="flex h-screen bg-slate-50 items-center justify-center">
            <div className="w-16 h-16 border-4 border-navy-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {!isApplying && currentUser && <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} student={currentUser} userRole={userRole} onLogout={handleLogout} />}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {!isApplying && currentUser && <Header student={currentUser} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />}
                <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10 lg:p-12 scroll-smooth">
                    <div className="max-w-[1200px] mx-auto">{renderView()}</div>
                </main>
            </div>
        </div>
    );
};

export default App;
