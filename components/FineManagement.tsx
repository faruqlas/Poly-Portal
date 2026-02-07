
import React, { useState, useMemo } from 'react';
import { LibraryLoan, LibraryMember, LibraryBook } from '../types';

interface FineManagementProps {
    loans: LibraryLoan[];
    members: LibraryMember[];
    books: LibraryBook[];
    onPayFine: (loanId: string) => void;
    onUpdateRates: (rates: { Student: number, Staff: number }) => void;
    currentRates: { Student: number, Staff: number };
}

const FineManagement: React.FC<FineManagementProps> = ({
    loans,
    members,
    books,
    onPayFine,
    onUpdateRates,
    currentRates
}) => {
    const [studentRate, setStudentRate] = useState(currentRates.Student);
    const [staffRate, setStaffRate] = useState(currentRates.Staff);

    // Filter only overdue or returned with unpaid fines
    const problematicLoans = useMemo(() => {
        return loans.filter(l => l.fineAmount > 0 || l.status === 'Overdue');
    }, [loans]);

    const handleRateUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateRates({ Student: studentRate, Staff: staffRate });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dynamic Rates Configuration */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Financial Policy Controls</h2>
                        <p className="text-slate-500 text-sm mt-1">Configure dynamic penalty rates for institutional user groups.</p>
                    </div>
                    <form onSubmit={handleRateUpdate} className="flex items-end gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Rate (₦/Day)</label>
                            <input 
                                type="number" 
                                value={studentRate} 
                                onChange={(e) => setStudentRate(Number(e.target.value))}
                                className="w-32 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff Rate (₦/Day)</label>
                            <input 
                                type="number" 
                                value={staffRate} 
                                onChange={(e) => setStaffRate(Number(e.target.value))}
                                className="w-32 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                            />
                        </div>
                        <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-black transition-all">
                            Save Rates
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <p className="text-[10px] font-bold text-amber-800 uppercase leading-relaxed">
                            System Policy: Members with accumulated fines exceeding ₦5,000 are automatically flagged as "Suspended" from further circulation activities.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fines Management Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Outstanding Penalties</h3>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black">{problematicLoans.length} Unresolved Cases</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Member & Resource</th>
                                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Days Overdue</th>
                                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Accrued Fine</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {problematicLoans.map(loan => {
                                const member = members.find(m => m.id === loan.memberId);
                                const isSuspended = (member?.totalFinesOwed || 0) > 5000;
                                
                                // Calculate days overdue logic
                                const due = new Date(loan.dueDate);
                                const today = new Date();
                                const diffTime = Math.max(0, today.getTime() - due.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                return (
                                    <tr key={loan.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-800">{loan.memberName}</span>
                                                    {isSuspended && (
                                                        <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded uppercase animate-pulse">SUSPENDED</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{loan.bookTitle}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className="text-sm font-black text-slate-700">{diffDays} Days</span>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className="text-lg font-black text-rose-600">₦{loan.fineAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button 
                                                onClick={() => onPayFine(loan.id)}
                                                className="px-6 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
                                            >
                                                Mark as Paid
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {problematicLoans.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <p className="text-slate-300 font-black uppercase tracking-[0.2em]">Financial Audit Clear</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fine Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Total Receivables</p>
                    <p className="text-3xl font-black">₦{loans.reduce((acc, l) => acc + l.fineAmount, 0).toLocaleString()}</p>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-3xl"></div>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Members Restricted</p>
                    <p className="text-3xl font-black text-slate-800">{members.filter(m => m.totalFinesOwed > 5000).length}</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Collection Efficiency</p>
                    <p className="text-3xl font-black text-emerald-600">92%</p>
                </div>
            </div>
        </div>
    );
};

export default FineManagement;
