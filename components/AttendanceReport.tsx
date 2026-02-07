import React, { useState, useMemo } from 'react';
import { MOCK_ATTENDANCE } from '../constants';
import { AttendanceStatus } from '../types';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2023', '2024', '2025', '2026'];

const AttendanceReport: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState('February');
    const [selectedYear, setSelectedYear] = useState('2026');

    // Calculate days in the selected month/year
    const daysInMonth = useMemo(() => {
        const monthIndex = MONTHS.indexOf(selectedMonth);
        return new Date(parseInt(selectedYear), monthIndex + 1, 0).getDate();
    }, [selectedMonth, selectedYear]);

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getStatusColor = (status: AttendanceStatus | undefined) => {
        switch (status) {
            case 'P': return 'text-sky-500';
            case 'A': return 'text-rose-500';
            case 'L': return 'text-emerald-500';
            case 'H': return 'text-amber-500';
            default: return 'text-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                    <div className="h-6 w-1 bg-brand-blue-600 mr-4"></div>
                    <h2 className="text-xl font-bold text-slate-800">Attendance</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Month <span className="text-brand-blue-400">*</span>
                        </label>
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue-500 text-slate-700 bg-white"
                        >
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Year <span className="text-brand-blue-400">*</span>
                        </label>
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue-500 text-slate-700 bg-white"
                        >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <button className="flex items-center justify-center px-6 py-2.5 bg-brand-blue-400 text-white font-semibold rounded-md hover:bg-brand-blue-500 transition-colors w-full md:w-auto">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Search
                        </button>
                    </div>
                </div>

                <div className="flex space-x-4 text-xs font-medium text-slate-500 mb-4 border-t pt-4">
                    <span>Present: <span className="text-sky-500">P</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Absent: <span className="text-rose-500">A</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Leave: <span className="text-emerald-500">L</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Holiday: <span className="text-amber-500">H</span></span>
                </div>

                <div className="overflow-x-auto border rounded-md">
                    <table className="min-w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-brand-blue-500 text-white text-[11px] font-bold uppercase">
                                <th className="px-4 py-3 text-left border-r border-brand-blue-400 min-w-[120px]">Course</th>
                                {daysArray.map(day => (
                                    <th key={day} className="px-2 py-3 border-r border-brand-blue-400 w-8">
                                        {day.toString().padStart(2, '0')}
                                    </th>
                                ))}
                                <th className="px-3 py-3 border-r border-brand-blue-400 w-10">P</th>
                                <th className="px-3 py-3 border-r border-brand-blue-400 w-10">A</th>
                                <th className="px-3 py-3 border-r border-brand-blue-400 w-10">L</th>
                                <th className="px-3 py-3 border-r border-brand-blue-400 w-10">H</th>
                                <th className="px-4 py-3 w-16">%</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] font-medium text-slate-500">
                            {MOCK_ATTENDANCE.map((record, index) => {
                                // Fixed: Explicitly define type of accumulator and current value to allow correct indexing
                                const stats = Object.values(record.days).reduce((acc, curr) => {
                                    if (curr && (curr === 'P' || curr === 'A' || curr === 'L' || curr === 'H')) {
                                        acc[curr]++;
                                    }
                                    return acc;
                                }, { P: 0, A: 0, L: 0, H: 0 } as Record<AttendanceStatus, number>);

                                const totalDaysTaken = stats.P + stats.A + stats.L;
                                const percentage = totalDaysTaken > 0 ? Math.round((stats.P / totalDaysTaken) * 100) : 0;

                                return (
                                    <tr key={record.courseCode} className={index % 2 === 0 ? 'bg-brand-blue-50/30' : 'bg-white'}>
                                        <td className="px-4 py-2.5 text-left border-r border-slate-100 font-bold text-slate-700">
                                            {record.courseCode}
                                        </td>
                                        {daysArray.map(day => (
                                            <td key={day} className={`px-2 py-2.5 border-r border-slate-100 font-black ${getStatusColor(record.days[day])}`}>
                                                {record.days[day] || ''}
                                            </td>
                                        ))}
                                        <td className="px-3 py-2.5 border-r border-slate-100">{stats.P}</td>
                                        <td className="px-3 py-2.5 border-r border-slate-100">{stats.A}</td>
                                        <td className="px-3 py-2.5 border-r border-slate-100">{stats.L}</td>
                                        <td className="px-3 py-2.5 border-r border-slate-100">{stats.H}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-700">
                                            {percentage} %
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;