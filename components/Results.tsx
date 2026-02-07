
import { MOCK_ALL_RESULTS, MOCK_EXAM_TIMETABLE } from '../constants';
import { ExamSchedule, Result, Student } from '../types';
import React, { useEffect, useMemo, useState } from 'react';

// Declare global variables for the libraries loaded via CDN
declare const html2canvas: any;
declare const jspdf: any;

type SortConfig = {
    key: keyof Result;
    direction: 'asc' | 'desc';
} | null;

type TimetableSortConfig = {
    key: keyof ExamSchedule;
    direction: 'asc' | 'desc';
} | null;

interface ResultsProps {
    student: Student;
}

const Results: React.FC<ResultsProps> = ({ student }) => {
    const [activeTab, setActiveTab] = useState<'results' | 'timetable'>('results');
    const [isLoading, setIsLoading] = useState(true);
    const [showNotificationToast, setShowNotificationToast] = useState<{msg: string, title: string} | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    
    const gradePoints: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };

    const [reminders, setReminders] = useState<string[]>(() => {
        const saved = localStorage.getItem('exam_reminders');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [student.id, activeTab]);

    useEffect(() => {
        localStorage.setItem('exam_reminders', JSON.stringify(reminders));
    }, [reminders]);

    // Carry-over detection for tracking unresolved failures
    const outstandingCarryOvers = useMemo(() => {
        const failedMap = new Map<string, Result>();
        const passedSet = new Set<string>();

        // Process chronological results to see if an F was ever cleared by a subsequent pass
        MOCK_ALL_RESULTS.forEach(r => {
            if (r.grade === 'F') {
                failedMap.set(r.courseCode, r);
            } else if (gradePoints[r.grade] > 0) {
                passedSet.add(r.courseCode);
            }
        });

        return Array.from(failedMap.values()).filter(r => !passedSet.has(r.courseCode));
    }, [gradePoints]);

    const { sessions, chronologicalPeriods, availableSemesters } = useMemo(() => {
        const sessionSet = new Set<string>();
        const periodSet = new Set<string>();
        const semesterSet = new Set<string>();

        MOCK_ALL_RESULTS.forEach(r => {
            sessionSet.add(r.session);
            semesterSet.add(r.semester);
            periodSet.add(`${r.session}|${r.semester}`);
        });
        
        const periods = Array.from(periodSet).map(p => {
            const [session, semester] = p.split('|');
            return { session, semester };
        }).sort((a, b) => {
            if (a.session < b.session) return -1;
            if (a.session > b.session) return 1;
            if (a.semester === 'First Semester' && b.semester === 'Second Semester') return -1;
            if (a.semester === 'Second Semester' && b.semester === 'First Semester') return 1;
            return 0;
        });

        return {
            sessions: Array.from(sessionSet).sort().reverse(),
            chronologicalPeriods: periods,
            availableSemesters: Array.from(semesterSet).sort()
        };
    }, []);

    const carryOverStatusMap = useMemo(() => {
        const map = new Map<string, boolean>(); 
        const failedCourses = new Set<string>();

        chronologicalPeriods.forEach(period => {
            const periodResults = MOCK_ALL_RESULTS.filter(r => r.session === period.session && r.semester === period.semester);
            
            periodResults.forEach(res => {
                const key = `${res.session}|${res.semester}|${res.courseCode}`;
                if (failedCourses.has(res.courseCode)) {
                    map.set(key, true);
                }
                if (res.grade === 'F') {
                    failedCourses.add(res.courseCode);
                }
            });
        });
        return map;
    }, [chronologicalPeriods]);

    const isCarryOverResult = (result: Result) => {
        return carryOverStatusMap.get(`${result.session}|${result.semester}|${result.courseCode}`) || false;
    };
    
    // DEFAULT LOGIC: Initially show the student's current session and semester
    const [selectedSession, setSelectedSession] = useState(
        sessions.includes(student.session) ? student.session : (sessions[0] || '')
    );
    
    const [selectedSemester, setSelectedSemester] = useState(
        availableSemesters.includes(student.semester) ? student.semester : 'all'
    );
    
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [timetableSortConfig, setTimetableSortConfig] = useState<TimetableSortConfig>({ key: 'date', direction: 'asc' });
    const [columnFilters, setColumnFilters] = useState<Partial<Record<keyof Result, string>>>({});
    const [timetableSearch, setTimetableSearch] = useState('');

    const processedResults = useMemo(() => {
        let results = MOCK_ALL_RESULTS.filter(r => {
            const matchesSession = r.session === selectedSession;
            const matchesSemester = selectedSemester === 'all' || r.semester === selectedSemester;
            return matchesSession && matchesSemester;
        });

        (Object.keys(columnFilters) as Array<keyof Result>).forEach((key) => {
            const value = columnFilters[key];
            if (value) {
                results = results.filter(r => {
                    const cellValue = String(r[key]).toLowerCase();
                    return cellValue.includes(value.toLowerCase());
                });
            }
        });

        if (sortConfig) {
            results.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return results;
    }, [selectedSession, selectedSemester, sortConfig, columnFilters]);

    const periodGPA = useMemo(() => {
        const results = MOCK_ALL_RESULTS.filter(r => r.session === selectedSession && (selectedSemester === 'all' || r.semester === selectedSemester));
        const totalUnits = results.reduce((sum, result) => sum + result.units, 0);
        if (totalUnits === 0) return '0.00';
        const totalPoints = results.reduce((sum, result) => sum + (gradePoints[result.grade] * result.units), 0);
        return (totalPoints / totalUnits).toFixed(2);
    }, [selectedSession, selectedSemester]);

    const cgpa = useMemo(() => {
        let latestPeriodIndex = -1;
        if (selectedSemester === 'all') {
            latestPeriodIndex = chronologicalPeriods.map(p => p.session).lastIndexOf(selectedSession);
        } else {
            latestPeriodIndex = chronologicalPeriods.findIndex(p => p.session === selectedSession && p.semester === selectedSemester);
        }

        if (latestPeriodIndex === -1) return '0.00';
        const periodsToInclude = chronologicalPeriods.slice(0, latestPeriodIndex + 1);
        const resultsToInclude = MOCK_ALL_RESULTS.filter(r => 
            periodsToInclude.some(p => p.session === r.session && p.semester === r.semester)
        );
        const totalUnits = resultsToInclude.reduce((sum, result) => sum + result.units, 0);
        if (totalUnits === 0) return '0.00';
        const totalPoints = resultsToInclude.reduce((sum, result) => sum + (gradePoints[result.grade] * result.units), 0);
        return (totalPoints / totalUnits).toFixed(2);
    }, [selectedSession, selectedSemester, chronologicalPeriods]);

    return (
        <div className="space-y-6 relative">
            <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-200 flex space-x-1 print:hidden">
                <button 
                    onClick={() => setActiveTab('results')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'results' ? 'bg-navy-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    Academic Records
                </button>
                <button 
                    onClick={() => setActiveTab('timetable')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'timetable' ? 'bg-navy-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    Exam Timetable
                </button>
            </div>

            {activeTab === 'results' && (
                <div className="space-y-6">
                    {/* CARRY-OVER TRACKER CARD */}
                    {outstandingCarryOvers.length > 0 && (
                        <div className="bg-amber-50 rounded-[32px] border-2 border-amber-200 p-8 shadow-sm animate-in slide-in-from-top-4 duration-500 print:hidden">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-amber-200 rounded-2xl text-amber-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight">Outstanding Carry-Overs</h3>
                                    <p className="text-amber-700 text-xs font-bold uppercase tracking-widest">Action Required for Convocation Eligibility</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {outstandingCarryOvers.map(co => (
                                    <div key={co.courseCode} className="bg-white p-4 rounded-2xl border border-amber-100 flex items-center justify-between group hover:border-amber-400 transition-all">
                                        <div>
                                            <p className="text-xs font-black text-amber-600">{co.courseCode}</p>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{co.courseTitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-rose-500 uppercase">Grade F</span>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">{co.session}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-[10px] font-bold text-amber-800/60 uppercase leading-relaxed text-center">Under NBTE regulations, carry-overs must be cleared before graduation is authorized.</p>
                        </div>
                    )}

                    <div className="p-6 bg-white rounded-lg shadow-md print:hidden animate-in fade-in duration-300">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Transcript & Result Center</h2>
                                <p className="text-slate-600 mt-1">Review your academic journey and export official documents.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button className="btn-primary flex items-center px-6 py-2.5 text-white text-[11px] font-black uppercase tracking-widest shadow-lg">Export Statement</button>
                            </div>
                        </div>

                        <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Academic Session</label>
                                    <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} className="block w-full px-3 py-2 text-sm border-slate-300 bg-white rounded-lg transition-all outline-none">
                                        {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Semester</label>
                                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="block w-full px-3 py-2 text-sm border-slate-300 bg-white rounded-lg transition-all outline-none">
                                        <option value="all">Full Session Record</option>
                                        {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="printable-area" className="p-6 bg-white rounded-lg shadow-md print:shadow-none min-h-[600px] border border-slate-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{selectedSession}</h3>
                                <p className="text-slate-600 mt-1 uppercase text-[10px] font-black tracking-widest">{selectedSemester === 'all' ? 'FULL SESSION' : selectedSemester}</p>
                            </div>
                            <div className="text-right hidden print:block">
                                <p className="text-lg font-black text-navy-primary">POLYTECHNIC OF NIGERIA</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Official Result Portal</p>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden border-slate-100">
                            <table className="min-w-full bg-white divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Code</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Title</th>
                                        <th className="py-3 px-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Units</th>
                                        <th className="py-3 px-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</th>
                                        <th className="py-3 px-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {processedResults.map((result) => {
                                        const isCO = isCarryOverResult(result);
                                        return (
                                            <tr key={`${result.session}-${result.semester}-${result.courseCode}`} className={`hover:bg-slate-50 transition-colors ${isCO ? 'bg-amber-50/40 border-l-4 border-amber-400' : ''}`}>
                                                <td className="py-3 px-4 text-sm font-medium text-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        {result.courseCode}
                                                        {isCO && (
                                                            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase rounded shadow-sm">Carry-Over</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium">{result.courseTitle}</td>
                                                <td className="py-3 px-4 text-center text-sm text-slate-700 font-bold">{result.units}</td>
                                                <td className="py-3 px-4 text-center text-sm text-slate-700 font-bold">{result.score}</td>
                                                <td className={`py-3 px-4 text-center font-black text-sm ${result.grade === 'F' ? 'text-rose-600' : 'text-slate-900'}`}>{result.grade}</td>
                                            </tr>
                                        );
                                    })}
                                    {processedResults.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center">
                                                <p className="text-slate-300 font-black uppercase text-xs tracking-widest">No results found for this selection</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period GPA</h3>
                                <p className="text-4xl font-black text-slate-800 mt-1">{periodGPA}</p>
                            </div>
                            <div className="p-6 bg-blue-50 border border-brand-primary-100 rounded-2xl shadow-inner">
                                <h3 className="text-[10px] font-black text-navy-primary uppercase tracking-widest">Cumulative GPA (CGPA)</h3>
                                <p className="text-4xl font-black text-navy-primary mt-1">{cgpa}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'timetable' && (
                <div className="bg-white p-8 rounded-lg shadow-md animate-in fade-in duration-300 border border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-50 text-navy-primary rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Examination Timetable</h2>
                    </div>
                    <div className="border rounded-xl overflow-hidden border-slate-100">
                        <table className="min-w-full bg-white divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Code</th>
                                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Date</th>
                                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Slot</th>
                                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Assigned Venue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {MOCK_EXAM_TIMETABLE.map((exam) => (
                                    <tr key={exam.courseCode} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-5 px-6 text-sm font-black text-slate-800">{exam.courseCode}</td>
                                        <td className="py-5 px-6 text-sm text-slate-700 font-medium">{exam.date}</td>
                                        <td className="py-5 px-6 text-sm text-slate-700 font-medium">{exam.time}</td>
                                        <td className="py-5 px-6 text-sm font-black text-navy-primary">{exam.venue}</td>
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

export default Results;
