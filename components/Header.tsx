
import React from 'react';
import { Student } from '../types';

interface HeaderProps {
    student: Student;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ student, toggleSidebar }) => {
    return (
        <>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-brand-primary-600">
                Skip to main content
            </a>
            <header className="flex items-center justify-between h-20 px-8 bg-white border-b border-brand-slate-100 print:hidden z-10">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="p-2 text-brand-slate-500 focus:outline-none lg:hidden hover:bg-brand-slate-50 rounded-xl transition-colors" aria-label="Toggle navigation menu">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary-500 animate-pulse"></div>
                        <h2 className="text-sm font-black text-brand-slate-400 uppercase tracking-[0.2em]">Institutional Command Center</h2>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-sm font-black text-brand-slate-800 leading-none">{student.name}</p>
                        <p className="text-[10px] font-bold text-brand-slate-400 uppercase mt-1 tracking-widest">{student.matricNumber || student.applicationNumber}</p>
                    </div>
                    <button className="relative p-2.5 bg-brand-slate-50 text-brand-slate-400 rounded-2xl hover:bg-brand-primary-50 hover:text-brand-primary-600 transition-all border border-brand-slate-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                    </button>
                    <div className="h-10 w-10 rounded-2xl bg-brand-slate-100 p-0.5 border border-brand-slate-200">
                        <img className="h-full w-full rounded-[14px] object-cover" src={student.avatarUrl} alt="" />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
