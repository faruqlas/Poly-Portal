
import React, { useState, useMemo } from 'react';
import { Applicant, AdmissionStatus } from '../types';

interface ApplicationsListProps {
    applicants: Applicant[];
    deptPopulation: Record<string, number>;
    onStatusChange: (id: string, newStatus: AdmissionStatus, feedback?: string) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ applicants, deptPopulation, onStatusChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
    const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
    const [rejectionFeedback, setRejectionFeedback] = useState('');

    const filteredApplicants = useMemo(() => {
        return applicants.filter(app => 
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [applicants, searchTerm]);

    const handleOpenModal = (app: Applicant, type: 'approve' | 'reject') => {
        setSelectedApp(app);
        setModalType(type);
        setRejectionFeedback('');
    };

    const handleCloseModal = () => {
        setSelectedApp(null);
        setModalType(null);
    };

    const handleConfirmAction = () => {
        if (!selectedApp || !modalType) return;
        
        if (modalType === 'reject' && !rejectionFeedback.trim()) {
            alert('Please provide a rejection reason.');
            return;
        }

        const status: AdmissionStatus = modalType === 'approve' ? 'Approved' : 'Rejected';
        onStatusChange(selectedApp.id, status, modalType === 'reject' ? rejectionFeedback : undefined);
        handleCloseModal();
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search by name, ID, or department..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApplicants.length > 0 ? (
                                filteredApplicants.map((app) => {
                                    const currentPop = deptPopulation[app.department] || 0;
                                    const isDeptFull = currentPop >= 50;

                                    return (
                                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-400">
                                                {app.id}
                                                {app.isNew && (
                                                    <span className="ml-2 px-1.5 py-0.5 bg-brand-blue-600 text-white text-[8px] font-black uppercase rounded animate-pulse">New</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{app.name}</span>
                                                    <span className="text-[10px] text-slate-400">{app.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-600">{app.department}</span>
                                                    <span className={`text-[8px] font-black uppercase tracking-tighter ${isDeptFull ? 'text-rose-500' : 'text-slate-300'}`}>
                                                        Quota: {currentPop} / 50 {isDeptFull && '— FULL'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-sm font-black ${app.score >= 200 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {app.score}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1 group/status">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                        app.status === 'Waitlisted' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                    {app.status === 'Rejected' && app.rejectionReason && (
                                                        <div className="relative">
                                                            <svg className="w-3 h-3 text-rose-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover/status:opacity-100 transition-opacity w-48 shadow-xl pointer-events-none z-10 border border-slate-700">
                                                                <p className="font-black uppercase text-slate-400 mb-1 border-b border-slate-700 pb-1">Rejection Reason</p>
                                                                <p className="font-medium italic leading-relaxed">"{app.rejectionReason}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {app.status === 'Pending' ? (
                                                        <>
                                                            <div className="relative group">
                                                                <button 
                                                                    onClick={() => !isDeptFull && handleOpenModal(app, 'approve')}
                                                                    disabled={isDeptFull}
                                                                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all shadow-sm ${
                                                                        isDeptFull 
                                                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' 
                                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                                                                    }`}
                                                                >
                                                                    {isDeptFull ? 'Dept Full' : 'Approve'}
                                                                </button>
                                                                {isDeptFull && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-rose-600 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                                        NBTE Max Capacity Reached
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button 
                                                                onClick={() => handleOpenModal(app, 'reject')}
                                                                className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-50 transition-all"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={() => onStatusChange(app.id, 'Pending')}
                                                            className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 underline underline-offset-4"
                                                        >
                                                            Re-evaluate
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No applicants found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Decision Modals */}
            {modalType && selectedApp && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className={`p-6 text-white ${modalType === 'approve' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                            <h3 className="text-xl font-black">
                                {modalType === 'approve' ? 'Confirm Admission' : 'Confirm Rejection'}
                            </h3>
                            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">
                                Applicant: {selectedApp.name}
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {modalType === 'approve' ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Are you sure you want to approve this student for admission? An official offer letter will be generated and sent to their email address.
                                    </p>
                                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
                                        <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        <p className="text-[10px] font-bold text-emerald-800 uppercase leading-normal">
                                            This action verifies the student has met all departmental cut-off requirements for {selectedApp.department}.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Rejection Reason</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
                                        placeholder="Enter the mandatory reason for rejection (e.g., Score below cut-off, O'Level deficiency)..."
                                        value={rejectionFeedback}
                                        onChange={(e) => setRejectionFeedback(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button 
                                onClick={handleCloseModal}
                                className="px-6 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmAction}
                                className={`px-8 py-2 text-white text-xs font-black uppercase rounded-xl shadow-lg transition-all active:scale-95 ${
                                    modalType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                }`}
                            >
                                {modalType === 'approve' ? 'Confirm Admission' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsList;
