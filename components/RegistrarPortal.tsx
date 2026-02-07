
import React, { useState, useRef } from 'react';
import { DEPARTMENTS, MOCK_COURSES, MOCK_APPLICANTS } from '../constants';
import { Applicant, Course } from '../types';

interface RegistrarPortalProps {
    onVerifyStudent: (id: string, isVerified: boolean) => void;
}

const RegistrarPortal: React.FC<RegistrarPortalProps> = ({ onVerifyStudent }) => {
    const [activeSubView, setActiveSubView] = useState('academic-sessions');
    const [currentSession, setCurrentSession] = useState('2025/2026');
    const [verifyingApplicants, setVerifyingApplicants] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const NavItem = ({ view, label, icon }: { view: string, label: string, icon: React.ReactNode }) => (
        <button 
            onClick={() => setActiveSubView(view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                activeSubView === view ? 'bg-navy-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span className="truncate">{label}</span>
        </button>
    );

    const handleVerify = (app: Applicant) => {
        const newState = !verifyingApplicants[app.id];
        setVerifyingApplicants(prev => ({ ...prev, [app.id]: newState }));
        onVerifyStudent(app.id, newState);
        showToast(`Identity ${newState ? 'Verified' : 'Locked'} for ${app.name}. Broadcast to Library Hub complete.`);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)]">
            {toast && (
                <div className={`fixed top-6 right-6 z-[200] px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl animate-in slide-in-from-right-4 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-navy-primary'}`}>
                    {toast.msg}
                </div>
            )}

            <aside className="lg:w-72 space-y-4 flex-shrink-0">
                <div className="bg-navy-primary p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mb-1">Registrar Console</p>
                    <h2 className="text-2xl font-black leading-tight">Admin<br/>Module</h2>
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm space-y-1">
                    <NavItem view="academic-sessions" label="Session Control" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                    <NavItem view="jamb-verification" label="Registry Sync" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                </div>
            </aside>

            <main className="flex-1 space-y-6">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Operations</p>
                        <h1 className="text-2xl font-black text-slate-800">Registrar Hub</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Current Session: {currentSession}</p>
                    </div>
                </header>

                {activeSubView === 'jamb-verification' ? (
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Identity Verification Stream</h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-50">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">JAMB Score</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Library Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {MOCK_APPLICANTS.map(app => (
                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{app.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{app.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-black text-slate-600">{app.score}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleVerify(app)}
                                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all shadow-sm ${
                                                        verifyingApplicants[app.id] ? 'bg-emerald-500 text-white' : 'btn-secondary'
                                                    }`}
                                                >
                                                    {verifyingApplicants[app.id] ? 'Identity Verified' : 'Verify Identity'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-[32px] text-center border border-slate-100 shadow-sm animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Academic Lifecycle Hub</h3>
                        <p className="mt-2 text-slate-500 max-w-sm mx-auto">Select a functional module from the registry sidebar to manage institutional standings.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RegistrarPortal;
