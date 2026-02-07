import React, { useState } from 'react';
import { Student } from '../types';

interface LetterPrintingProps {
    student: Student;
}

const LetterPrinting: React.FC<LetterPrintingProps> = ({ student }) => {
    const [activeTemplate, setActiveTemplate] = useState<'biodata' | 'admission' | 'acceptance' | null>(null);

    const handlePrint = (template: 'biodata' | 'admission' | 'acceptance') => {
        setActiveTemplate(template);
        // Wait for state to update and DOM to render before printing
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const TemplateCard = ({ 
        title, 
        description, 
        icon, 
        status, 
        onClick, 
        disabled = false 
    }: { 
        title: string, 
        description: string, 
        icon: React.ReactNode, 
        status: string, 
        onClick: () => void,
        disabled?: boolean
    }) => (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm text-left flex flex-col group transition-all relative overflow-hidden ${
                disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-brand-blue-400 hover:shadow-xl hover:-translate-y-1'
            }`}
        >
            <div className={`p-4 rounded-3xl mb-6 self-start transition-colors ${
                disabled ? 'bg-slate-100 text-slate-400' : 'bg-brand-blue-50 text-brand-blue-600 group-hover:bg-brand-blue-600 group-hover:text-white'
            }`}>
                {icon}
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">{title}</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{description}</p>
            
            <div className="mt-auto flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    disabled ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                    {status}
                </span>
                {!disabled && (
                    <div className="text-brand-blue-600 font-black text-xs uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">
                        Print Now
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                )}
            </div>
            {disabled && (
                <div className="absolute top-4 right-4">
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
            )}
        </button>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Institutional Print Center</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">Generate and print official institutional documents and legal credentials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TemplateCard 
                    title="Student Bio-Data Form"
                    description="Official demographic record showing personal, academic and contact identifiers."
                    status="Verified"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    onClick={() => handlePrint('biodata')}
                />

                <TemplateCard 
                    title="Admission Letter"
                    description="Formal offer of provisional admission from the Office of the Registrar."
                    status={student.status === 'Admitted' ? 'Authorized' : 'Processing'}
                    disabled={student.status !== 'Admitted'}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    onClick={() => handlePrint('admission')}
                />

                <TemplateCard 
                    title="Acceptance Letter"
                    description="Binding contract of acceptance submitted to the Academic Affairs Unit."
                    // Fix: Corrected property name from is_registered to isRegistered.
                    status={student.isRegistered ? 'Unlocked' : 'Locked'}
                    disabled={!student.isRegistered}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    onClick={() => handlePrint('acceptance')}
                />
            </div>

            {/* PRINTABLE TEMPLATES (HIDDEN FROM UI, VISIBLE DURING PRINT) */}
            <div id="printable-area" className="hidden print:block">
                {activeTemplate === 'biodata' && (
                    <div className="font-sans text-slate-900 p-8 border-2 border-slate-200 rounded-3xl min-h-[1050px]">
                        <div className="text-center border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-center">
                            <div className="text-left">
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Polytechnic of Nigeria</h1>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Student Bio-Data Form</p>
                            </div>
                            <img src={student.avatarUrl} className="w-24 h-24 rounded-2xl border-4 border-slate-100 object-cover" alt="Student Photo" />
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase border-b pb-1">Personal Details</h3>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Full Name</p><p className="font-bold">{student.name}</p></div>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Email Address</p><p className="font-bold">{student.email}</p></div>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Phone Number</p><p className="font-bold">{student.phone}</p></div>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Residential Address</p><p className="text-sm font-medium leading-relaxed">{student.address}</p></div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase border-b pb-1">Academic Status</h3>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Application Number</p><p className="font-bold font-mono text-brand-blue-700">{student.applicationNumber || 'N/A'}</p></div>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Matriculation Number</p><p className="font-bold font-mono">{student.matricNumber || 'NOT YET ASSIGNED'}</p></div>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Department</p><p className="font-bold">{student.department}</p></div>
                                <div><p className="text-[9px] font-black uppercase text-slate-500">Academic Standing</p><p className="font-bold">{student.level} • {student.session}</p></div>
                            </div>
                        </div>

                        <div className="mt-auto pt-12 border-t border-dashed border-slate-200">
                            <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest italic">Generated via Student Portal • Digital Record # {Math.random().toString(36).substr(2, 10).toUpperCase()}</p>
                            <div className="mt-12 flex justify-between px-12">
                                <div className="text-center w-48"><div className="h-0.5 w-full bg-slate-300 mb-2"></div><p className="text-[9px] font-black uppercase">Student Signature</p></div>
                                <div className="text-center w-48"><div className="h-0.5 w-full bg-slate-300 mb-2"></div><p className="text-[9px] font-black uppercase">Date</p></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTemplate === 'admission' && (
                    <div className="font-serif text-slate-900 p-16 border-[16px] border-double border-slate-200 bg-white min-h-[1050px]">
                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black">PN</div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Polytechnic of Nigeria</h1>
                            <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mt-2">Office of the Registrar (Admissions)</p>
                            <div className="h-0.5 w-40 bg-slate-900 mx-auto mt-6"></div>
                        </div>

                        <div className="flex justify-between items-start mb-12">
                            <div className="text-xs font-bold uppercase">
                                <p>Date: {new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}</p>
                                <p className="mt-1">Ref: PN/ADM/{new Date().getFullYear()}/{student.id.substr(-4)}</p>
                            </div>
                        </div>

                        <div className="mb-10 text-sm leading-relaxed">
                            <p className="font-bold mb-1">{student.name.toUpperCase()}</p>
                            <p>{student.email}</p>
                            <p className="mt-6">Dear Candidate,</p>
                        </div>

                        <h2 className="text-lg font-black text-center underline mb-10 tracking-wide">OFFER OF PROVISIONAL ADMISSION</h2>

                        <div className="space-y-6 text-sm text-justify leading-loose">
                            <p>I am directed to inform you that you have been offered provisional admission into the <span className="font-bold underline">{student.department}</span> department of this institution for the <span className="font-bold underline">{student.session}</span> academic session leading to the award of National Diploma (ND).</p>
                            
                            <p>This offer is strictly provisional and subject to the following standard institutional conditions:</p>
                            <ul className="list-disc pl-10 space-y-4">
                                <li>The original O'Level certificate(s) presented for screening must be verified by the relevant examining body (WAEC/NECO).</li>
                                <li>Full payment of the prescribed non-refundable acceptance fees within fourteen (14) days of this notice.</li>
                                <li>Production of a certificate of medical fitness from a recognized government hospital.</li>
                            </ul>

                            <p>You are requested to report to the Admissions Unit for physical credential screening immediately. Please bring this letter and all your original credentials along with you.</p>

                            <p>We extend our hearty congratulations on this academic achievement.</p>
                        </div>

                        <div className="mt-20 flex justify-between items-end">
                            <div className="text-center space-y-2">
                                <img src="https://signature.freefire-id.com/img/signature.png" className="h-14 mx-auto opacity-70 grayscale" alt="Registrar Signature" />
                                <div className="h-px w-48 bg-slate-400 mx-auto"></div>
                                <p className="text-[10px] font-black uppercase">Registrar</p>
                            </div>
                            <div className="w-24 h-24 border-2 border-slate-300 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-2 border-2 border-dashed border-slate-200 rounded-full"></div>
                                <p className="text-[8px] font-black uppercase text-slate-300 text-center px-2">Institutional Seal of Authority</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTemplate === 'acceptance' && (
                    <div className="font-sans text-slate-900 p-16 bg-white border border-slate-100 min-h-[1050px]">
                        <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-12">
                            Academic Affairs Unit • Ref: PN/ACC/001
                        </div>

                        <div className="mb-16">
                            <p className="text-sm font-bold">The Registrar,</p>
                            <p className="text-sm font-bold">Polytechnic of Nigeria,</p>
                            <p className="text-sm font-bold">Academic Affairs Unit.</p>
                        </div>

                        <h2 className="text-xl font-black text-center mb-16 uppercase border-b-2 border-slate-900 pb-2">Letter of Acceptance</h2>

                        <div className="space-y-8 text-base leading-relaxed">
                            <p>I, <span className="font-black underline px-2">{student.name.toUpperCase()}</span> with application number <span className="font-black underline px-2">{student.applicationNumber}</span>, having been offered provisional admission for the <span className="font-black">{student.session}</span> academic session, hereby formally <span className="font-black">ACCEPT</span> the offer.</p>
                            
                            <p>I declare that the information provided in my application is true and correct. I understand that any false declaration will lead to immediate disqualification or expulsion from the institution.</p>
                            
                            <p>I undertake to be a law-abiding student of the Polytechnic and to strictly adhere to the matriculation oath and all institutional codes of conduct.</p>
                        </div>

                        <div className="mt-32 flex justify-between items-end">
                            <div className="space-y-8">
                                <div className="h-px w-64 bg-slate-900"></div>
                                <p className="text-xs font-black uppercase">Signature of Candidate</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                                <p className="text-[10px] font-black uppercase text-slate-400">Date of Submission</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-20 flex gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase mb-4">Official Use Only</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span className="text-[9px] font-bold uppercase">Payment Verified</span><div className="w-3 h-3 bg-slate-300 rounded"></div></div>
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span className="text-[9px] font-bold uppercase">Medicals Cleared</span><div className="w-3 h-3 bg-slate-300 rounded"></div></div>
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span className="text-[9px] font-bold uppercase">HOD Authorization</span><div className="w-3 h-3 bg-slate-300 rounded"></div></div>
                                </div>
                            </div>
                            <div className="w-40 flex items-center justify-center border-4 border-double border-slate-100 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-200 uppercase text-center rotate-45 scale-150">Institutional Stamp</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LetterPrinting;