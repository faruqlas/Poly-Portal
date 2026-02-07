import React, { useState } from 'react';
import { Student } from '../types';

interface ApplicationFormProps {
    onComplete: (student: Student) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        applicationType: 'ND Full-Time',
        surname: '',
        firstName: '',
        middleName: '',
        email: '',
        phone: '',
        department: 'Computer Science', 
        termsAccepted: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert('Please accept the terms of use.');
            return;
        }

        const year = new Date().getFullYear();
        const random = Math.floor(10000 + Math.random() * 90000);
        const appNo = `APP-${year}-${random}`;

        const newProspect: Student = {
            id: appNo,
            createdAt: new Date().toISOString(),
            name: `${formData.firstName} ${formData.middleName} ${formData.surname}`.replace(/\s+/g, ' ').trim(),
            applicationNumber: appNo,
            department: formData.department,
            level: formData.applicationType.startsWith('ND') ? 'ND I' : 'HND I',
            email: formData.email,
            phone: formData.phone,
            address: 'Not yet provided',
            avatarUrl: 'https://picsum.photos/seed/prospect/200',
            session: `${year}/${year + 1}`,
            semester: 'First Semester',
            status: 'Prospect',
            permissionLevel: 1,
            applicationFeePaid: false,
            // Fix: Corrected property name from is_registered to isRegistered to match the Student type.
            isRegistered: false,
            documents: []
        };

        onComplete(newProspect);
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100">
                <div className="bg-navy-primary p-10 text-white relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black tracking-tight">Student Admission Portal</h2>
                        <p className="mt-2 text-brand-primary-300 font-bold uppercase text-[10px] tracking-[0.2em]">Application Entry Phase</p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Application Type</label>
                            <select 
                                name="applicationType"
                                value={formData.applicationType}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                                required
                            >
                                <option>ND Full-Time</option>
                                <option>ND Part-Time</option>
                                <option>HND Full-Time</option>
                                <option>HND Part-Time</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Surname</label>
                            <input 
                                type="text" 
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                                placeholder="e.g. Adebayo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                                placeholder="e.g. Chukwuemeka"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Middle Name (Optional)</label>
                            <input 
                                type="text" 
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                                placeholder="e.g. Oluwasegun"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Department</label>
                            <select 
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                            >
                                <option>Computer Science</option>
                                <option>Electrical Engineering</option>
                                <option>Mechanical Engineering</option>
                                <option>Civil Engineering</option>
                                <option>Accountancy</option>
                                <option>Business Administration</option>
                                <option>Mass Communication</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full py-3.5 px-6 text-sm font-bold transition-all outline-none"
                                placeholder="+234..."
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            </div>
                            <p className="text-xs font-bold text-amber-800 uppercase leading-relaxed">
                                <span className="block mb-1">Administrative Disclaimer:</span>
                                You will <span className="underline">NOT</span> be able to update your name or application type after submitting this form. Ensure all details match your O'Level and JAMB records.
                            </p>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-amber-300 text-navy-primary focus:ring-navy-primary"
                                required
                            />
                            <span className="text-[10px] font-black text-amber-900 uppercase tracking-tight group-hover:underline">I have reviewed my details and accept the terms of use.</span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="btn-primary w-full py-5 text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98]"
                        >
                            Complete Application & Generate Number
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;