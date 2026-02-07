
import React, { useState } from 'react';
import { MOCK_BOOKS } from '../constants';
import { Book } from '../types';

interface BookCardProps {
    book: Book;
    onBorrowRequest: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBorrowRequest }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <img src={book.coverUrl} alt={`Book cover of ${book.title}`} className="w-full h-48 object-cover" />
        <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-md text-slate-800 flex-1">{book.title}</h3>
            <p className="text-sm text-slate-500 mt-1">by {book.author}</p>
            {book.type === 'Physical' && (
                <div className="mt-3">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {book.available ? 'Available' : 'Borrowed'}
                    </span>
                </div>
            )}
        </div>
        <div className="p-4 bg-slate-50">
             {book.type === 'Physical' ? (
                 <button
                    onClick={() => onBorrowRequest(book)}
                    disabled={!book.available}
                    className="w-full px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg shadow-sm hover:bg-brand-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {book.available ? 'Request Borrow' : 'Unavailable'}
                </button>
             ) : (
                <a href={book.downloadUrl} download className="block text-center w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700">
                    Download E-Book
                </a>
             )}
        </div>
    </div>
);

const Library: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'physical' | 'ebook'>('physical');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = MOCK_BOOKS.filter(book => 
        (activeTab === 'physical' ? book.type === 'Physical' : book.type === 'E-Book') &&
        (book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const handleBorrowRequest = (book: Book) => {
        alert(`Request to borrow "${book.title}" has been sent to the librarian. Please visit the physical library to pick it up.`);
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-800">Library Resources</h2>
                <p className="mt-1 text-slate-600">Access physical books and a wide range of e-books.</p>
                
                <div className="mt-6 border-b border-slate-200">
                    <div role="tablist" aria-label="Library sections" className="-mb-px flex space-x-6">
                        <button 
                            id="physical-tab"
                            role="tab" 
                            aria-selected={activeTab === 'physical'} 
                            aria-controls="physical-panel"
                            onClick={() => setActiveTab('physical')} 
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'physical' ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Physical Library
                        </button>
                        <button 
                            id="ebook-tab"
                            role="tab" 
                            aria-selected={activeTab === 'ebook'} 
                            aria-controls="ebook-panel"
                            onClick={() => setActiveTab('ebook')} 
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'ebook' ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            E-Library
                        </button>
                    </div>
                </div>
                 <div className="mt-6">
                    <label htmlFor="search-library" className="sr-only">Search Library</label>
                    <input
                        id="search-library"
                        type="search"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-lg px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500"
                    />
                </div>
            </div>

            <div 
                id="physical-panel" 
                role="tabpanel" 
                aria-labelledby="physical-tab" 
                hidden={activeTab !== 'physical'}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {activeTab === 'physical' && filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} onBorrowRequest={handleBorrowRequest} />
                ))}
            </div>
             <div 
                id="ebook-panel" 
                role="tabpanel" 
                aria-labelledby="ebook-tab" 
                hidden={activeTab !== 'ebook'}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {activeTab === 'ebook' && filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} onBorrowRequest={handleBorrowRequest} />
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-slate-500">No books found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Library;
