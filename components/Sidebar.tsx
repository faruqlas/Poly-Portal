
import React, { useState } from 'react';
import { View, Student, UserRole } from '../types';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    student: Student;
    userRole: UserRole | null;
    onLogout: () => void;
}

interface NavCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    items: {
        view: View;
        label: string;
        level: number;
    }[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setSidebarOpen, student, userRole, onLogout }) => {
    const userLevel = student?.permissionLevel || 1;
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['admission', 'academics']);

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const categories: NavCategory[] = [
        {
            id: 'admission',
            label: 'Admission & Entry',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            items: [
                { view: 'document-center', label: 'Documents Hub', level: 1 },
                { view: 'application-form', label: 'Biodata Form', level: 1 },
                { view: 'letter-printing', label: 'Admission Letters', level: 2 },
            ]
        },
        {
            id: 'academics',
            label: 'Academics',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>,
            items: [
                { view: 'course-registration', label: 'Registration', level: 3 },
                { view: 'results', label: 'Exam Card', level: 3 },
                { view: 'results', label: 'Semester Results', level: 3 },
                { view: 'attendance', label: 'Attendance Log', level: 3 },
            ]
        },
        {
            id: 'services',
            label: 'Student Services',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 4h.01M9 16h.01" /></svg>,
            items: [
                { view: 'payments', label: 'Fees & Payments', level: 1 },
                { view: 'hostel-request', label: 'Hostel Services', level: 3 },
                { view: 'library', label: 'Library Access', level: 3 },
                { view: 'elections', label: 'SUG Elections', level: 3 },
            ]
        },
        {
            id: 'requests',
            label: 'Formal Requests',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
            items: [
                { view: 'department-transfer', label: 'Dept Transfer', level: 3 },
                { view: 'transcript-request', label: 'Transcript', level: 3 },
                { view: 'it-support', label: 'IT Ticket', level: 1 },
            ]
        }
    ];

    const handleItemClick = (view: View, level: number) => {
        if (userLevel < level) return;
        setActiveView(view);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    return (
        <>
            <div className={`fixed inset-0 z-20 bg-brand-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-72 bg-brand-slate-900 text-slate-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out print:hidden shadow-2xl overflow-hidden border-r border-brand-slate-800`}>
                
                {/* IDENTITY HEADER */}
                <div className="p-8 bg-brand-slate-950/40 border-b border-brand-slate-800">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-3xl overflow-hidden ring-4 ring-brand-primary-500/20 shadow-2xl">
                                <img className="h-full w-full object-cover" src={student.avatarUrl} alt="" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-brand-slate-950 rounded-full"></div>
                        </div>
                        <div className="min-w-0 w-full">
                            <p className="text-lg font-black tracking-tight truncate leading-tight">{student.name}</p>
                            <p className="text-[10px] font-mono text-brand-primary-400 font-black uppercase tracking-widest mt-1 opacity-80">
                                {student.matricNumber || student.applicationNumber}
                            </p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                            student.status === 'Prospect' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                            {student.status === 'Prospect' ? 'Incomplete Application' : 'Student Record Active'}
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 py-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => handleItemClick('dashboard', 1)}
                        className={`w-full flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${
                            activeView === 'dashboard' ? 'bg-brand-primary-700 text-white shadow-xl shadow-brand-primary-900/50' : 'text-slate-400 hover:bg-brand-slate-800 hover:text-white'
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                    </button>

                    {categories.map((cat) => {
                        const isExpanded = expandedCategories.includes(cat.id);
                        return (
                            <div key={cat.id} className="space-y-1">
                                <button 
                                    onClick={() => toggleCategory(cat.id)}
                                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] group hover:text-brand-primary-400 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg bg-brand-slate-800/50 text-slate-500 group-hover:text-brand-primary-400 transition-colors">
                                            {cat.icon}
                                        </div>
                                        <span>{cat.label}</span>
                                    </div>
                                    <svg className={`w-3.5 h-3.5 transition-transform opacity-40 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {isExpanded && (
                                    <div className="space-y-0.5 ml-8 border-l border-brand-slate-800 animate-in slide-in-from-top-1 duration-200">
                                        {cat.items.map((item, idx) => {
                                            const isLocked = userLevel < item.level;
                                            const isActive = activeView === item.view && !isLocked;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleItemClick(item.view, item.level)}
                                                    className={`w-full flex items-center pl-8 pr-4 py-3 text-xs font-bold transition-all relative ${
                                                        isLocked 
                                                        ? 'opacity-20 cursor-not-allowed text-slate-600' 
                                                        : isActive
                                                            ? 'text-brand-primary-400'
                                                            : 'text-slate-400 hover:text-white hover:bg-brand-slate-800/50 rounded-r-2xl'
                                                    }`}
                                                >
                                                    {isActive && <div className="absolute left-0 w-1 h-4 bg-brand-primary-400 rounded-full -ml-[0.5px]"></div>}
                                                    <span className="truncate">{item.label}</span>
                                                    {isLocked && <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {userRole !== 'Student' && (
                        <div className="pt-8 border-t border-brand-slate-800">
                            <button 
                                onClick={() => setActiveView('super-admin-portal')}
                                className="w-full flex items-center px-4 py-4 text-xs font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-400/10 rounded-2xl transition-all"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Command Control
                            </button>
                        </div>
                    )}
                </nav>

                <div className="p-6 bg-brand-slate-950/40 border-t border-brand-slate-800">
                    <button 
                        onClick={onLogout}
                        className="w-full py-4 px-4 bg-brand-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-600/10 hover:text-rose-500 transition-all flex items-center justify-center gap-3 border border-brand-slate-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Terminal Exit
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
