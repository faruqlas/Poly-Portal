
import React, { useState } from 'react';

interface TicketDetails {
    id: string;
    category: string;
    description: string;
    status: 'Pending Review' | 'In Progress' | 'Resolved';
    dateCreated: string;
}

const ITSupport: React.FC = () => {
    const [issueCategory, setIssueCategory] = useState('');
    const [description, setDescription] = useState('');
    const [submittedTicket, setSubmittedTicket] = useState<TicketDetails | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!issueCategory || !description) {
            alert('Please fill all fields.');
            return;
        }

        const newTicket: TicketDetails = {
            id: `POL-IT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            category: issueCategory,
            description: description,
            status: 'Pending Review',
            dateCreated: new Date().toLocaleString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        setSubmittedTicket(newTicket);
    };

    const handleReset = () => {
        setSubmittedTicket(null);
        setIssueCategory('');
        setDescription('');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">IT Support Request</h2>
            <p className="text-slate-600 mb-6">Having a technical issue? Let us know and we'll track it for you.</p>

            {submittedTicket ? (
                <div className="space-y-6">
                    <div className="p-4 text-center bg-green-50 border border-green-200 text-green-800 rounded-lg" role="status">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-lg">Support Ticket Created Successfully!</h3>
                        <p className="mt-1">The IT department has received your request and will contact you via your student email.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                            <h4 className="font-bold text-slate-700">Ticket Details</h4>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Ticket ID</p>
                                    <p className="text-sm font-bold text-slate-800">{submittedTicket.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                        {submittedTicket.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Date Created</p>
                                    <p className="text-sm text-slate-700">{submittedTicket.dateCreated}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Category</p>
                                    <p className="text-sm text-slate-700">{submittedTicket.category}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase">Issue Description</p>
                                <p className="text-sm text-slate-700 mt-1 italic">"{submittedTicket.description}"</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleReset} 
                        className="w-full px-4 py-3 bg-brand-blue-600 text-white font-semibold rounded-lg hover:bg-brand-blue-700 transition-colors shadow-sm"
                    >
                        Submit Another Ticket
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="issueCategory" className="block text-sm font-medium text-slate-700">Category of Issue</label>
                        <select
                            id="issueCategory"
                            value={issueCategory}
                            onChange={(e) => setIssueCategory(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm rounded-md"
                            required
                        >
                            <option value="">Select a category...</option>
                            <option value="Portal Login Issue">Portal Login Issue</option>
                            <option value="Course Registration Problem">Course Registration Problem</option>
                            <option value="Student Email Issue">Student Email Issue</option>
                            <option value="Campus Wi-Fi Connectivity">Campus Wi-Fi Connectivity</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Describe the Issue</label>
                        <textarea
                            id="description"
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please be as detailed as possible. Include any error messages you are seeing."
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-6 py-2.5 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:ring-opacity-75 transition-all">
                            Submit Support Request
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ITSupport;
