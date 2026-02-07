import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DEPARTMENTS } from '../constants';
import { StudentFinancialRecord, Transaction, Student } from '../types';

interface BursaryPortalProps {
    records: StudentFinancialRecord[];
    setRecords: React.Dispatch<React.SetStateAction<StudentFinancialRecord[]>>;
    onSyncRecord: (record: StudentFinancialRecord) => void;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    students: Student[];
}

const BursaryPortal: React.FC<BursaryPortalProps> = ({ records, setRecords, onSyncRecord, transactions, setTransactions, students }) => {
    const [activeSubView, setActiveSubView] = useState<'dashboard' | 'manual'>('dashboard');
    const [isSyncing, setIsSyncing] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    const [verifyRef, setVerifyRef] = useState('');
    const [verifyAmount, setVerifyAmount] = useState('');
    const [verifyStudentId, setVerifyStudentId] = useState('');

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleVerifyPayment = (e: React.FormEvent) => {
        e.preventDefault();
        // Fix: Use the students prop to find the student, then use the student's ID to find their financial record.
        const student = students.find(s => s.id === verifyStudentId || s.matricNumber === verifyStudentId);
        if (!student) {
            showToast('Student identity not found.', 'error');
            return;
        }
        const record = records.find(r => r.studentId === student.id);
        if (!record) {
            showToast('Student financial record not found in Bursary records.', 'error');
            return;
        }

        setIsSyncing(true);
        setTimeout(() => {
            const amountNum = Number(verifyAmount);
            const updatedPaid = record.amountPaid + amountNum;
            const balance = Math.max(0, record.totalFees - updatedPaid);
            const isCleared = balance === 0;

            const updatedRecord: StudentFinancialRecord = {
                ...record,
                amountPaid: updatedPaid,
                balance,
                isCleared,
                paymentStatus: isCleared ? 'Fully Paid' : 'Part Payment'
            };

            onSyncRecord(updatedRecord);
            
            const newTxn: Transaction = {
                id: `TXN-${Date.now()}`,
                // Fix: Changed 'date' to 'createdAt' to match Transaction type
                createdAt: new Date().toISOString(),
                studentId: student.id,
                // Fix: Added studentName to the transaction object
                studentName: student.name,
                amount: amountNum,
                category: 'Tuition',
                reference: verifyRef,
                status: 'Verified'
            };
            setTransactions(prev => [newTxn, ...prev]);
            
            setIsSyncing(false);
            setVerifyRef('');
            setVerifyAmount('');
            setVerifyStudentId('');
            showToast('Payment verified. Exams portal cleared for this candidate.');
        }, 1200);
    };

    const dashboardStats = useMemo(() => {
        const totalRevenue = transactions.filter(t => t.status === 'Verified').reduce((a, b) => a + b.amount, 0);
        const revenueByDept = DEPARTMENTS.map(dept => ({
            name: dept.substring(0, 5),
            value: records.filter(r => students.find(s => s.id === r.studentId)?.department === dept).reduce((a, b) => a + b.amountPaid, 0)
        })).filter(d => d.value > 0);

        return { totalRevenue, revenueByDept };
    }, [transactions, records, students]);

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-6 right-6 z-[300] px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl animate-in slide-in-from-right-4 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-navy-primary'}`}>
                    {toast.msg}
                </div>
            )}
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Institutional Treasury</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Exams Clearance Sync: Active</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                    <button onClick={() => setActiveSubView('dashboard')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSubView === 'dashboard' ? 'bg-white text-navy-primary shadow-sm' : 'text-slate-400'}`}>Stats</button>
                    <button onClick={() => setActiveSubView('manual')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSubView === 'manual' ? 'bg-white text-navy-primary shadow-sm' : 'text-slate-400'}`}>Verify RRR</button>
                </div>
            </header>

            {activeSubView === 'manual' ? (
                <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
                    <div className="bg-navy-primary p-8 rounded-3xl text-white mb-8">
                        <h3 className="text-xl font-black uppercase tracking-widest">Manual Post Authority</h3>
                        <p className="text-blue-100 text-xs mt-1">Authorize payments not auto-detected by Remita Webhook.</p>
                    </div>
                    <form onSubmit={handleVerifyPayment} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Student Identifier (Matric/ID)</label>
                            <input type="text" className="w-full px-4 py-3 text-sm font-bold transition-all outline-none" value={verifyStudentId} onChange={(e) => setVerifyStudentId(e.target.value)} required placeholder="e.g., STU001" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount (₦)</label>
                                <input type="number" className="w-full px-4 py-3 text-sm font-bold transition-all outline-none" value={verifyAmount} onChange={(e) => setVerifyAmount(e.target.value)} required placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">RRR Reference</label>
                                <input type="text" className="w-full px-4 py-3 text-sm font-bold transition-all outline-none" value={verifyRef} onChange={(e) => setVerifyRef(e.target.value)} required placeholder="1234-5678-9012" />
                            </div>
                        </div>
                        <button type="submit" disabled={isSyncing} className="btn-accent w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                            {isSyncing && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                            Sync with Exams Registry
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Revenue Stream Profile</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardStats.revenueByDept}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#004a7c" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Realized</p>
                        <p className="text-4xl font-black text-navy-primary mt-2">₦{dashboardStats.totalRevenue.toLocaleString()}</p>
                        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <p className="text-[9px] font-black text-emerald-700 uppercase">Gateway Efficiency: 98.4%</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BursaryPortal;