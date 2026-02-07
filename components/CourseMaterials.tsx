import React, { useMemo } from 'react';
import { MOCK_MATERIALS, MOCK_ALL_RESULTS } from '../constants';
import { Student, CourseMaterial } from '../types';

interface CourseMaterialsProps {
    student: Student;
}

const CourseMaterials: React.FC<CourseMaterialsProps> = ({ student }) => {

    const groupedMaterials = useMemo(() => {
        const groups: Record<string, CourseMaterial[]> = {};
        MOCK_MATERIALS.forEach(mat => {
            if (!groups[mat.courseCode]) groups[mat.courseCode] = [];
            groups[mat.courseCode].push(mat);
        });
        return groups;
    }, []);

    const TypeIcon = ({ type }: { type: CourseMaterial['type'] }) => {
        switch (type) {
            case 'Slide':
                return <svg className="w-5 h-5 text-brand-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
            case 'Assignment':
                return <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
            case 'Reading':
                return <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
            default:
                return <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Resources</h2>
                <p className="text-slate-500 text-sm mt-1">Download slides, assignments, and required reading lists for your registered courses.</p>
            </div>

            {Object.keys(groupedMaterials).map((code) => {
                const mats = groupedMaterials[code];
                return (
                    <div key={code} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-black text-brand-blue-600 bg-brand-blue-50 px-2 py-1 rounded">{code}</span>
                                <h3 className="font-bold text-slate-700">Course Materials</h3>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mats.length} Files</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {mats.map(mat => (
                                <div key={mat.id} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                            <TypeIcon type={mat.type} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{mat.title}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Added: {new Date(mat.dateAdded).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={mat.url} 
                                        className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-brand-blue-600 rounded-xl hover:bg-brand-blue-600 hover:text-white hover:border-brand-blue-600 transition-all shadow-sm flex items-center"
                                    >
                                        <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {Object.keys(groupedMaterials).length === 0 && (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No materials uploaded yet</p>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;