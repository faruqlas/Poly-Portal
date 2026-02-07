
import React, { useState } from 'react';

const HostelRequest: React.FC = () => {
    const [roomType, setRoomType] = useState('4-person');
    const [specialNeeds, setSpecialNeeds] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            alert('You must agree to the hostel rules and regulations.');
            return;
        }
        setSubmitted(true);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Hostel Room Request</h2>
            <p className="text-slate-600 mb-6">Apply for accommodation in the school hostel.</p>

            {submitted ? (
                <div className="p-4 text-center bg-green-50 border border-green-200 text-green-800 rounded-lg" role="status">
                    <h3 className="font-bold text-lg">Hostel Request Submitted!</h3>
                    <p className="mt-2">Your application for a <strong>{roomType}</strong> room has been received. Room allocation is subject to availability and payment of hostel fees. You will be notified by the Hostel Manager.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-primary mt-4 px-6 py-2 text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
                        Make another request
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset>
                        <legend className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Preferred Room Type</legend>
                        <div className="mt-2 space-y-3">
                             <label htmlFor="4-person" className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="radio" id="4-person" name="roomType" value="4-person" checked={roomType === '4-person'} onChange={(e) => setRoomType(e.target.value)} className="h-4 w-4 text-navy-primary border-slate-300 focus:ring-navy-primary"/>
                                <span className="ml-3 text-sm font-bold text-slate-700">4-person Room</span>
                            </label>
                             <label htmlFor="2-person" className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="radio" id="2-person" name="roomType" value="2-person" checked={roomType === '2-person'} onChange={(e) => setRoomType(e.target.value)} className="h-4 w-4 text-navy-primary border-slate-300 focus:ring-navy-primary"/>
                                <span className="ml-3 text-sm font-bold text-slate-700">2-person Room (Premium)</span>
                            </label>
                        </div>
                    </fieldset>
                    <div>
                        <label htmlFor="specialNeeds" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Special Needs or Considerations (Optional)</label>
                        <textarea
                            id="specialNeeds"
                            rows={3}
                            value={specialNeeds}
                            onChange={(e) => setSpecialNeeds(e.target.value)}
                            placeholder="e.g., medical condition, request for ground floor room, etc."
                            className="w-full px-4 py-3.5 text-sm font-bold transition-all outline-none resize-none"
                        ></textarea>
                    </div>
                     <div className="relative flex items-start p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center h-5">
                            <input
                                id="agreement"
                                name="agreement"
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="h-4 w-4 text-navy-primary border-slate-300 rounded focus:ring-navy-primary cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-xs">
                            <label htmlFor="agreement" className="font-bold text-slate-600 uppercase tracking-tight cursor-pointer">
                                I have read and agree to abide by the hostel rules and regulations.
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary px-8 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 disabled:opacity-50" disabled={!agreed}>
                            Submit Application
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default HostelRequest;
