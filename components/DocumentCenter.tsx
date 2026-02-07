
import React, { useState, useRef } from 'react';
import { Student, StudentDocument } from '../types';

declare const html2canvas: any;
declare const jspdf: any;

interface DocumentCenterProps {
    student: Student;
    setStudent: React.Dispatch<React.SetStateAction<Student>>;
}

const DocumentUploadCenter: React.FC<DocumentCenterProps> = ({ student, setStudent }) => {
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeUploadType, setActiveUploadType] = useState<StudentDocument['type'] | null>(null);

    // MOCK: Simulate File Upload to Cloud Bucket
    const mockUploadToCloud = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            // Simulate Network Latency
            setTimeout(() => {
                resolve(`https://mock-bucket.polystudent.edu.ng/${student.id}/${Date.now()}-${file.name}`);
            }, 1500);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeUploadType) return;

        setValidationError(null);

        // VALIDATION LOGIC
        // 1. Size Validation (< 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setValidationError(`File "${file.name}" is too large. Maximum size allowed is 2MB.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // 2. Type Validation (PDF, JPG, PNG)
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setValidationError(`Unsupported file type for "${file.name}". Please upload PDF, JPG, or PNG files only.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploading(activeUploadType);
        try {
            const cloudUrl = await mockUploadToCloud(file);
            
            const newDoc: StudentDocument = {
                id: `DOC-${Date.now()}`,
                name: file.name,
                type: activeUploadType,
                fileType: file.type,
                fileSize: file.size,
                uploadDate: new Date().toISOString().split('T')[0],
                status: 'Pending Verification',
                url: cloudUrl
            };

            setStudent(prev => ({
                ...prev,
                documents: [
                    ...prev.documents.filter(d => d.type !== activeUploadType), // Replace existing slot if any
                    newDoc
                ]
            }));
            
            setActiveUploadType(null);
        } catch (error: any) {
            setValidationError("A system error occurred during upload. Please try again.");
        } finally {
            setIsUploading(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handlePayApplicationFee = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setStudent(prev => ({ ...prev, applicationFeePaid: true }));
            setIsProcessingPayment(false);
        }, 1500);
    };

    const triggerUpload = (type: StudentDocument['type']) => {
        setValidationError(null);
        setActiveUploadType(type);
        fileInputRef.current?.click();
    };

    const generatePdf = async (elementId: string, filename: string) => {
        const input = document.getElementById(elementId);
        if (!input) return;

        input.style.display = 'block'; 
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        input.style.display = 'none'; 

        const { jsPDF } = jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const ratio = canvas.width / canvas.height;
        const pdfWidth = pageWidth - 20;
        const pdfHeight = pdfWidth / ratio;
        
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
        pdf.save(filename);
    };

    const uploadSlots: StudentDocument['type'][] = [
        'JAMB Result', 'O-Level Result', 'Birth Certificate', 'NIN'
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Verified': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Pending Verification': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Student Document Hub</h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold text-[10px]">NBTE Compliant Record Management</p>
                </div>
                {!student.applicationFeePaid && (
                    <button 
                        onClick={handlePayApplicationFee}
                        disabled={isProcessingPayment}
                        className="btn-primary px-8 py-3 text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isProcessingPayment && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                        Pay Application Fee to Unlock
                    </button>
                )}
            </div>

            {/* Validation Feedback */}
            {validationError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <p className="text-xs font-bold text-rose-800 uppercase leading-relaxed flex-1">
                        {validationError}
                    </p>
                    <button onClick={() => setValidationError(null)} className="text-rose-400 hover:text-rose-600 p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            )}

            {/* Main Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {uploadSlots.map(type => {
                    const doc = student.documents.find(d => d.type === type);
                    const status = doc ? doc.status : 'Not Uploaded';
                    const isTypeUploading = isUploading === type;

                    return (
                        <div key={type} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center group hover:border-navy-primary transition-all">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${doc ? 'bg-blue-50 text-navy-primary' : 'bg-slate-50 text-slate-300'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">{type}</h4>
                            <span className={`mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(status)}`}>
                                {status}
                            </span>

                            <div className="mt-6 w-full space-y-2">
                                <button 
                                    onClick={() => triggerUpload(type)}
                                    disabled={!student.applicationFeePaid || isTypeUploading}
                                    className={`w-full py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${
                                        !student.applicationFeePaid 
                                        ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                                        : doc 
                                            ? 'btn-secondary'
                                            : 'btn-primary'
                                    }`}
                                >
                                    {isTypeUploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Uploading
                                        </span>
                                    ) : doc ? 'Replace File' : 'Upload Slot'}
                                </button>
                                {doc && (
                                    <button className="w-full py-2 text-[10px] font-black uppercase text-navy-primary hover:underline">
                                        View Attachment
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Letter Generation Block */}
            <div className="bg-navy-primary rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Official Credentials Center</h3>
                        <p className="text-blue-100 text-sm mt-2 leading-relaxed font-medium">Download institutional letters and biodata forms once verified.</p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <button 
                                onClick={() => generatePdf('admission-letter-template', `Admission_Letter_${student.id}.pdf`)}
                                disabled={student.status !== 'Admitted'}
                                className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-30 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Admission Letter
                            </button>
                            <button 
                                onClick={() => generatePdf('acceptance-letter-template', `Acceptance_Form_${student.id}.pdf`)}
                                disabled={student.status !== 'Admitted'}
                                className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-30 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Acceptance Form
                            </button>
                            <button 
                                onClick={() => generatePdf('biodata-template', `BioData_Form_${student.id}.pdf`)}
                                className="px-6 py-3 bg-accent-orange border border-accent-orange/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-orange-hover shadow-xl transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Print Bio-Data
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:flex justify-center">
                        <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <svg className="w-16 h-16 text-blue-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* HIDDEN PRINT TEMPLATES (Kept for generation logic) */}
            <div className="hidden">
                <div id="admission-letter-template" className="p-16 bg-white w-[800px] font-serif text-slate-900 border-[16px] border-double border-slate-200">
                    <div className="text-center border-b-2 border-slate-900 pb-8 mb-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black">PN</div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Polytechnic of Nigeria</h1>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Office of the Registrar (Admissions)</p>
                    </div>
                    <div className="mb-8">
                        <p className="text-sm font-bold">{student.name.toUpperCase()}</p>
                        <p className="text-xs mt-4">Dear Candidate,</p>
                    </div>
                    <h2 className="text-lg font-black text-center underline mb-8">OFFER OF PROVISIONAL ADMISSION</h2>
                    <p className="text-sm leading-relaxed text-justify">I am directed to inform you that you have been offered provisional admission into the <span className="font-black">{student.department}</span> department of this institution for the <span className="font-black">{student.session}</span> academic session.</p>
                </div>

                <div id="biodata-template" className="p-16 bg-white w-[800px] font-sans text-slate-900 border-2 border-slate-100">
                    <div className="flex justify-between items-center border-b-2 border-slate-900 pb-6 mb-8">
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">Student Bio-Data Form</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{student.session} Academic Session</p>
                        </div>
                        <img src={student.avatarUrl} className="w-24 h-24 rounded-xl border-2 border-slate-900 object-cover" alt="" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="col-span-2 bg-slate-50 px-4 py-2 font-black text-xs uppercase tracking-widest border-l-4 border-slate-900">Personal Information</div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-400">Full Name</p>
                            <p className="text-sm font-bold">{student.name}</p>
                        </div>
                    </div>
                </div>

                <div id="acceptance-letter-template" className="p-16 bg-white w-[800px] font-sans text-slate-900">
                    <div className="text-center mb-12">
                        <h1 className="text-2xl font-black uppercase border-b-4 border-slate-900 inline-block pb-1">Letter of Acceptance</h1>
                    </div>
                    <p className="text-sm mb-8 font-bold">ACCEPTANCE OF PROVISIONAL ADMISSION FOR {student.session} SESSION</p>
                    <p className="text-sm">I, <span className="font-black underline px-2">{student.name.toUpperCase()}</span> with application number <span className="font-black underline px-2">{student.applicationNumber}</span>, hereby accept the offer of provisional admission.</p>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadCenter;
