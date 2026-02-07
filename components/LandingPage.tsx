
import React from 'react';

interface LandingPageProps {
    onSignIn: () => void;
    onApply: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onApply }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* STICKY NAVIGATION BAR */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-brand-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue-900/20 group-hover:scale-105 transition-transform">
                            <span className="font-black text-white italic text-lg">PN</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">PolyPortal</h1>
                            <p className="text-[8px] font-black uppercase text-brand-blue-600 tracking-widest mt-0.5">Nigeria Institutional Gateway</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        <button 
                            onClick={onSignIn}
                            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-blue-700 transition-colors"
                        >
                            Portal Sign-In
                        </button>
                        <button 
                            onClick={() => alert('Staff Recruitment Portal is currently processing the next academic batch. Please check back soon.')}
                            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-blue-700 transition-colors"
                        >
                            Staff Recruitment
                        </button>
                        <button 
                            onClick={onApply}
                            className="px-6 py-2.5 bg-brand-blue-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-brand-blue-900/20 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
                <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-slate-100 rounded-full blur-[150px] opacity-40"></div>

                <div className="max-w-4xl w-full text-center space-y-12 relative z-10 pt-20 pb-32">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full animate-in slide-in-from-top-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">2025/2026 Academic Session Open</p>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] animate-in fade-in zoom-in-95 duration-1000">
                            Education is the <br/>
                            <span className="text-brand-blue-700">best key success</span> <br/>
                            in life.
                        </h1>
                        <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                            Unlock your potential with industry-standard polytechnic education. Our NBTE-compliant portals ensure a seamless academic journey from application to graduation.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        <button 
                            onClick={onApply}
                            className="w-full sm:w-auto px-12 py-5 bg-hitech-orange text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-hitech-orange/40 hover:bg-hitech-orange-hover hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Start Your Application
                        </button>
                        <button 
                            onClick={onSignIn}
                            className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-100 text-slate-800 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3"
                        >
                            Existing Students
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>
                </div>

                {/* Institutional Features */}
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-t border-slate-50 animate-in fade-in duration-1000 delay-700">
                    {[
                        { title: 'Digital Excellence', desc: 'Full online course registration and result management.' },
                        { title: 'NBTE Standards', desc: 'Curriculum and quotas aligned with national regulatory bodies.' },
                        { title: 'Career Driven', desc: 'Vocational training and direct links to industrial partners.' }
                    ].map((f, i) => (
                        <div key={i} className="text-center md:text-left space-y-3 p-8 rounded-3xl hover:bg-slate-50 transition-colors">
                            <div className="w-12 h-12 bg-brand-blue-50 text-brand-blue-700 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tighter">{f.title}</h4>
                            <p className="text-slate-500 text-sm font-medium">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">© 2025 Polytechnic of Nigeria</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Authorized Academic Management System</p>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-[10px] font-black uppercase text-slate-400 hover:text-brand-blue-700">Privacy Policy</a>
                        <a href="#" className="text-[10px] font-black uppercase text-slate-400 hover:text-brand-blue-700">IT Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
