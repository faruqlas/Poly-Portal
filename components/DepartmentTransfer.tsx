
import React, { useState } from 'react';
import { MOCK_STUDENT, DEPARTMENTS } from '../constants';

const DepartmentTransfer: React.FC = () => {
    const [targetDepartment, setTargetDepartment] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetDepartment || !reason) {
            alert('Please fill all fields.');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmSubmission = () => {
        setSubmitted(true);
        setShowConfirmModal(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-50 text-navy-primary rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Department Transfer Request</h2>
            </div>
            <p className="text-slate-600 mb-6">Apply for a change of department. Requests are subject to NBTE quota availability and HOD approval.</p>

            {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl animate-in zoom-in-95 duration-300" role="status">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="font-black text-xl">Application Transmitted</h3>
                    <p className="mt-2 text-sm opacity-90">Your request to transfer to the <span className="font-bold">{targetDepartment}</span> department has been logged in the system.</p>
                    <div className="mt-6 p-4 bg-white/50 rounded-xl text-left border border-emerald-100">
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Next Step</p>
                        <p className="text-xs">Monitor your student email for a notification from the Admissions Unit. You may be invited for an interview.</p>
                    </div>
                    <button onClick={() => { setSubmitted(false); setTargetDepartment(''); setReason(''); }} className="btn-primary mt-8 px-8 py-3 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100">
                        Make another request
                    </button>
                </div>
            ) : (
                <form onSubmit={handleInitialSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="currentDepartment" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Academic Base</label>
                        <input id="currentDepartment" type="text" value={MOCK_STUDENT.department} disabled className="w-full px-4 py-3 text-sm font-bold opacity-60 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="targetDepartment" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">New Department (Destination)</label>
                        <select
                            id="targetDepartment"
                            value={targetDepartment}
                            onChange={(e) => setTargetDepartment(e.target.value)}
                            className="w-full px-4 py-3 text-sm font-bold transition-all outline-none"
                            required
                        >
                            <option value="">Select target department...</option>
                            {DEPARTMENTS.filter(d => d !== MOCK_STUDENT.department).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Justification for Transfer</label>
                        <textarea
                            id="reason"
                            rows={5}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a detailed explanation for your request. Include academic interests or career alignment..."
                            className="w-full px-4 py-3 text-sm transition-all outline-none resize-none"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-4">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                            <span className="font-bold">NBTE Notice:</span> A transfer request is irreversible once processed. Ensure your 100L/NDI results meet the minimum prerequisite for the new department.
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="btn-primary w-full sm:w-auto px-10 py-4 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-blue-100 active:scale-95">
                            Submit Application
                        </button>
                    </div>
                </form>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="bg-navy-primary p-8 text-white">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black">Confirm Action</h3>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">Institutional Transfer Request</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    You are about to submit a formal application to transfer your academic records:
                                </p>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-center flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current</p>
                                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{MOCK_STUDENT.department}</p>
                                    </div>
                                    <div className="px-4 text-navy-primary">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                    <div className="text-center flex-1">
                                        <p className="text-[9px] font-black text-navy-primary uppercase mb-1">Target</p>
                                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{targetDepartment}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    className="btn-secondary flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmSubmission}
                                    className="btn-primary flex-[2] py-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95"
                                >
                                    Confirm & Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentTransfer;
