
import React, { useState } from 'react';
import { Student, RRRTransaction, Transaction } from '../types';
import { supabase } from '../supabaseClient';

interface PaymentsProps {
  student: Student;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const feeCategories = [
  { id: 'tuition', label: 'Tuition Fee', amount: 85000 },
  { id: 'acceptance', label: 'Acceptance Fee', amount: 15000 },
  { id: 'hostel', label: 'Hostel Fee', amount: 30000 },
  { id: 'sug', label: 'SUG Levy', amount: 2000 },
  { id: 'dept', label: 'Departmental Levy', amount: 3000 },
  { id: 'transcript', label: 'Transcript Fee', amount: 5000 },
  { id: 'library', label: 'Library Due', amount: 1000 },
];

const Payments: React.FC<PaymentsProps> = ({ student, transactions, setTransactions }) => {
  const [activeTab, setActiveTab] = useState<'pay' | 'history'>('pay');
  const [selectedFee, setSelectedFee] = useState(feeCategories[0]);
  const [currentRRR, setCurrentRRR] = useState<Transaction | null>(null);
  const [step, setStep] = useState<'select' | 'invoice'>('select');
  const [isSyncing, setIsSyncing] = useState(false);

  const generateRRR = async () => {
    setIsSyncing(true);
    const rrr = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newTransaction = {
      studentId: student.id,
      amount: selectedFee.amount,
      category: selectedFee.label,
      reference: rrr,
      status: 'Generated',
      paymentChannel: 'Card',
    };

    const { data, error } = await supabase.from('transactions').insert(newTransaction).select().single();

    if (data && !error) {
        setCurrentRRR(data);
        setTransactions([data, ...transactions]);
        setStep('invoice');
    } else {
        alert('Failed to generate RRR. Please try again.');
    }
    setIsSyncing(false);
  };

  const handleVerify = async (rrrCode: string) => {
    setIsSyncing(true);
    const { data, error } = await supabase
        .from('transactions')
        .update({ status: 'Verified', paymentChannel: 'Card' })
        .eq('reference', rrrCode)
        .select()
        .single();
    
    if (data && !error) {
        setTransactions(prev => prev.map(t => t.reference === rrrCode ? data : t));
        if (currentRRR?.reference === rrrCode) {
            setCurrentRRR(data);
        }
        alert('Payment Verified Successfully! Your record has been updated.');
    } else {
        alert('Verification failed.');
    }
    setIsSyncing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Payments & Bursary</h2>
          <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">Nigerian e-Payment Gateway Integrated (Remita)</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('pay')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pay' ? 'bg-white text-navy-primary shadow-sm' : 'text-slate-400'}`}
          >
            Generate RRR
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-navy-primary shadow-sm' : 'text-slate-400'}`}
          >
            Payment History
          </button>
        </div>
      </div>

      {activeTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fee Selection */}
          <div className={`lg:col-span-1 space-y-6 print:hidden transition-all ${step === 'invoice' ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Select Fee Category</h3>
              <div className="space-y-2">
                {feeCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFee(cat)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      selectedFee.id === cat.id ? 'border-navy-primary bg-blue-50 ring-4 ring-blue-50' : 'border-slate-50 hover:border-slate-100 bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                    <span className="text-xs font-black text-slate-400">₦{cat.amount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={generateRRR}
                disabled={isSyncing}
                className="btn-accent w-full mt-8 py-5 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSyncing && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                {isSyncing ? 'Requesting Gateway...' : 'Generate RRR Code'}
              </button>
            </div>
            
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[10px] font-bold text-amber-800 uppercase leading-relaxed">
                Remita Retrieval Reference (RRR) is mandatory for all institutional payments. Ensure you generate a code before visiting any bank branch.
              </p>
            </div>
          </div>

          {/* Invoice Display */}
          <div className="lg:col-span-2">
            {step === 'invoice' && currentRRR ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div id="printable-area" className="bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl overflow-hidden relative print:border-0 print:shadow-none">
                  {/* Remita Style Header */}
                  <div className="bg-gradient-to-r from-red-600 to-blue-800 p-8 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-600 font-black text-xl italic shadow-lg">R</div>
                      <div>
                        <h1 className="text-xl font-black uppercase leading-tight tracking-tighter">Remita Payment Invoice</h1>
                        <p className="text-[10px] font-bold opacity-75 uppercase tracking-widest">Polytechnic Retrieval Service</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        currentRRR.status === 'Verified' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-900'
                      }`}>
                        {currentRRR.status === 'Verified' ? 'Payment Confirmed' : 'RRR Generated'}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 space-y-12">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remitter Details</p>
                          <p className="text-lg font-black text-slate-800 uppercase">{student.name}</p>
                          <p className="text-xs font-mono font-bold text-slate-500">{student.id} • {student.department}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Description</p>
                          <p className="text-sm font-bold text-slate-600">{currentRRR.category} - {student.session} Session</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount Due</p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">₦{currentRRR.amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 flex flex-col items-center text-center space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Remita Retrieval Reference (RRR)</p>
                      <p className="text-4xl font-mono font-black text-navy-primary tracking-widest bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-100">
                        {currentRRR.reference}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 max-w-sm leading-relaxed uppercase">
                        Present this RRR code at any commercial bank in Nigeria or use the "Pay Now" button to use your debit card.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Valid Until</p>
                        <p className="text-xs font-bold text-slate-700">7 Days from Generation ({new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated On</p>
                        <p className="text-xs font-bold text-slate-700">{new Date(currentRRR.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 print:hidden">
                  <button 
                    onClick={() => setStep('select')}
                    className="btn-secondary flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
                  >
                    Generate Another
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="btn-primary flex-1 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V5a2 2 0 012-2h2a2 2 0 012 2v3m-6 0h6" /></svg>
                    Print Invoice
                  </button>
                  {currentRRR.status === 'Generated' && (
                    <button 
                      onClick={() => handleVerify(currentRRR.reference)}
                      disabled={isSyncing}
                      className="btn-accent flex-[1.5] py-4 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                    >
                      {isSyncing && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                      Pay with Remita Portal
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-20 rounded-[60px] border-4 border-dashed border-white flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-white rounded-[32px] shadow-sm mb-6 text-navy-primary/20">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.2em]">Billing Gateway Ready</h3>
                <p className="text-slate-300 max-w-sm mt-2 text-sm font-medium">Select a fee category and generate a Retrieval Reference code to begin payment processing.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Remita Transaction Log</h4>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Authenticated History</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference (RRR)</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Description</th>
                  <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(txn => (
                  <tr key={txn.reference} className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-6 font-mono text-xs font-black text-slate-800">{txn.reference}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800">{txn.category}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{new Date(txn.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black font-mono text-slate-700">₦{txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                        txn.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        txn.status === 'Generated' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {txn.status === 'Generated' ? (
                        <button 
                          onClick={() => { setCurrentRRR(txn); setActiveTab('pay'); setStep('invoice'); }}
                          className="text-navy-primary text-[10px] font-black uppercase hover:underline"
                        >
                          Complete Payment
                        </button>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-emerald-600 uppercase">Verified via {txn.paymentChannel}</span>
                          <button className="text-slate-400 text-[8px] font-black uppercase hover:underline mt-1">Download Receipt</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
