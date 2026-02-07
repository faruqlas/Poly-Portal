
import React, { useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, Funnel, FunnelChart, LabelList
} from 'recharts';
import { 
    MOCK_STUDENT, MOCK_FINANCIAL_RECORDS, MOCK_RRR_TRANSACTIONS, 
    MOCK_APPLICANTS, GLOBAL_AUDIT_LOG, DEPARTMENTS, MOCK_BOOKS, 
    MOCK_HOSTELS, MOCK_ROOMS 
} from '../constants';

type ExecView = 'overview' | 'financials' | 'academic' | 'resources';

const ExecutiveInsights: React.FC = () => {
    const [activeView, setActiveView] = useState<ExecView>('overview');
    const [isSyncing, setIsSyncing] = useState(false);

    // EXECUTIVE DATA AGGREGATION
    const stats = useMemo(() => {
        const students = 1450; // Mock total
        const staff = 120;
        const faculties = 4;
        
        // Revenue Calc
        const collected = MOCK_RRR_TRANSACTIONS
            .filter(t => t.status === 'Paid')
            .reduce((acc, t) => acc + t.amount, 0);
        const expected = MOCK_FINANCIAL_RECORDS.reduce((acc, r) => acc + r.totalFees, 0);
        
        // Bottleneck Detection: >20% blocked students per dept
        const bottlenecks = DEPARTMENTS.map(dept => {
            const deptStudents = MOCK_FINANCIAL_RECORDS.filter(r => r.department === dept);
            const blocked = deptStudents.filter(r => !r.isCleared).length;
            const ratio = deptStudents.length > 0 ? (blocked / deptStudents.length) : 0;
            return { dept, ratio, blocked, total: deptStudents.length };
        }).filter(b => b.ratio > 0.2);

        return { students, staff, faculties, collected, expected, bottlenecks };
    }, []);

    const enrollmentFunnelData = [
        { value: MOCK_APPLICANTS.length * 10, name: 'Applicants', fill: '#6366f1' },
        { value: 1450, name: 'Registered', fill: '#8b5cf6' },
        { value: 890, name: 'Exam Cleared', fill: '#ec4899' },
    ];

    const academicHealthData = [
        { faculty: 'Science', gpa: 3.2 },
        { faculty: 'Engineering', gpa: 2.8 },
        { faculty: 'Business', gpa: 3.5 },
        { faculty: 'Comm.', gpa: 3.1 },
    ];

    const revenueHistoryData = [
        { month: 'Jan', collected: 1200000, target: 2000000 },
        { month: 'Feb', collected: 4500000, target: 5000000 },
        { month: 'Mar', collected: 8900000, target: 9000000 },
        { month: 'Apr', collected: 10500000, target: 12000000 },
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Gauge */}
                <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Financial Pulse (Session)</h3>
                    <div className="h-64 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Collected', value: stats.collected },
                                        { name: 'Remaining', value: stats.expected - stats.collected }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <Cell fill="#6366f1" />
                                    <Cell fill="#1e293b" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-16 text-center">
                            <p className="text-3xl font-black text-white">₦{(stats.collected / 1000000).toFixed(1)}M</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Realized Revenue</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-4 mt-4">
                        <div className="text-center">
                            <p className="text-xs font-black text-slate-400">EXPECTED</p>
                            <p className="text-lg font-black text-white">₦{(stats.expected / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="h-10 w-px bg-slate-800"></div>
                        <div className="text-center">
                            <p className="text-xs font-black text-slate-400">VARIANCE</p>
                            <p className="text-lg font-black text-rose-500">{Math.round((stats.collected / stats.expected) * 100)}%</p>
                        </div>
                    </div>
                </div>

                {/* Enrollment Funnel */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Enrollment Funnel (Conversion)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                                <Funnel dataKey="value" data={enrollmentFunnelData} isAnimationActive>
                                    <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bottleneck Detector */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Bottleneck Detector</h3>
                        <span className="px-3 py-1 bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase rounded-lg border border-rose-500/20 animate-pulse">Critical Alerts</span>
                    </div>
                    <div className="space-y-4">
                        {stats.bottlenecks.map((b, i) => (
                            <div key={i} className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-rose-500/50 transition-all">
                                <div>
                                    <h4 className="font-black text-slate-200">{b.dept}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{b.blocked} Students Restricted via Fees</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-rose-500">{Math.round(b.ratio * 100)}%</p>
                                    <p className="text-[8px] font-black text-slate-600 uppercase">Impact Factor</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Academic Barometer */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Academic Barometer (Avg CGPA)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={academicHealthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="faculty" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                />
                                <Bar dataKey="gpa" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFinancials = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Session Revenue Trajectory (Current vs Previous)</h3>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueHistoryData}>
                            <defs>
                                <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                            <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₦${val / 1000000}M`} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="collected" stroke="#6366f1" fillOpacity={1} fill="url(#colorColl)" strokeWidth={3} />
                            <Area type="monotone" dataKey="target" stroke="#334155" fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px]">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Revenue Categories</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Tuition Fees', value: '₦420M', p: 75, color: 'bg-indigo-500' },
                            { label: 'Hostel Fees', value: '₦85M', p: 45, color: 'bg-emerald-500' },
                            { label: 'Acceptance Fees', value: '₦45M', p: 90, color: 'bg-amber-500' },
                        ].map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-sm font-bold text-slate-300">{cat.label}</p>
                                    <p className="text-sm font-black text-white">{cat.value}</p>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.p}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[40px] flex flex-col justify-center text-center">
                    <p className="text-indigo-400 font-black uppercase tracking-[0.3em] mb-2 text-xs">Scholarship Impact</p>
                    <p className="text-5xl font-black text-white">₦12.8M</p>
                    <p className="text-indigo-300/60 text-xs font-medium mt-4 uppercase">Total institutional aid disbursed this session</p>
                    <button className="mt-8 mx-auto px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl">View Recipients</button>
                </div>
            </div>
        </div>
    );

    const renderAcademic = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">CGPA Distribution Across Portals</h3>
                <div className="h-80">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={academicHealthData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 4.0]} />
                            <YAxis type="category" dataKey="faculty" stroke="#64748b" fontSize={10} width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                            <Bar dataKey="gpa" fill="#ec4899" radius={[0, 6, 6, 0]} barSize={25} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'ND Grad Readiness', value: '82%', sub: 'Eligible for Convocation', icon: '🎓' },
                    { label: 'Result Publishing', value: '100%', sub: 'All HODs Synced', icon: '📝' },
                    { label: 'NYSC Mobilisation', value: '450', sub: 'Batched for Upload', icon: '🇳🇬' },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[32px] flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{item.label}</p>
                            <p className="text-2xl font-black text-white">{item.value}</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase mt-0.5">{item.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResources = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px]">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Repository Audit (Library)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Titles</p>
                            <p className="text-2xl font-black text-indigo-400">{MOCK_BOOKS.length * 100}</p>
                        </div>
                        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Value</p>
                            <p className="text-2xl font-black text-emerald-400">₦8.4M</p>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                            <span className="text-slate-500">Circulation Rate</span>
                            <span className="text-white">68%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '68%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px]">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Infrastructure Audit (Hostels)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Bed Spaces</p>
                            <p className="text-2xl font-black text-blue-400">{MOCK_HOSTELS.length * 50}</p>
                        </div>
                        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Maintenance Log</p>
                            <p className="text-2xl font-black text-rose-400">{MOCK_ROOMS.filter(r => r.isUnderMaintenance).length} Rooms</p>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                            <span className="text-slate-500">Occupancy Efficiency</span>
                            <span className="text-white">92%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200 p-6 sm:p-10 lg:p-12 font-sans selection:bg-indigo-500 selection:text-white rounded-[60px] shadow-3xl border-4 border-slate-900">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-slate-900 pb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-indigo-600/20">EI</div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Executive Insights <span className="text-indigo-500">Super Admin</span></h1>
                    </div>
                    <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed uppercase tracking-widest text-[10px]">Real-Time Institutional Intelligence & Multi-Portal Aggregate Stream</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDownloadReport}
                        disabled={isSyncing}
                        className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-slate-800 transition-all border border-slate-800 flex items-center gap-3 active:scale-95"
                    >
                        {isSyncing ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        )}
                        {isSyncing ? 'Authorizing Report...' : 'Download Annual Report'}
                    </button>
                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl">
                        <img src="https://picsum.photos/seed/admin/100" className="w-10 h-10 rounded-full object-cover" alt="" />
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Executive Sidebar */}
                <aside className="lg:w-72 space-y-12 shrink-0">
                    <div className="space-y-2">
                         <SidebarItem view="overview" label="University Stats" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 4h.01M9 16h.01" /></svg>} />
                         <SidebarItem view="financials" label="Financial Intelligence" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                         <SidebarItem view="academic" label="Academic Health" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} />
                         <SidebarItem view="resources" label="Resource Monitoring" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} />
                    </div>

                    {/* Live Audit Monitor */}
                    <div className="bg-slate-900/30 rounded-3xl p-6 border border-slate-900/50">
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Live System Audit</h4>
                        <div className="space-y-6 max-h-96 overflow-y-auto executive-scrollbar pr-2">
                            {GLOBAL_AUDIT_LOG.map(log => (
                                <div key={log.id} className="relative pl-6 border-l border-slate-800 pb-2">
                                    <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-indigo-600 shadow-xl shadow-indigo-600/40"></div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none">{log.action}</p>
                                    <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">{log.actor} • {log.module}</p>
                                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed italic line-clamp-2">"{log.details}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-12">
                    {activeView === 'overview' && renderOverview()}
                    {activeView === 'financials' && renderFinancials()}
                    {activeView === 'academic' && renderAcademic()}
                    {activeView === 'resources' && renderResources()}
                </main>
            </div>
        </div>
    );
};

export default ExecutiveInsights;
