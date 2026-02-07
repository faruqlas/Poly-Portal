
import React, { useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, Funnel, FunnelChart, LabelList
} from 'recharts';
import { 
    Student, StudentFinancialRecord, Transaction,
    GlobalAuditEntry, LibraryBook, Room
} from '../types';
import { DEPARTMENTS } from '../constants';


interface ExecutiveInsightsProps {
    students: Student[];
    transactions: Transaction[];
    records: StudentFinancialRecord[];
    books: LibraryBook[];
    rooms: Room[];
}

const GLOBAL_AUDIT_LOG: GlobalAuditEntry[] = [
    { id: 'log1', timestamp: '2 mins ago', actor: 'Dr. E. Anya', module: 'Exams Portal', action: 'SCORE_UPDATE', details: 'Updated CA for COM 211' },
    { id: 'log2', timestamp: '5 mins ago', actor: 'Admin (Bursary)', module: 'Payments', action: 'MANUAL_VERIFY', details: 'Verified RRR for STU002' },
];


type ExecView = 'overview' | 'financials' | 'academic' | 'resources';

const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ students, transactions, records, books, rooms }) => {
    const [activeView, setActiveView] = useState<ExecView>('overview');
    const [isSyncing, setIsSyncing] = useState(false);

    const stats = useMemo(() => {
        const staff = 120;
        const faculties = 4;
        
        const collected = transactions
            .filter(t => t.status === 'Verified')
            .reduce((acc, t) => acc + t.amount, 0);
        const expected = records.reduce((acc, r) => acc + r.totalFees, 0);
        
        const bottlenecks = DEPARTMENTS.map(dept => {
            const deptStudents = records.filter(r => students.find(s => s.id === r.studentId)?.department === dept);
            const blocked = deptStudents.filter(r => !r.isCleared).length;
            const ratio = deptStudents.length > 0 ? (blocked / deptStudents.length) : 0;
            return { dept, ratio, blocked, total: deptStudents.length };
        }).filter(b => b.ratio > 0.2);

        return { students: students.length, staff, faculties, collected, expected, bottlenecks };
    }, [students, transactions, records]);

    const enrollmentFunnelData = useMemo(() => {
        const applicants = students.filter(s => s.status === 'Prospect' || s.status === 'Admitted').length;
        const registered = students.filter(s => s.isRegistered).length;
        const examCleared = records.filter(r => r.isCleared).length;

        return [
            { value: applicants, name: 'Applicants', fill: '#6366f1' },
            { value: registered, name: 'Registered', fill: '#8b5cf6' },
            { value: examCleared, name: 'Exam Cleared', fill: '#ec4899' },
        ];
    }, [students, records]);
    
    const revenueHistoryData = useMemo(() => {
        const monthlyData: { [key: string]: number } = {};
        transactions.forEach(t => {
            const month = new Date(t.createdAt).toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) monthlyData[month] = 0;
            monthlyData[month] += t.amount;
        });

        return Object.entries(monthlyData).map(([month, collected]) => ({
            month,
            collected,
            target: collected * 1.2 // Mock target
        }));
    }, [transactions]);
    
    const libraryOccupancyData = useMemo(() => {
        const total = books.reduce((acc, b) => acc + b.totalCopies, 0);
        const available = books.reduce((acc, b) => acc + b.availableCopies, 0);
        const borrowed = total - available;
        return [
            { name: 'Borrowed', value: borrowed },
            { name: 'Available', value: available },
        ];
    }, [books]);
    
    const hostelOccupancyData = useMemo(() => {
        const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const totalOccupants = rooms.reduce((acc, r) => acc + r.occupants.length, 0);
        return [
            { name: 'Occupied', value: totalOccupants },
            { name: 'Vacant', value: totalCapacity - totalOccupants },
        ];
    }, [rooms]);

    const academicHealthData = [
        { faculty: 'Science', gpa: 3.2 },
        { faculty: 'Engineering', gpa: 2.8 },
        { faculty: 'Business', gpa: 3.5 },
        { faculty: 'Comm.', gpa: 3.1 },
    ];
    
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    const handleDownloadReport = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            alert('Annual University Performance Report (2023/2024) generated and downloaded successfully.');
        }, 2000);
    };

    const SidebarItem = ({ view, label, icon }: { view: ExecView, label: string, icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                activeView === view ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
            }`}
        >
            {icon}
            <span className="truncate">{label}</span>
        </button>
    );

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Enrolled Students', value: stats.students, sub: 'Active ND/HND', color: 'text-indigo-400' },
                    { label: 'Academic Staff', value: stats.staff, sub: 'Ranked Lecturers', color: 'text-emerald-400' },
                    { label: 'Faculties', value: stats.faculties, sub: 'Schools established', color: 'text-amber-400' },
                    { label: 'Compliance', value: '94%', sub: 'NBTE Audit Status', color: 'text-rose-400' },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">{item.label}</p>
                        <p className={`text-4xl font-black ${item.color}`}>{item.value}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase mt-2">{item.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Enrollment Funnel */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Enrollment Funnel</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip />
                                    <Funnel dataKey="value" data={enrollmentFunnelData} isAnimationActive>
                                        <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Side Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Academic Health */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Faculty GPA Health</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={academicHealthData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="faculty" hide />
                                    <Bar dataKey="gpa" barSize={15} radius={[0, 8, 8, 0]}>
                                        {academicHealthData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
     const renderFinancials = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">Total Collected Revenue</h3>
                    <p className="text-4xl font-black text-emerald-400">₦{stats.collected.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">Total Expected Revenue</h3>
                    <p className="text-4xl font-black text-amber-400">₦{stats.expected.toLocaleString()}</p>
                </div>
            </div>
            
            <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8">Monthly Collection History</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueHistoryData}>
                            <defs>
                                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }}/>
                            <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1rem' }} />
                            <Area type="monotone" dataKey="collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
    
    const renderResources = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8">Library Occupancy</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={libraryOccupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                <Cell fill="#6366f1" />
                                <Cell fill="#334155" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8">Hostel Occupancy</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={hostelOccupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5}>
                                <Cell fill="#ec4899" />
                                <Cell fill="#334155" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderAcademic = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8">Financial Bottlenecks (Exam Clearance)</h3>
                {stats.bottlenecks.map(b => (
                    <div key={b.dept} className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-slate-300">{b.dept}</p>
                            <p className="text-xs font-black text-rose-400">{b.blocked} of {b.total} Blocked</p>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${b.ratio * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <div className="flex gap-8 min-h-full bg-slate-950 p-8 rounded-[40px] border border-slate-800 text-white">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 space-y-8">
                <div className="space-y-1 bg-slate-900 p-3 rounded-[32px] border border-slate-800">
                    <SidebarItem view="overview" label="Institutional KPI" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
                    <SidebarItem view="financials" label="Financial Health" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    <SidebarItem view="academic" label="Academic Audit" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                    <SidebarItem view="resources" label="Resource Usage" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 4h.01M9 16h.01" /></svg>} />
                </div>

                <div className="p-6 bg-slate-900 rounded-[32px] border border-slate-800">
                    <button 
                        onClick={handleDownloadReport}
                        disabled={isSyncing}
                        className="w-full py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/50"
                    >
                        {isSyncing ? 'Generating...' : 'Download Full Report'}
                    </button>
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] border border-slate-800 flex-1">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Real-Time Audit Log</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto executive-scrollbar pr-2">
                        {GLOBAL_AUDIT_LOG.map(log => (
                            <div key={log.id} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                                <p className="text-xs font-bold text-slate-300">{log.action}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{log.details}</p>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/50">
                                    <p className="text-[9px] font-mono text-slate-500">{log.actor}</p>
                                    <p className="text-[9px] font-mono text-slate-500">{log.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-slate-900 p-8 rounded-[40px] border border-slate-800 overflow-y-auto executive-scrollbar">
                {activeView === 'overview' && renderOverview()}
                {activeView === 'financials' && renderFinancials()}
                {activeView === 'academic' && renderAcademic()}
                {activeView === 'resources' && renderResources()}
            </main>
        </div>
    );
};

export default ExecutiveInsights;
