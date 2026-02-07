
import React, { useState, useMemo } from 'react';
import { MOCK_APPLICANTS, DEPARTMENTS, MOCK_STUDENT } from '../constants';
import { Applicant, AdmissionStatus, UserRole, Student } from '../types';
import ApplicationsList from './ApplicationsList';

const CURRENT_USER_ROLE: UserRole = 'Admissions_Officer';

type AdmissionsSubView = 'overview' | 'applicants' | 'prospects' | 'settings' | 'import' | 'transfers';

const INITIAL_DEPT_POPULATION: Record<string, number> = {
    'Computer Science': 48,
    'Electrical Engineering': 20,
    'Mechanical Engineering': 35,
    'Civil Engineering': 10,
    'Accountancy': 49,
    'Business Administration': 15,
    'Mass Communication': 42,
};

const AdmissionsPortal: React.FC = () => {
    const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
    const [prospects, setProspects] = useState<Student[]>([]); // New list for the Prospects
    const [deptPopulation, setDeptPopulation] = useState<Record<string, number>>(INITIAL_DEPT_POPULATION);
    const [activeSubView, setActiveSubView] = useState<AdmissionsSubView>('applicants');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleStatusChange = (id: string, newStatus: AdmissionStatus, feedback?: string) => {
        const applicant = applicants.find(a => a.id === id);
        if (!applicant) return;

        if (newStatus === 'Approved' && deptPopulation[applicant.department] >= 50) {
            showToast(`Error: ${applicant.department} has reached maximum NBTE capacity (50).`, 'error');
            return;
        }

        setApplicants(prev => prev.map(app => 
            app.id === id ? { ...app, status: newStatus, isNew: false, rejectionReason: feedback } : app
        ));
        
        if (newStatus === 'Approved') {
            setDeptPopulation(prev => ({
                ...prev,
                [applicant.department]: prev[applicant.department] + 1
            }));
        }
        showToast(`Applicant ${id} successfully updated.`);
    };

    const handlePromoteToMatric = (prospectId: string) => {
        setIsSyncing(true);
        setTimeout(() => {
            const prospect = prospects.find(p => p.id === prospectId);
            if (!prospect) return;

            const year = new Date().getFullYear().toString().slice(-2);
            const deptCode = prospect.department.substring(0, 2).toUpperCase();
            const randomId = Math.floor(100 + Math.random() * 900);
            const matricNo = `MAT/${year}/${deptCode}/${randomId}`;

            // In a real app, we'd update the global student state or hit an API
            showToast(`Matriculation Authorized: ${prospect.name} assigned ${matricNo}`);
            
            setProspects(prev => prev.map(p => 
                p.id === prospectId ? { 
                    ...p, 
                    status: 'Admitted', 
                    matricNumber: matricNo, 
                    permissionLevel: 2 
                } : p
            ));
            
            setIsSyncing(false);
        }, 1500);
    };

    const stats = useMemo(() => ({
        total: applicants.length,
        approved: applicants.filter(a => a.status === 'Approved').length,
        pending: applicants.filter(a => a.status === 'Pending').length,
        prospects: prospects.length
    }), [applicants, prospects]);

    const SidebarItem = ({ view, label, icon }: { view: AdmissionsSubView, label: string, icon: React.ReactNode }) => (
        <button 
            onClick={() => setActiveSubView(view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeSubView === view ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span className="truncate">{label}</span>
        </button>
    );

    const renderProspectsView = () => (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-black text-slate-800">Direct Entry Prospects</h2>
                <p className="text-slate-500 text-sm mt-1">Authorized applicants awaiting institutional matriculation numbers.</p>
            </div>

            <div className="space-y-4">
                {prospects.length > 0 ? prospects.map(p => (
                    <div key={p.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-emerald-200 transition-all">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${p.status === 'Admitted' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>
                                {p.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{p.name}</h4>
                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">APP ID: {p.applicationNumber} • {p.department}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {p.status === 'Admitted' ? (
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-emerald-600 uppercase">Enrolled</p>
                                    <p className="text-sm font-black text-slate-800 font-mono">{p.matricNumber}</p>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handlePromoteToMatric(p.id)}
                                    disabled={isSyncing}
                                    className="px-6 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    {isSyncing ? 'Assigning...' : 'Authorize Matriculation'}
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center text-slate-300">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        <p className="text-xs font-black uppercase tracking-widest">No active prospects for review</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-right-4 ${
                    toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                }`}>
                    <p className="font-bold text-xs">{toast.message}</p>
                </div>
            )}

            <aside className="lg:w-64 space-y-4 flex-shrink-0">
                <div className="bg-emerald-900 p-6 rounded-2xl text-white shadow-xl overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Admissions Unit</p>
                        <h2 className="text-lg font-black leading-tight">Admin Console</h2>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                <div className="space-y-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <SidebarItem view="overview" label="Summary" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/></svg>} />
                    <SidebarItem view="applicants" label="UTME Pool" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    <SidebarItem view="prospects" label="Matric Gate" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                </div>
            </aside>

            <main className="flex-1 space-y-6">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Stream</p>
                        <h1 className="text-xl font-black text-slate-800">
                            {activeSubView === 'applicants' ? 'UTME Application pool' : activeSubView === 'prospects' ? 'Matriculation Control' : 'Dashboard Overview'}
                        </h1>
                    </div>
                </header>

                {activeSubView === 'overview' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Pool</p>
                            <p className="text-3xl font-black text-slate-800 mt-1">{stats.total}</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-emerald-700">
                            <p className="text-[10px] font-black uppercase tracking-widest">UTME Admits</p>
                            <p className="text-3xl font-black mt-1">{stats.approved}</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-700">
                            <p className="text-[10px] font-black uppercase tracking-widest">Prospect Pool</p>
                            <p className="text-3xl font-black mt-1">{stats.prospects}</p>
                        </div>
                    </div>
                )}

                {activeSubView === 'applicants' && (
                    <ApplicationsList 
                        applicants={applicants} 
                        deptPopulation={deptPopulation}
                        onStatusChange={handleStatusChange} 
                    />
                )}

                {activeSubView === 'prospects' && renderProspectsView()}
            </main>
        </div>
    );
};

export default AdmissionsPortal;
