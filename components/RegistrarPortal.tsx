
import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { DEPARTMENTS } from '../constants';

interface RegistrarPortalProps {
    onVerifyStudent: (id: string, isVerified: boolean) => void;
    students: Student[];
}

interface SentMessage {
    id: string;
    target: string;
    subject: string;
    body: string;
    timestamp: string;
}

const RegistrarPortal: React.FC<RegistrarPortalProps> = ({ onVerifyStudent, students }) => {
    const [activeSubView, setActiveSubView] = useState('jamb-verification');
    const [currentSession, setCurrentSession] = useState('2025/2026');
    const [verifyingApplicants, setVerifyingApplicants] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        students.forEach(s => {
            if (s.isJambVerified) {
                initialState[s.id] = true;
            }
        });
        return initialState;
    });
    const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    // Message Center State
    const [targetGroup, setTargetGroup] = useState('All Students');
    const [subject, setSubject] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
    const [isSending, setIsSending] = useState(false);

    const studentLevels = ['ND I', 'ND II', 'HND I', 'HND II'];

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        setTimeout(() => {
            const newMessage: SentMessage = {
                id: `MSG-${Date.now()}`,
                target: targetGroup,
                subject: subject,
                body: messageBody,
                timestamp: new Date().toLocaleString()
            };
            setSentMessages(prev => [newMessage, ...prev]);
            setSubject('');
            setMessageBody('');
            setTargetGroup('All Students');
            setIsSending(false);
            showToast(`Notification sent to ${targetGroup}.`);
        }, 1200);
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

    const handleVerify = (app: Student) => {
        const newState = !verifyingApplicants[app.id];
        setVerifyingApplicants(prev => ({ ...prev, [app.id]: newState }));
        onVerifyStudent(app.id, newState);
        showToast(`Identity ${newState ? 'Verified' : 'Locked'} for ${app.name}. Broadcast to Library Hub complete.`);
    };
    
    const applicants = students.filter(s => s.status === 'Admitted' || s.status === 'Prospect');

    const renderMessageCenter = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-1">
                <form onSubmit={handleMessageSubmit} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Compose Broadcast</h3>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Group</label>
                        <select 
                            value={targetGroup} 
                            onChange={e => setTargetGroup(e.target.value)}
                            className="w-full px-4 py-3 text-sm font-bold transition-all outline-none"
                        >
                            <option>All Students</option>
                            <optgroup label="By Faculty">
                                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </optgroup>
                            <optgroup label="By Level">
                                {studentLevels.map(level => <option key={level} value={level}>{level}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Urgent Notice on Fee Payment"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full px-4 py-3 text-sm font-bold transition-all outline-none"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message Body</label>
                        <textarea 
                            rows={6}
                            placeholder="Compose your message here..."
                            value={messageBody}
                            onChange={e => setMessageBody(e.target.value)}
                            className="w-full px-4 py-3 text-sm font-bold transition-all outline-none resize-none"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" disabled={isSending} className="btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                        {isSending && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                        {isSending ? 'Broadcasting...' : 'Send Notification'}
                    </button>
                </form>
            </div>
            <div className="lg:col-span-2">
                 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-full">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 mb-6">Broadcast History</h3>
                    {sentMessages.length > 0 ? (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {sentMessages.map(msg => (
                                <div key={msg.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{msg.subject}</p>
                                            <span className="px-2 py-0.5 mt-1 inline-block bg-navy-primary text-white text-[8px] font-black uppercase rounded">{msg.target}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 flex-shrink-0 pl-4">{msg.timestamp}</p>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200">{msg.body}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <div className="p-4 bg-slate-100 rounded-full mb-4 text-slate-300">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No Broadcasts Sent</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );

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
                    <NavItem view="message-center" label="Message Center" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
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

                {activeSubView === 'message-center' && renderMessageCenter()}

                {activeSubView === 'jamb-verification' ? (
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Identity Verification Stream</h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-50">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Application ID</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Library Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {applicants.map(app => (
                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{app.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{app.matricNumber || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono text-xs font-bold text-slate-500">{app.applicationNumber}</td>
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
                ) : activeSubView !== 'message-center' && (
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
