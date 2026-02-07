
import React, { useState } from 'react';

const TranscriptRequest: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [address, setAddress] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!destination || !address) {
            alert('Please fill all fields.');
            return;
        }
        setSubmitted(true);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Academic Transcript Request</h2>
            <p className="text-slate-600 mb-6">Request a copy of your official academic transcript.</p>

            {submitted ? (
                 <div className="p-4 text-center bg-green-50 border border-green-200 text-green-800 rounded-lg" role="status">
                    <h3 className="font-bold text-lg">Transcript Request Submitted!</h3>
                    <p className="mt-2">Your request has been sent to the Exams Officer. Please proceed to the payment portal to pay the transcript fee to complete your request.</p>
                     <p className="mt-2 text-sm">It will be sent to: <br/><strong>{destination}</strong><br/>{address}</p>
                    <button onClick={() => setSubmitted(false)} className="btn-primary mt-4 px-6 py-2 text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
                        Make another request
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="destination" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Destination Institution/Organization</label>
                        <input
                            type="text"
                            id="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="e.g., University of Lagos"
                            className="w-full px-4 py-3.5 text-sm font-bold transition-all outline-none"
                            required
                         />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Postal Address of Destination</label>
                        <textarea
                            id="address"
                            rows={4}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Please provide the complete and correct address..."
                            className="w-full px-4 py-3.5 text-sm font-bold transition-all outline-none resize-none"
                            required
                        ></textarea>
                    </div>
                     <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 flex items-start gap-4">
                         <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                         </div>
                        <div>
                            <p className="font-bold text-[10px] uppercase tracking-widest mb-1">Important Notice</p>
                            <p className="text-xs opacity-90 leading-relaxed">A non-refundable fee is required for transcript processing. Please ensure you have made the payment after submitting this request.</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary px-8 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95">
                            Submit Request
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TranscriptRequest;
