
import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';

interface ProfileProps {
    student: Student;
    setStudent: React.Dispatch<React.SetStateAction<Student>>;
}

const Profile: React.FC<ProfileProps> = ({ student, setStudent }) => {
    const [localStudentData, setLocalStudentData] = useState<Student>(student);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalStudentData(student);
    }, [student]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalStudentData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setStudent(prev => ({ ...prev, avatarUrl: base64String }));
                setLocalStudentData(prev => ({ ...prev, avatarUrl: base64String }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        setStudent(localStudentData);
        setIsEditing(false);
    };

    const ProfileField = ({ label, value, name, isEditing, type = 'text' }: { label: string, value: string, name: string, isEditing: boolean, type?: string }) => (
        <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 last:border-0">
            <dt className="text-sm font-medium text-slate-500">
                <label htmlFor={name}>{label}</label>
            </dt>
            <dd className="mt-1 text-sm text-slate-900 col-span-2 sm:mt-0">
                {isEditing && (name === 'email' || name === 'phone' || name === 'address') ? (
                    <input
                        type={type}
                        name={name}
                        id={name}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 text-sm transition-all outline-none"
                    />
                ) : (
                    <span className="font-medium">{value}</span>
                )}
            </dd>
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-md animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Student Profile</h2>
                    <p className="text-slate-500 text-sm">Update your digital identity and contact preferences.</p>
                </div>
                {isEditing ? (
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button 
                            onClick={() => { setIsEditing(false); setLocalStudentData(student); }} 
                            className="btn-secondary flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave} 
                            className="btn-primary flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="btn-secondary w-full sm:w-auto px-6 py-2.5 text-xs font-black uppercase tracking-widest shadow-sm"
                    >
                        Edit Information
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                        <div className="h-44 w-44 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-100 relative ring-1 ring-slate-100">
                            <img 
                                className={`h-full w-full object-cover transition-all duration-700 ${isUploading ? 'opacity-30 blur-md scale-95' : 'group-hover:scale-110'}`} 
                                src={localStudentData.avatarUrl} 
                                alt={`${localStudentData.name}'s profile`} 
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-navy-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <span className="text-[10px] font-black uppercase text-navy-primary">Syncing...</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-navy-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-3 bg-white text-navy-primary rounded-2xl shadow-xl border border-slate-100 group-hover:bg-navy-primary group-hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*" 
                        />
                    </div>
                    <button 
                        onClick={triggerFileInput}
                        className="btn-secondary px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm"
                    >
                        Upload New Photo
                    </button>
                </div>

                <div className="flex-1 w-full space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Academic Identity</h3>
                        <dl className="space-y-1">
                            <ProfileField label="Full Name" value={localStudentData.name} name="name" isEditing={false} />
                            <ProfileField label="Matriculation No." value={localStudentData.matricNumber || 'Pending'} name="matricNumber" isEditing={false} />
                            <ProfileField label="Primary Department" value={localStudentData.department} name="department" isEditing={false} />
                            <ProfileField label="Academic Level" value={localStudentData.level} name="level" isEditing={false} />
                        </dl>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-navy-primary uppercase tracking-widest mb-4">Communication Details</h3>
                        <dl className="space-y-1">
                            <ProfileField label="Email Address" value={localStudentData.email} name="email" isEditing={isEditing} type="email" />
                            <ProfileField label="Phone Number" value={localStudentData.phone} name="phone" isEditing={isEditing} type="tel" />
                            <ProfileField label="Residential Address" value={localStudentData.address} name="address" isEditing={isEditing} />
                        </dl>
                    </div>
                </div>
            </div>

            {isEditing && (
                 <div className="mt-8 p-5 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl text-sm flex items-start animate-in slide-in-from-top-2 shadow-sm">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 mr-4 mt-0.5 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold">Administrative Protocol Notice</p>
                        <p className="opacity-80 leading-relaxed mt-1 text-xs">Self-service updates are limited to contact and visual identifiers. For corrections to legal names, departments, or levels, please submit a formal application to the Registrar's office.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
