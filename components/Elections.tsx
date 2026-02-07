
import React, { useState } from 'react';
import { MOCK_ELECTIONS } from '../constants';
import { Candidate } from '../types';

const Elections: React.FC = () => {
    const [votes, setVotes] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);

    const handleVote = (position: string, candidateId: string) => {
        if (submitted) return;
        setVotes(prev => ({ ...prev, [position]: candidateId }));
    };

    const handleSubmitVotes = () => {
        if (Object.keys(votes).length !== MOCK_ELECTIONS.length) {
            alert('Please vote for all positions before submitting.');
            return;
        }
        setSubmitted(true);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">SUG Elections</h2>
            <p className="text-slate-600 mb-6">Cast your vote for the next student leaders. Your vote is your voice!</p>

            {submitted ? (
                <div className="p-8 text-center bg-green-100 border border-green-400 text-green-700 rounded-lg" role="status">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="font-bold text-2xl mt-4">Thank You for Voting!</h3>
                    <p className="mt-2">Your votes have been successfully cast. The results will be announced by the electoral committee in due course.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {MOCK_ELECTIONS.map((position) => (
                        <div key={position.title}>
                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">{position.title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {position.candidates.map((candidate: Candidate) => (
                                    <div
                                        key={candidate.id}
                                        className={`rounded-lg border-2 transition-all duration-200 ${
                                            votes[position.title] === candidate.id
                                                ? 'border-brand-blue-500 bg-brand-blue-50 shadow-lg scale-105'
                                                : 'border-slate-200 bg-white hover:border-brand-blue-300'
                                        }`}
                                    >
                                        <div className="p-4 text-center">
                                            <img src={candidate.photoUrl} alt={`Photo of ${candidate.name}`} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md" />
                                            <p className="mt-3 font-bold text-slate-800">{candidate.name}</p>
                                        </div>
                                        <div className="p-4 pt-0">
                                            <button
                                                onClick={() => handleVote(position.title, candidate.id)}
                                                className={`w-full px-4 py-2 text-sm font-semibold rounded-lg ${
                                                    votes[position.title] === candidate.id
                                                        ? 'bg-brand-blue-600 text-white'
                                                        : 'bg-slate-200 text-slate-700'
                                                }`}
                                            >
                                                {votes[position.title] === candidate.id ? 'Voted' : `Vote for ${candidate.name}`}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end pt-6 border-t">
                        <button
                            onClick={handleSubmitVotes}
                            className="px-8 py-3 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            disabled={Object.keys(votes).length !== MOCK_ELECTIONS.length}
                        >
                            Submit All Votes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Elections;
