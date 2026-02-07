
import React, { useState, useMemo, useCallback } from 'react';
import { HostelBuilding, RoomType, Room, HostelAllocationRequest, Student } from '../types';

interface HostelManagementPortalProps {
    rooms: Room[];
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
    requests: HostelAllocationRequest[];
    setRequests: React.Dispatch<React.SetStateAction<HostelAllocationRequest[]>>;
    students: Student[];
}

const MOCK_HOSTELS: HostelBuilding[] = [
    { id: 'HOS1', name: 'Queen Amina Hall', gender: 'Female', totalRooms: 100, location: 'North Campus' },
    { id: 'HOS2', name: 'King Jaja Hall', gender: 'Male', totalRooms: 120, location: 'South Campus' },
];

const HostelManagementPortal: React.FC<HostelManagementPortalProps> = ({ rooms, setRooms, requests, setRequests, students }) => {
    const [activeSubView, setActiveSubView] = useState<'dashboard' | 'queue'>('dashboard');
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAllocate = (requestId: string, roomId: string) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        const student = students.find(s => s.id === request.studentId);
        
        if (!student?.isHostelFeePaid) {
            showToast('Allocation Denied: No record of Hostel Fee payment in Bursary stream.', 'error');
            return;
        }

        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, occupants: [...r.occupants, request.studentId] } : r));
        setRequests(prev => prev.filter(r => r.id !== requestId));
        showToast('Room successfully allocated and synchronized with Registrar records.');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {toast && (
                <div className={`fixed top-6 right-6 z-[200] px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl animate-in slide-in-from-right-4 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'}`}>
                    {toast.msg}
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Facilities Management</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Unified Data Stream: BURSARY_SYNC_ACTIVE</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button onClick={() => setActiveSubView('dashboard')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubView === 'dashboard' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>Stats</button>
                    <button onClick={() => setActiveSubView('queue')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubView === 'queue' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>Allocation Queue</button>
                </div>
            </header>

            {activeSubView === 'queue' ? (
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black text-slate-800 mb-8">Pending Room Requests</h2>
                    <div className="space-y-4">
                        {requests.length > 0 ? requests.map(req => (
                            <div key={req.id} className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between group hover:border-blue-200 border border-transparent transition-all">
                                <div>
                                    <h4 className="font-bold text-slate-800">{req.studentName}</h4>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase">{req.matricNumber}</p>
                                </div>
                                <button 
                                    onClick={() => handleAllocate(req.id, rooms[0].id)} 
                                    className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                                >
                                    Verify & Assign Room
                                </button>
                            </div>
                        )) : (
                            <p className="py-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest">Queue Clear</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {MOCK_HOSTELS.map(h => (
                        <div key={h.id} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{h.name}</p>
                            <p className="text-2xl font-black text-slate-800">50 Rooms</p>
                            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: '84%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostelManagementPortal;
