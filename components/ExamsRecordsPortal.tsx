
import React, { useState, useMemo } from 'react';
import { MOCK_STUDENT, MOCK_ALL_RESULTS } from '../constants';
import { Result, StudentFinancialRecord } from '../types';

interface ExamsRecordsPortalProps {
    financialRecords: StudentFinancialRecord[];
}

interface UploadedResult extends Result {
    studentName: string;
    matricNumber: string;
    id: string;
}

const MOCK_UPLOAD_QUEUE: UploadedResult[] = [
    { id: '1', matricNumber: 'POLY/CS/21/001', studentName: 'Adebayo Chukwuemeka', courseCode: 'COM 211', courseTitle: 'Java I', units: 3, score: 85, grade: 'A', session: '2023/2024', semester: 'First Semester' },
    { id: '2', matricNumber: 'POLY/CS/21/002', studentName: 'Blessing Okafor', courseCode: 'COM 211', courseTitle: 'Java I', units: 3, score: 105, grade: 'A', session: '2023/2024', semester: 'First Semester' }, // ANOMALY
    { id: '3', matricNumber: 'POLY/CS/21/003', studentName: 'Sarah Smith', courseCode: 'COM 211', courseTitle: 'Java I', units: 3, score: -5, grade: 'F', session: '2023/2024', semester: 'First Semester' },  // ANOMALY
    { id: '4', matricNumber: 'POLY/CS/21/004', studentName: 'Ibrahim Musa', courseCode: 'COM 211', courseTitle: 'Java I', units: 3, score: 72, grade: 'B', session: '2023/2024', semester: 'First Semester' },
    { id: '5', matricNumber: 'POLY/CS/21/005', studentName: 'Chinelo Azikiwe', courseCode: 'COM 211', courseTitle: 'Java I', units: 3, score: 250, grade: 'A', session: '2023/2024', semester: 'First Semester' }, // ANOMALY
];

const ExamsRecordsPortal: React.FC<ExamsRecordsPortalProps> = ({ financialRecords }) => {
    const [activeSubView, setActiveSubView] = useState<'performance' | 'processing' | 'clearance'>('performance');
    const [uploadQueue, setUploadQueue] = useState<UploadedResult[]>(MOCK_UPLOAD_QUEUE);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getClearance = (studentId: string) => {
        return financialRecords.find(r => r.studentId === studentId)?.isCleared || false;
    };

    const isAnomalous = (score: number) => score < 0 || score > 100;

    const anomalyCount = useMemo(() => {
        return uploadQueue.filter(r => isAnomalous(r.score)).length;
    }, [uploadQueue]);

    const handleCommitResults = () => {
        if (anomalyCount > 0) {
            showToast(`Commit Denied: ${anomalyCount} anomalous scores detected. Records must be between 0-100.`, 'error');
            return;
        }
        showToast('All results validated and committed to official academic transcripts.');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {toast && (
                <div className={`fixed top-6 right-6 z-[200] px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl animate-in slide-in-from-right-4 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'}`}>
                    {toast.msg}
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Academic Exams Authority</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Status: Consuming Real-Time Bursary Stream</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button onClick={() => setActiveSubView('performance')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubView === 'performance' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-400'}`}>Audit Scores</button>
                    <button onClick={() => setActiveSubView('processing')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubView === 'processing' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-400'}`}>Result Processing</button>
                    <button onClick={() => setActiveSubView('clearance')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubView === 'clearance' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-400'}`}>Eligibility Guard</button>
                </div>
            </header>

            {activeSubView === 'performance' && (
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black text-slate-800 mb-8">Consolidated Result Matrix</h2>
                    <div className="overflow-x-auto rounded-3xl border border-slate-50">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Bursary State</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[MOCK_STUDENT].map(student => {
                                    const cleared = getClearance(student.id);
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{student.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{student.matricNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${cleared ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                    {cleared ? 'Cleared' : 'LOCKED'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => !cleared ? showToast('Access Denied: Unpaid fees detected by Bursary.', 'error') : showToast('Result shared to portal.')}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${cleared ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}
                                                >
                                                    Publish Result
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeSubView === 'processing' && (
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Result Validation Queue</h2>
                                <p className="text-slate-500 text-sm mt-1">Audit bulk-uploaded scores for integrity and NBTE compliance.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {anomalyCount > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-2xl animate-pulse">
                                        <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                        <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">{anomalyCount} Anomalous Grades Found</span>
                                    </div>
                                )}
                                <button 
                                    onClick={handleCommitResults}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${anomalyCount > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}
                                >
                                    Commit Official Records
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[32px] border border-slate-100">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric Number</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Score (0-100)</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {uploadQueue.map((item) => {
                                        const anomaly = isAnomalous(item.score);
                                        return (
                                            <tr key={item.id} className={`transition-colors ${anomaly ? 'bg-rose-50/60' : 'hover:bg-slate-50/50'}`}>
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{item.matricNumber}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.studentName}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-black ${anomaly ? 'text-rose-600 underline decoration-2' : 'text-slate-700'}`}>
                                                            {item.score}
                                                        </span>
                                                        {anomaly && (
                                                            <span className="text-[8px] font-black text-rose-400 uppercase tracking-tighter mt-1">Out of Range</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-black ${anomaly ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                                                        {item.grade}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {anomaly ? (
                                                        <div className="flex items-center justify-end gap-2 text-rose-600">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Flagged</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Valid</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl text-indigo-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Data Integrity Protocol</h3>
                                <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">The processing engine automatically scans all uploaded batches for out-of-bounds scores. NBTE regulations require scores to be weighted from 0 to 100 before grade conversion. Any detected anomalies will freeze the 'Commit' authorization until resolved by the Exams Officer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubView === 'clearance' && (
                <div className="bg-rose-950 p-12 rounded-[40px] text-white text-center">
                    <h3 className="text-2xl font-black mb-4 italic">Eligibility Firewall Active</h3>
                    <p className="text-rose-200 text-sm max-w-lg mx-auto opacity-70">Automatic synchronization with the Bursary Portal prevents admit card generation for students with outstanding liabilities exceeding ₦0.00.</p>
                </div>
            )}
        </div>
    );
};

export default ExamsRecordsPortal;
