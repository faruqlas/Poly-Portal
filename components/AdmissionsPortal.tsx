
import React, { useState, useMemo } from 'react';
import { DEPARTMENTS } from '../constants';
import { AdmissionStatus, Student } from '../types';
import ApplicationsList from './ApplicationsList';
import { supabase } from '../supabaseClient';

interface AdmissionsPortalProps {
    allStudents: Student[];
    setAllStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const AdmissionsPortal: React.FC<AdmissionsPortalProps> = ({ allStudents, setAllStudents }) => {
    const applicants = useMemo(() => allStudents.filter(s => s.status === 'Prospect'), [allStudents]);
    const prospects = useMemo(() => allStudents.filter(s => s.status === 'Admitted' && !s.matricNumber), [allStudents]);

    const [deptPopulation, setDeptPopulation] = useState<Record<string, number>>(() => {
        const initialPop: Record<string, number> = {};
        allStudents.forEach(s => {
            if(s.matricNumber) {
                initialPop[s.department] = (initialPop[s.department] || 0) + 1;
            }
        });
        return initialPop;
    });

    const [activeSubView, setActiveSubView] = useState<'applicants' | 'prospects'>('applicants');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleStatusChange = async (id: string, newStatus: AdmissionStatus) => {
        const applicant = applicants.find(a => a.id === id);
        if (!applicant) return;

        if (newStatus === 'Approved' && (deptPopulation[applicant.department] || 0) >= 50) {
            showToast(`Error: ${applicant.department} has reached maximum NBTE capacity (50).`, 'error');
            return;
        }
        
        const { data, error } = await supabase.from('students').update({ status: newStatus }).eq('id', id).select().single();

        if(data && !error) {
            setAllStudents(prev => prev.map(app => app.id === id ? data : app));
            if (newStatus === 'Approved') {
                setDeptPopulation(prev => ({
                    ...prev,
                    [applicant.department]: (prev[applicant.department] || 0) + 1
                }));
            }
            showToast(`Applicant ${id} successfully updated.`);
        } else {
             showToast(`Failed to update applicant ${id}.`, 'error');
        }
    };

    const handlePromoteToMatric = async (prospectId: string) => {
        setIsSyncing(true);
        const prospect = prospects.find(p => p.id === prospectId);
        if (!prospect) return;

        const year = new Date().getFullYear().toString().slice(-2);
        const deptCode = prospect.department.substring(0, 2).toUpperCase();
        const randomId = Math.floor(100 + Math.random() * 900);
        const matricNo = `MAT/${year}/${deptCode}/${randomId}`;

        const { data, error } = await supabase.from('students').update({ matricNumber: matricNo, permissionLevel: 2 }).eq('id', prospectId).select().single();

        if (data && !error) {
            showToast(`Matriculation Authorized: ${prospect.name} assigned ${matricNo}`);
            setAllStudents(prev => prev.map(p => p.id === prospectId ? data : p));
        } else {
            showToast('Failed to assign matric number.', 'error');
        }
        setIsSyncing(false);
    };

    const SidebarItem = ({ view, label, icon }: { view: 'applicants' | 'prospects', label: string, icon: React.ReactNode }) => (
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
                            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center font-black">
                                {p.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{p.name}</h4>
                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">APP ID: {p.applicationNumber} • {p.department}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {p.matricNumber ? (
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
                        <p className="text-xs font-black uppercase tracking-widest">No active prospects for review</p>
                    </div>
                )}
            </div>
        </div>
    );
    
    // The applicants are now students with 'Prospect' status. We need to adapt the props for ApplicationsList
    const applicantsForList = applicants.map(a => ({
        id: a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        department: a.department,
        score: 180, // This is not in the student table, using a mock value
        status: a.status as AdmissionStatus,
        dateApplied: a.createdAt,
        program: a.level,
        oLevelCredits: 5, // This is not in the student table, using a mock value
    }));


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
                <div className="space-y-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <SidebarItem view="applicants" label="UTME Pool" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    <SidebarItem view="prospects" label="Matric Gate" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                </div>
            </aside>

            <main className="flex-1 space-y-6">
                 <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Stream</p>
                        <h1 className="text-xl font-black text-slate-800">
                            {activeSubView === 'applicants' ? 'UTME Application pool' : 'Matriculation Control'}
                        </h1>
                    </div>
                </header>
                {activeSubView === 'applicants' && (
                    <ApplicationsList 
                        applicants={applicantsForList} 
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
