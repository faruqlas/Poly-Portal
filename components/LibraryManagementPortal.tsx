
import React, { useState } from 'react';
import { LibraryBook, LibraryLoan, Student } from '../types';
import CirculationTerminal from './CirculationTerminal';

interface LibraryManagementPortalProps {
    students: Student[];
    books: LibraryBook[];
    setBooks: React.Dispatch<React.SetStateAction<LibraryBook[]>>;
    loans: LibraryLoan[];
    setLoans: React.Dispatch<React.SetStateAction<LibraryLoan[]>>;
}

const LibraryManagementPortal: React.FC<LibraryManagementPortalProps> = ({ students, books, setBooks, loans, setLoans }) => {
    const [activeSubView, setActiveSubView] = useState<'dashboard' | 'issue-return'>('dashboard');
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleIssueBook = (studentIdentifier: string, bookId: string) => {
        // CROSS-PORTAL SYNC: Verify identity against Registrar Registry
        const student = students.find(s => s.matricNumber === studentIdentifier || s.id === studentIdentifier);
        
        if (!student) {
            showToast('Authorization Denied: Identity not found in Registrar Registry.', 'error');
            return;
        }

        if (!student.is_jamb_verified) {
            showToast('Registry Block: Student JAMB credentials not yet verified by Registrar.', 'error');
            return;
        }

        const book = books.find(b => b.id === bookId);
        if (!book || book.availableCopies < 1) {
            showToast('Asset unavailable.', 'error');
            return;
        }

        setIsSyncing(true);
        setTimeout(() => {
            const newLoan: LibraryLoan = {
                id: `LN-${Date.now()}`,
                bookId: book.id,
                bookTitle: book.title,
                memberId: student.id,
                memberName: student.name,
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                status: 'Active',
                fineAmount: 0
            };

            setLoans(prev => [newLoan, ...prev]);
            setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
            setIsSyncing(false);
            showToast(`Asset Authorized for "${student.name}". Logged with Central Registry.`);
        }, 1000);
    };

    const handleReturnBook = (loanId: string) => {
        const loan = loans.find(l => l.id === loanId);
        if (!loan) return;
        setLoans(prev => prev.filter(l => l.id !== loanId));
        setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
        showToast('Resource Check-in Complete.');
    };

    return (
        <div className="space-y-6">
             {toast && (
                <div className={`fixed top-6 right-6 z-[200] px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl animate-in slide-in-from-right-4 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-navy-primary'}`}>
                    {toast.msg}
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Library Control Terminal</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Registry Bridge: Registrar Protocol V2 Connected</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                    <button onClick={() => setActiveSubView('dashboard')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSubView === 'dashboard' ? 'bg-white text-navy-primary shadow-sm' : 'text-slate-400'}`}>Overview</button>
                    <button onClick={() => setActiveSubView('issue-return')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSubView === 'issue-return' ? 'bg-white text-navy-primary shadow-sm' : 'text-slate-400'}`}>Circulation</button>
                </div>
            </header>

            {activeSubView === 'issue-return' ? (
                <CirculationTerminal 
                    members={students.map(s => ({ id: s.id, name: s.name, type: 'Student', department: s.department, identifier: s.matricNumber || s.id, joinedDate: s.session, borrowingStatus: 'Active', totalFinesOwed: 0 }))} 
                    books={books} 
                    loans={loans} 
                    onIssue={handleIssueBook} 
                    onReturn={handleReturnBook}
                    onWaive={() => {}}
                    isSyncing={isSyncing}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Asset Count</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">{books.reduce((a, b) => a + b.totalCopies, 0)}</p>
                    </div>
                    <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Loans</p>
                        <p className="text-3xl font-black text-navy-primary mt-1">{loans.length}</p>
                    </div>
                    <div className="p-8 bg-navy-primary rounded-[32px] text-white shadow-xl">
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Registry State</p>
                        <p className="text-3xl font-black mt-1">Live Sync</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryManagementPortal;
