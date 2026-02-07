
import React, { useState, useMemo } from 'react';
import { LibraryBook, LibraryLoan, LibraryMember } from '../types';

interface CirculationTerminalProps {
    members: LibraryMember[];
    books: LibraryBook[];
    loans: LibraryLoan[];
    onIssue: (memberId: string, bookId: string) => void;
    onReturn: (loanId: string) => void;
    onWaive: (loan: LibraryLoan) => void;
    isSyncing: boolean;
}

const CirculationTerminal: React.FC<CirculationTerminalProps> = ({ 
    members, 
    books, 
    loans, 
    onIssue, 
    onReturn,
    onWaive,
    isSyncing 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null);
    const [isbnSearch, setIsbnSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const member = members.find(m => 
            m.identifier.toLowerCase() === searchTerm.toLowerCase() || 
            m.id.toLowerCase() === searchTerm.toLowerCase()
        );
        setSelectedMember(member || null);
    };

    const activeLoansForMember = useMemo(() => {
        if (!selectedMember) return [];
        return loans.filter(l => l.memberId === selectedMember.id && l.status !== 'Returned');
    }, [selectedMember, loans]);

    const eligibility = useMemo(() => {
        if (!selectedMember) return null;
        
        const limit = selectedMember.type === 'Staff' ? 5 : 3;
        const currentCount = activeLoansForMember.length;
        const hasFines = activeLoansForMember.some(l => l.fineAmount > 0);
        
        return {
            canBorrow: currentCount < limit && !hasFines,
            reason: currentCount >= limit ? `Reached limit of ${limit} books` : hasFines ? 'Outstanding fines detected' : null,
            limit,
            currentCount
        };
    }, [selectedMember, activeLoansForMember]);

    const filteredBooks = useMemo(() => {
        if (!isbnSearch) return [];
        return books.filter(b => 
            b.isbn.toLowerCase().includes(isbnSearch.toLowerCase()) || 
            b.title.toLowerCase().includes(isbnSearch.toLowerCase())
        );
    }, [isbnSearch, books]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Primary Scanning Bar */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Scan Member ID or Issue Card Barcode..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-lg font-black focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-10 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl">
                        Verify Member
                    </button>
                </form>
            </div>

            {selectedMember ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Member Profile & Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-2 h-full ${eligibility?.canBorrow ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 text-3xl font-black mb-4 border border-indigo-100">
                                    {selectedMember.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-black text-slate-800">{selectedMember.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedMember.identifier}</p>
                                <span className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    selectedMember.type === 'Staff' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
                                }`}>
                                    {selectedMember.type}
                                </span>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Issue Eligibility</span>
                                    {eligibility?.canBorrow ? (
                                        <span className="text-emerald-600 font-black text-xs uppercase flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Cleared
                                        </span>
                                    ) : (
                                        <span className="text-rose-600 font-black text-xs uppercase flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                            Blocked
                                        </span>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-2">
                                        <span>Quota Usage</span>
                                        <span>{eligibility?.currentCount} / {eligibility?.limit} Assets</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-700 ${eligibility?.canBorrow ? 'bg-indigo-600' : 'bg-rose-500'}`} 
                                            style={{ width: `${(eligibility!.currentCount / eligibility!.limit) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {!eligibility?.canBorrow && (
                                    <p className="text-[10px] font-bold text-rose-500 text-center uppercase animate-pulse">{eligibility?.reason}</p>
                                )}
                            </div>
                        </div>

                        {/* Issue Form */}
                        <div className={`bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-all ${!eligibility?.canBorrow ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Authorize New Issue</h4>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Scan Asset ISBN..." 
                                        className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                                        value={isbnSearch}
                                        onChange={(e) => setIsbnSearch(e.target.value)}
                                    />
                                </div>
                                
                                {isbnSearch && (
                                    <div className="max-h-60 overflow-y-auto space-y-2 border-t border-slate-50 pt-4">
                                        {filteredBooks.length > 0 ? filteredBooks.map(book => (
                                            <div key={book.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 transition-colors">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{book.title}</p>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{book.isbn} • {book.availableCopies} Left</p>
                                                </div>
                                                <button 
                                                    onClick={() => { onIssue(selectedMember.id, book.id); setIsbnSearch(''); }}
                                                    disabled={book.availableCopies < 1 || isSyncing}
                                                    className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                                                        book.availableCopies > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                    }`}
                                                >
                                                    Issue
                                                </button>
                                            </div>
                                        )) : (
                                            <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase">Resource not found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Member's Active Loans */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Outstanding Record</h4>
                                <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-indigo-600 shadow-sm">{activeLoansForMember.length} Active Loans</span>
                            </div>
                            
                            {activeLoansForMember.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {activeLoansForMember.map(loan => (
                                        <div key={loan.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className={`p-4 rounded-2xl ${loan.status === 'Overdue' || loan.fineAmount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-slate-800">{loan.bookTitle}</h5>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due: {loan.dueDate}</span>
                                                        {loan.fineAmount > 0 && (
                                                            <span className="px-2 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded uppercase animate-pulse">Penalty: ₦{loan.fineAmount.toLocaleString()}</span>
                                                        )}
                                                        {loan.isFineWaived && (
                                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-100">Waived</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {loan.fineAmount > 0 && (
                                                    <button 
                                                        onClick={() => onWaive(loan)}
                                                        className="px-4 py-2.5 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all"
                                                    >
                                                        Waive
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => onReturn(loan.id)}
                                                    disabled={isSyncing}
                                                    className="px-6 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    {isSyncing && <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>}
                                                    Check-In
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No Active Loans</p>
                                    <p className="text-slate-300 text-[10px] font-bold mt-1 uppercase">Member is currently clear of all assets</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-100/50 p-20 rounded-[60px] border-4 border-dashed border-white flex flex-col items-center justify-center text-center">
                    <div className="p-6 bg-white rounded-[32px] shadow-sm mb-6 animate-bounce">
                        <svg className="w-12 h-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h16" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.2em]">Scanner Standby</h3>
                    <p className="text-slate-300 max-w-sm mt-2 text-sm font-medium">Position the member issue card near the scanner or manually enter the matriculation number above.</p>
                </div>
            )}
        </div>
    );
};

export default CirculationTerminal;
