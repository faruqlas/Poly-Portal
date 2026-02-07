
import React from 'react';
import { View } from './types';
import { ICONS } from './constants';

interface NavItem {
    view: View;
    label: string;
}

const navItems: NavItem[] = [
    { view: 'dashboard', label: 'Dashboard' },
    { view: 'profile', label: 'My Profile' },
    { view: 'course-registration', label: 'Course Registration' },
    { view: 'course-materials', label: 'Course Materials' },
    { view: 'results', label: 'Semester Results' },
    { view: 'attendance', label: 'Attendance Report' },
    { view: 'payments', label: 'Online Payments' },
    { view: 'library', label: 'Library' },
    { view: 'hostel-request', label: 'Hostel Request' },
    { view: 'department-transfer', label: 'Department Transfer' },
    { view: 'transcript-request', label: 'Transcript Request' },
    { view: 'elections', label: 'SUG Elections' },
    { view: 'it-support', label: 'IT Support' },
];

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setSidebarOpen }) => {

    const handleItemClick = (view: View) => {
        setActiveView(view);
        if (window.innerWidth < 1024) { // Close sidebar on mobile after click
            setSidebarOpen(false);
        }
    };
    
    return (
        <>
            <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <aside 
                className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-brand-blue-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out print:hidden`}
                role="dialog"
                aria-modal="true"
                aria-label="Sidebar navigation"
                aria-hidden={!isSidebarOpen && window.innerWidth < 1024}
            >
                <div className="flex items-center justify-center h-20 border-b border-brand-blue-800">
                    <h1 className="text-2xl font-bold text-white">PolyPortal</h1>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <a
                            key={item.view}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick(item.view);
                            }}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activeView === item.view
                                    ? 'bg-brand-blue-700 text-white'
                                    : 'text-blue-100 hover:bg-brand-blue-800 hover:text-white'
                            }`}
                            aria-current={activeView === item.view ? 'page' : undefined}
                        >
                            {ICONS[item.view]}
                            <span className="ml-3">{item.label}</span>
                        </a>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-brand-blue-800">
                        <p className="px-4 text-[10px] font-black uppercase text-brand-blue-400 tracking-widest mb-2">Administrative</p>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick('lecturer-portal');
                            }}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activeView === 'lecturer-portal'
                                    ? 'bg-amber-600 text-white'
                                    : 'text-amber-100 hover:bg-amber-700 hover:text-white'
                            }`}
                            aria-current={activeView === 'lecturer-portal' ? 'page' : undefined}
                        >
                            {ICONS['lecturer-portal']}
                            <span className="ml-3 font-bold">Lecturer Portal</span>
                        </a>
                         <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick('admissions-portal');
                            }}
                            className={`flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activeView === 'admissions-portal'
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                            }`}
                            aria-current={activeView === 'admissions-portal' ? 'page' : undefined}
                        >
                            {ICONS['admissions-portal']}
                            <span className="ml-3 font-bold">Admissions Portal</span>
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick('registrar-portal');
                            }}
                            className={`flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activeView === 'registrar-portal'
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-100 hover:bg-slate-800 hover:text-white'
                            }`}
                            aria-current={activeView === 'registrar-portal' ? 'page' : undefined}
                        >
                            {ICONS['registrar-portal']}
                            <span className="ml-3 font-bold">Registrar Portal</span>
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick('exams-records-portal');
                            }}
                            className={`flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activeView === 'exams-records-portal'
                                    ? 'bg-rose-700 text-white'
                                    : 'text-rose-100 hover:bg-rose-800 hover:text-white'
                            }`}
                            aria-current={activeView === 'exams-records-portal' ? 'page' : undefined}
                        >
                            {ICONS['exams-records-portal']}
                            <span className="ml-3 font-bold">Exams & Records</span>
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleItemClick('hostel-management-portal');
                            }}
                            className={`flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activeView === 'hostel-management-portal'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                            }`}
                            aria-current={activeView === 'hostel-management-portal' ? 'page' : undefined}
                        >
                            {ICONS['hostel-management-portal']}
                            <span className="ml-3 font-bold">Hostel Management</span>
                        </a>
                    </div>
                </nav>
                 <div className="p-4 border-t border-brand-blue-800">
                    <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-blue-700 rounded-lg hover:bg-brand-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
