
import React from 'react';
import { View } from '../types';
import { ICONS, MOCK_STUDENT } from '../constants';

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const dashboardItems: { view: View; label: string; description: string }[] = [
        { view: 'course-registration', label: 'Course Registration', description: 'Register for the current semester courses.' },
        { view: 'results', label: 'View Results', description: 'Check and print your semester results.' },
        { view: 'payments', label: 'Make Payments', description: 'Pay tuition and other fees online.' },
        { view: 'library', label: 'Library', description: 'Access physical and e-library resources.' },
        { view: 'hostel-request', label: 'Hostel Request', description: 'Apply for a room in the school hostel.' },
        { view: 'profile', label: 'Edit Profile', description: 'Update your personal information.' },
    ];

    return (
        <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-slate-800">Welcome, {MOCK_STUDENT.name.split(' ')[0]}!</h1>
                <p className="mt-2 text-slate-600">
                    You are welcome to your portal. You can manage your academic activities here.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <p><span className="font-semibold text-slate-700">Matric No:</span> {MOCK_STUDENT.matricNumber}</p>
                    <p><span className="font-semibold text-slate-700">Department:</span> {MOCK_STUDENT.department}</p>
                    <p><span className="font-semibold text-slate-700">Session:</span> {MOCK_STUDENT.session}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => setActiveView(item.view)}
                        className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-brand-blue-100 text-brand-blue-600 rounded-full">
                                {ICONS[item.view]}
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-slate-800">{item.label}</h3>
                        </div>
                        <p className="mt-2 text-slate-500">{item.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
