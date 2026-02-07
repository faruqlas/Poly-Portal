
import React, { useState, useMemo } from 'react';
import { Course, Student, Result } from '../types';

interface CourseRegistrationProps {
    student: Student;
    setStudent: React.Dispatch<React.SetStateAction<Student | null>>;
    courses: Course[];
    allResults: Result[];
    onRegister: (studentId: string, isRegistered: boolean) => void;
}

const CourseRegistration: React.FC<CourseRegistrationProps> = ({ student, setStudent, courses, allResults, onRegister }) => {
    const carryOverCodes = useMemo(() => {
        const failedMap = new Map<string, Result>();
        const passedSet = new Set<string>();

        allResults.forEach(r => {
            if (r.grade === 'F') {
                failedMap.set(r.courseCode, r);
            } else {
                passedSet.add(r.courseCode);
            }
        });
        
        return Array.from(failedMap.keys()).filter(code => !passedSet.has(code));
    }, [allResults]);

    const isCarryOver = (code: string) => carryOverCodes.includes(code);

    const sortedCourses = useMemo(() => {
        return [...courses].sort((a, b) => {
            const aCO = isCarryOver(a.code);
            const bCO = isCarryOver(b.code);
            if (aCO && !bCO) return -1;
            if (!aCO && bCO) return 1;
            
            if (a.type === 'Compulsory' && b.type === 'Elective') return -1;
            if (a.type === 'Elective' && b.type === 'Compulsory') return 1;
            
            return a.code.localeCompare(b.code);
        });
    }, [courses, carryOverCodes]);

    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(student.isRegistered);

    const handleCourseToggle = (courseCode: string) => {
        if (submitted) return;
        const course = courses.find(c => c.code === courseCode);
        if (isCarryOver(courseCode) || course?.type === 'Compulsory') return;

        setSelectedCourses(prev => {
            if (prev.includes(courseCode)) return prev.filter(c => c !== courseCode);
            return [...prev, courseCode];
        });
    };

    const registeredCourses = useMemo(() => {
        return courses.filter(course => 
            course.type === 'Compulsory' || 
            isCarryOver(course.code) || 
            selectedCourses.includes(course.code)
        );
    }, [courses, selectedCourses, carryOverCodes]);

    const totalUnits = useMemo(() => {
        return registeredCourses.reduce((sum, course) => sum + course.units, 0);
    }, [registeredCourses]);

    const carryOverUnits = useMemo(() => {
        return registeredCourses.filter(c => isCarryOver(c.code)).reduce((sum, c) => sum + c.units, 0);
    }, [registeredCourses]);

    const handleSubmit = () => {
        if (totalUnits > 24) return;
        setSubmitted(true);
        onRegister(student.id, true);
    };

    const TypeBadge = ({ type, isCO }: { type: string, isCO: boolean }) => {
        if (isCO) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                    Carry-Over
                </span>
            );
        }
        if (type === 'Compulsory') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-navy-primary text-white">
                    Compulsory
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-brand-slate-100 text-brand-slate-500">
                Elective
            </span>
        );
    };

    return (
        <div className="space-y-8 relative">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-brand-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-brand-slate-900 tracking-tight">Academic Registration</h2>
                    <p className="mt-2 text-brand-slate-500 text-sm font-medium">{student.session} • {student.semester} Session</p>
                </div>
                {!submitted && (
                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black ${totalUnits > 24 ? 'text-rose-600' : 'text-navy-primary'}`}>{totalUnits}</span>
                            <span className="text-brand-slate-400 font-bold uppercase text-[10px] tracking-widest">/ 24 Units Allowed</span>
                        </div>
                        {carryOverUnits > 0 && (
                            <p className="text-[10px] font-black text-amber-500 uppercase mt-1">Includes {carryOverUnits} units of Carry-Over</p>
                        )}
                    </div>
                )}
            </div>

            {carryOverCodes.length > 0 && !submitted && (
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest">Mandatory Carry-Over Inclusion</h4>
                        <p className="text-amber-800/80 text-sm mt-1 leading-relaxed">
                            Our records indicate <span className="font-black underline">{carryOverCodes.length}</span> course(s) from previous levels with a grade of 'F'. These have been automatically prioritized and locked in your current load per NBTE academic policies.
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-brand-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-slate-50 text-left">
                        <thead className="bg-brand-slate-50/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-brand-slate-400 uppercase tracking-widest w-20 text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-brand-slate-400 uppercase tracking-widest">Code & Title</th>
                                <th className="px-8 py-6 text-[10px] font-black text-brand-slate-400 uppercase tracking-widest text-center">Units</th>
                                <th className="px-8 py-6 text-[10px] font-black text-brand-slate-400 uppercase tracking-widest text-right">Category</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-slate-50">
                            {sortedCourses.map((course) => {
                                const isCO = isCarryOver(course.code);
                                const isMandatory = isCO || course.type === 'Compulsory';
                                const isSelected = registeredCourses.some(c => c.code === course.code);
                                
                                return (
                                    <tr 
                                        key={course.code} 
                                        className={`transition-all group ${
                                            isCO ? 'bg-amber-50/40' : isSelected ? 'bg-blue-50/30' : 'hover:bg-brand-slate-50/50'
                                        }`}
                                    >
                                        <td className="px-8 py-6 text-center">
                                            <button 
                                                onClick={() => handleCourseToggle(course.code)}
                                                disabled={isMandatory || submitted}
                                                className={`h-6 w-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                                                    isCO ? 'border-amber-500 bg-amber-500 text-white shadow-md' :
                                                    isSelected ? 'border-navy-primary bg-navy-primary text-white' : 
                                                    'border-brand-slate-200 bg-white group-hover:border-navy-primary'
                                                } ${isMandatory ? 'cursor-not-allowed opacity-80' : ''}`}
                                            >
                                                {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-black font-mono tracking-tighter ${isCO ? 'text-amber-600' : 'text-brand-slate-400'}`}>{course.code}</span>
                                                <span className="text-sm font-bold text-brand-slate-800">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-black text-brand-slate-700">{course.units}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <TypeBadge type={course.type} isCO={isCO} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {!submitted && (
                <div className="flex justify-end pt-4">
                    <button 
                        onClick={handleSubmit} 
                        disabled={totalUnits > 24}
                        className="btn-primary px-12 py-5 text-xs font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                        {totalUnits > 24 ? 'Unit Limit Exceeded' : 'Authorize Registration'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseRegistration;
