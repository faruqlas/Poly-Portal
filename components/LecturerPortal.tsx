import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_LECTURER, MOCK_LECTURER_COURSES, MOCK_MATERIALS, DEPARTMENTS } from '../constants';
// Fix: Import 'Course' and 'Result' types.
import { LecturerCourse, StudentScore, Book, Lecturer, CourseMaterial, Student, Course, Result } from '../types';
import Library from './Library';

type SubView = 'overview' | 'courses' | 'ca-upload' | 'exam-upload' | 'attendance' | 'library' | 'hostel' | 'profile' | 'manage-materials';

interface LecturerPortalProps {
    students: Student[];
    courses: Course[];
    results: Result[];
}

const LecturerPortal: React.FC<LecturerPortalProps> = ({ students, courses, results }) => {
    const [activeSubView, setActiveSubView] = useState<SubView>('overview');
    const [selectedCourse, setSelectedCourse] = useState<LecturerCourse | null>(null);
    const [scores, setScores] = useState<StudentScore[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isResultsDropdownOpen, setIsResultsDropdownOpen] = useState(true);
    
    // Materials State
    const [materials, setMaterials] = useState<CourseMaterial[]>(MOCK_MATERIALS);
    const [newMaterialTitle, setNewMaterialTitle] = useState('');
    const [newMaterialType, setNewMaterialType] = useState<CourseMaterial['type']>('Slide');
    
    // Bulk Course Selection State
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
    
    // Profile State
    const [lecturerData, setLecturerData] = useState<Lecturer>(MOCK_LECTURER);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock students for the selected course
    const mockStudents = useMemo(() => {
        if (!selectedCourse) return [];
        const studentIdsWithCourse = results.filter(r => r.courseCode === selectedCourse.code).map(r => r.studentId);
        const enrolledStudents = students.filter(s => studentIdsWithCourse.includes(s.id));

        return enrolledStudents.slice(0, selectedCourse.studentsEnrolled).map(s => ({
            matricNumber: s.matricNumber || s.applicationNumber || 'N/A',
            studentName: s.name,
            caScore: 0,
            examScore: 0,
            total: 0,
            grade: 'F'
        }));
    }, [selectedCourse, students, results]);


    useEffect(() => {
        if (selectedCourse) {
            setScores(mockStudents);
        }
    }, [selectedCourse, mockStudents]);

    const calculateGrade = (total: number) => {
        if (total >= 75) return 'A';
        if (total >= 65) return 'B';
        if (total >= 55) return 'C';
        if (total >= 45) return 'D';
        if (total >= 40) return 'E';
        return 'F';
    };

    const handleScoreChange = (index: number, field: 'caScore' | 'examScore', value: string) => {
        const numValue = Math.min(Number(value), field === 'caScore' ? 30 : 70);
        const newScores = [...scores];
        newScores[index] = {
            ...newScores[index],
            [field]: numValue,
            total: (field === 'caScore' ? numValue : newScores[index].caScore) + 
                   (field === 'examScore' ? numValue : newScores[index].examScore),
        };
        newScores[index].grade = calculateGrade(newScores[index].total);
        setScores(newScores);
        
        // Auto-sync simulation
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 800);
    };

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse || !newMaterialTitle) return;

        const newMat: CourseMaterial = {
            id: `mat-${Date.now()}`,
            courseCode: selectedCourse.code,
            title: newMaterialTitle,
            type: newMaterialType,
            url: '#',
            dateAdded: new Date().toISOString().split('T')[0]
        };

        setMaterials(prev => [...prev, newMat]);
        setNewMaterialTitle('');
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const handleDeleteMaterial = (id: string) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
    };

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLecturerData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLecturerData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleToggleCourseSelection = (courseCode: string) => {
        setSelectedCourseIds(prev => 
            prev.includes(courseCode) 
                ? prev.filter(id => id !== courseCode) 
                : [...prev, courseCode]
        );
    };

    const handleToggleAllCourses = () => {
        if (selectedCourseIds.length === MOCK_LECTURER_COURSES.length) {
            setSelectedCourseIds([]);
        } else {
            setSelectedCourseIds(MOCK_LECTURER_COURSES.map(c => c.code));
        }
    };

    const renderManageMaterialsView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button onClick={() => setActiveSubView('courses')} className="text-brand-blue-600 text-xs font-bold hover:underline mb-2 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            Back to Courses
                        </button>
                        <h2 className="text-2xl font-black text-slate-800">Resource Management</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedCourse?.code}: {selectedCourse?.title}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleAddMaterial} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Upload New Resource</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Resource Title</label>
                            <input 
                                type="text" 
                                value={newMaterialTitle}
                                onChange={(e) => setNewMaterialTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition-all"
                                placeholder="e.g., Week 1 Lecture Slides"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                            <select 
                                value={newMaterialType}
// FIX: Corrected a typo from `newMaterialType` to `setNewMaterialType` to call the state setter function.
                                onChange={(e) => setNewMaterialType(e.target.value as any)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition-all"
                            >
                                <option value="Slide">Lecture Slide</option>
                                <option value="Assignment">Student Assignment</option>
                                <option value="Reading">Reading List</option>
                                <option value="Other">Other Document</option>
                            </select>
                        </div>
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full py-3 bg-brand-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-blue-100 hover:bg-brand-blue-700 active:scale-95 transition-all"
                            >
                                {isSyncing ? 'Processing...' : 'Share Material'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Shared Resources</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {materials.filter(m => m.courseCode === selectedCourse?.code).length > 0 ? (
                                materials.filter(m => m.courseCode === selectedCourse?.code).map(mat => (
                                    <div key={mat.id} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2 rounded-lg ${
                                                mat.type === 'Slide' ? 'bg-blue-50 text-blue-600' :
                                                mat.type === 'Assignment' ? 'bg-rose-50 text-rose-600' :
                                                mat.type === 'Reading' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-slate-50 text-slate-600'
                                            }`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{mat.title}</p>
                                                <div className="flex items-center space-x-2 mt-0.5">
                                                    <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-100 px-1 py-0.5 rounded">{mat.type}</span>
                                                    <span className="text-[10px] text-slate-400">Shared: {mat.dateAdded}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteMaterial(mat.id)}
                                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                                            title="Delete resource"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No materials shared for this course</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCoursesView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Assigned Courses</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your academic load for the current session.</p>
                </div>
                {selectedCourseIds.length > 0 && (
                    <div className="flex items-center gap-3 animate-in zoom-in duration-200">
                        <span className="text-xs font-black text-brand-blue-600 bg-brand-blue-50 px-3 py-1.5 rounded-lg border border-brand-blue-100">
                            {selectedCourseIds.length} Selected
                        </span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase rounded-lg hover:bg-slate-900 transition-colors shadow-sm">
                                Export All Attendance
                            </button>
                            <button className="px-3 py-1.5 bg-brand-blue-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-brand-blue-700 transition-colors shadow-sm">
                                Message Students
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left w-12">
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-500 cursor-pointer"
                                        checked={selectedCourseIds.length === MOCK_LECTURER_COURSES.length && MOCK_LECTURER_COURSES.length > 0}
                                        onChange={handleToggleAllCourses}
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Detail</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Students</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Semester</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_LECTURER_COURSES.map((course) => (
                                <tr 
                                    key={course.code} 
                                    className={`transition-colors hover:bg-slate-50/80 ${selectedCourseIds.includes(course.code) ? 'bg-brand-blue-50/30' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            className="h-5 w-5 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-500 cursor-pointer"
                                            checked={selectedCourseIds.includes(course.code)}
                                            onChange={() => handleToggleCourseSelection(course.code)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-brand-blue-600 mb-0.5">{course.code}</span>
                                            <span className="font-bold text-slate-800">{course.title}</span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{course.units} Credit Units</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-700">
                                            <svg className="w-3 h-3 mr-1.5 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h11v-1a7 7 0 00-7-7z" /></svg>
                                            {course.studentsEnrolled}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-bold text-slate-600">{course.semester}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    setActiveSubView('manage-materials');
                                                }}
                                                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-[9px] font-black uppercase text-slate-500 rounded-lg hover:bg-slate-100 transition-all"
                                            >
                                                Materials
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    setActiveSubView('ca-upload');
                                                }}
                                                className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-xl hover:bg-brand-blue-600 hover:text-white hover:border-brand-blue-600 transition-all shadow-sm"
                                            >
                                                Open Records
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-blue-900 p-8 rounded-3xl text-white shadow-xl shadow-brand-blue-100 overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2">Teaching Schedule</h3>
                        <p className="text-brand-blue-200 text-sm mb-6">Upcoming lectures for your assigned courses.</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                                <div className="bg-white/20 p-2 rounded-xl text-center min-w-[50px]">
                                    <p className="text-[10px] font-black uppercase opacity-60">Mon</p>
                                    <p className="text-lg font-black leading-none">08</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-brand-blue-300 uppercase">09:00 AM - 11:00 AM</p>
                                    <p className="font-bold">{MOCK_LECTURER_COURSES[0].code}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                </div>
                
                <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-100">
                    <h3 className="text-xl font-black mb-2">Classroom Engagement</h3>
                    <p className="text-emerald-100 text-sm mb-6">Overview of student attendance across your courses.</p>
                    <div className="flex items-end gap-2 h-24">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all hover:bg-white/40 group relative" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-emerald-700 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                        <span>WK 1</span>
                        <span>WK 7</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfileView = () => (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <h1 className="text-xl font-bold text-slate-600 mb-6">Manage profile</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-12">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">UPDATE PROFILE</p>
                
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500">Name</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text" 
                                name="name"
                                value={lecturerData.name}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500">Department</label>
                        <div className="md:col-span-3">
                            <select
                                name="department"
                                value={lecturerData.department}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-slate-700"
                            >
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500">Rank</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text" 
                                name="rank"
                                value={lecturerData.rank}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500">Email</label>
                        <div className="md:col-span-3">
                            <input 
                                type="email" 
                                name="email"
                                value={lecturerData.email}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500">Phone</label>
                        <div className="md:col-span-3">
                            <input 
                                type="text" 
                                name="phone"
                                value={lecturerData.phone}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                        <label className="text-sm font-medium text-slate-500 pt-3">Address</label>
                        <div className="md:col-span-3">
                            <textarea 
                                name="address"
                                rows={4}
                                value={lecturerData.address}
                                onChange={handleProfileInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-slate-700 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                        <label className="text-sm font-medium text-slate-500 pt-3">Profile image</label>
                        <div className="md:col-span-3">
                            <div className="relative w-48 h-48 rounded-md overflow-hidden bg-slate-100 group">
                                <img 
                                    src={lecturerData.avatarUrl} 
                                    className="w-full h-full object-cover" 
                                    alt="Profile" 
                                />
                                <div className="absolute inset-0 bg-white/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-4xl font-light text-slate-400">photo</p>
                                    <p className="text-4xl font-light text-slate-400 -mt-2">add</p>
                                </div>
                                <div className="absolute bottom-0 w-full bg-white/90 py-2 flex items-center justify-center space-x-2 border-t border-slate-100">
                                    <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" /></svg>
                                    <button onClick={triggerFileInput} className="text-[10px] font-bold text-slate-500 uppercase">Upload an image</button>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => {
                                setIsSyncing(false);
                                setActiveSubView('overview');
                            }, 1500);
                        }}
                        className="px-12 py-3 bg-slate-500 text-white font-bold rounded-md hover:bg-slate-600 transition-all min-w-[240px]"
                    >
                        {isSyncing ? 'Updating...' : 'Update profile'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-brand-blue-100 text-brand-blue-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Courses</p>
                        <p className="text-2xl font-black text-slate-800">{MOCK_LECTURER_COURSES.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
                        <p className="text-2xl font-black text-slate-800">487</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Results Progress</p>
                        <p className="text-2xl font-black text-slate-800">66%</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Staff Notifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-brand-blue-600 text-white rounded-lg flex items-center justify-center font-bold">CA</div>
                            <div>
                                <p className="font-bold text-slate-800">Continuous Assessment Period Open</p>
                                <p className="text-xs text-slate-500">Deadline for all courses: 15th June, 2024</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-brand-blue-50 text-brand-blue-700 text-xs font-bold rounded-lg hover:bg-brand-blue-100" onClick={() => setActiveSubView('ca-upload')}>Go to CA Upload</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderResultsUpload = (type: 'CA' | 'Exam') => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {!selectedCourse ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_LECTURER_COURSES.map(course => (
                        <button 
                            key={course.code}
                            onClick={() => setSelectedCourse(course)}
                            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group"
                        >
                            <span className="text-[10px] font-black uppercase text-brand-blue-600 bg-brand-blue-50 px-2 py-0.5 rounded group-hover:bg-brand-blue-100">{course.code}</span>
                            <h3 className="font-bold text-slate-800 mt-2">{course.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">{course.studentsEnrolled} Students Registered</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <button onClick={() => setSelectedCourse(null)} className="text-brand-blue-600 text-xs font-bold hover:underline mb-2 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    Switch Course
                                </button>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-black text-slate-800">{selectedCourse.code} {type} Submission</h2>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${type === 'CA' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{type} Mode</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedCourse.title}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Export CSV
                                </button>
                                <button className="px-4 py-2 bg-brand-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-blue-100 hover:bg-brand-blue-700 flex items-center transition-all">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    Bulk Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                        <div className="overflow-x-auto max-h-[600px]">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Student Information</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-widest">{type} Score (Max {type === 'CA' ? 30 : 70})</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-widest">Validation Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {scores.map((s, idx) => (
                                        <tr key={s.matricNumber} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{s.studentName}</span>
                                                    <span className="text-[10px] font-mono text-slate-400">{s.matricNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <input 
                                                    type="number" 
                                                    className="w-24 px-4 py-2 text-center rounded-xl border-2 border-slate-100 focus:border-brand-blue-500 focus:ring-4 focus:ring-brand-blue-50 focus:outline-none font-bold text-slate-800 transition-all"
                                                    value={type === 'CA' ? (s.caScore === 0 ? '' : s.caScore) : (s.examScore === 0 ? '' : s.examScore)}
                                                    max={type === 'CA' ? 30 : 70}
                                                    onChange={(e) => handleScoreChange(idx, type === 'CA' ? 'caScore' : 'examScore', e.target.value)}
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    (type === 'CA' ? s.caScore : s.examScore) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    {(type === 'CA' ? s.caScore : s.examScore) > 0 ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <div className="text-xs text-slate-500 font-bold">
                                {isSyncing ? 'Changes being saved to server...' : 'All changes saved locally.'}
                            </div>
                            <button className="px-8 py-3 bg-brand-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-brand-blue-100 hover:bg-brand-blue-700 active:scale-95 transition-all">
                                Save Final {type} Marks
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderHostel = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Staff Accommodation</h2>
                <p className="text-slate-500 mt-2">Request on-campus staff housing or guest chalet booking.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[200px]">
                        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 4h.01M9 16h.01" /></svg>
                        <p className="text-sm font-bold text-slate-500 uppercase">Apply for Staff Quarters</p>
                        <button className="mt-4 px-6 py-2 bg-brand-blue-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-brand-blue-100">Start Application</button>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[200px]">
                        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-sm font-bold text-slate-500 uppercase">Book Guest Chalet</p>
                        <button className="mt-4 px-6 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-lg hover:border-brand-blue-600 hover:text-brand-blue-600">Check Availability</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const SidebarItem = ({ view, label, icon, active }: { view: SubView, label: string, icon: React.ReactNode, active?: boolean }) => (
        <button 
            onClick={() => { setActiveSubView(view); setSelectedCourse(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                (active ?? activeSubView === view) ? 'bg-brand-blue-600 text-white shadow-lg shadow-brand-blue-100' : 'text-slate-500 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span className="truncate">{label}</span>
        </button>
    );

    const DropdownItem = ({ view, label, active }: { view: SubView, label: string, active: boolean }) => (
        <button 
            onClick={() => { setActiveSubView(view); setSelectedCourse(null); }}
            className={`w-full flex items-center space-x-3 pl-12 pr-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active ? 'text-brand-blue-600 bg-brand-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-brand-blue-600' : 'bg-slate-200'}`}></span>
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)]">
            <aside className="lg:w-72 space-y-4 flex-shrink-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-4 relative">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img src={lecturerData.avatarUrl} className="w-14 h-14 rounded-2xl object-cover shadow-md" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-black text-slate-800 truncate">{lecturerData.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate tracking-widest uppercase">{lecturerData.rank}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <SidebarItem 
                        view="overview" 
                        label="Dashboard Overview" 
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
                    />
                    <SidebarItem 
                        view="courses" 
                        label="My Courses" 
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>} 
                    />

                    <div className="space-y-1">
                        <button 
                            onClick={() => setIsResultsDropdownOpen(!isResultsDropdownOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                (activeSubView === 'ca-upload' || activeSubView === 'exam-upload') ? 'text-brand-blue-600 bg-brand-blue-50' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" /></svg>
                                <span>Results Upload</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform ${isResultsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isResultsDropdownOpen && (
                            <div className="space-y-1 pb-2">
                                <DropdownItem view="ca-upload" label="CA Scores (30%)" active={activeSubView === 'ca-upload'} />
                                <DropdownItem view="exam-upload" label="Examination (70%)" active={activeSubView === 'exam-upload'} />
                            </div>
                        )}
                    </div>

                    <SidebarItem 
                        view="attendance" 
                        label="Daily Attendance" 
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} 
                    />
                    
                    <a 
                        href="https://classroom.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        <div className="relative">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <span>Live Class</span>
                    </a>

                    <SidebarItem 
                        view="library" 
                        label="Borrow Books" 
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>} 
                    />
                    <SidebarItem 
                        view="hostel" 
                        label="Book Accommodation" 
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
                    />
                </div>
            </aside>

            <main className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        {activeSubView === 'profile' ? 'Staff Profile Management' : 'Academic Portal'}
                    </h2>
                    <button 
                        onClick={() => setActiveSubView('profile')}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
                            activeSubView === 'profile' ? 'bg-slate-200 text-slate-700' : 'bg-brand-blue-50 text-brand-blue-600 hover:bg-brand-blue-100 shadow-sm'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>My Profile</span>
                    </button>
                </div>

                {activeSubView === 'profile' && renderProfileView()}
                {activeSubView === 'overview' && renderOverview()}
                {activeSubView === 'courses' && renderCoursesView()}
                {activeSubView === 'manage-materials' && renderManageMaterialsView()}
                {activeSubView === 'ca-upload' && renderResultsUpload('CA')}
                {activeSubView === 'exam-upload' && renderResultsUpload('Exam')}
                {activeSubView === 'library' && <Library />}
                {activeSubView === 'hostel' && renderHostel()}
                {activeSubView === 'attendance' && (
                    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Module Under Maintenance</p>
                        <p className="text-slate-300 mt-2 max-w-xs">The Daily Attendance feature is currently being updated for the new session.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LecturerPortal;
