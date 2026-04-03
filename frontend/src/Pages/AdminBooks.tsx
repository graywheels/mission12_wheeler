import { useEffect, useState } from 'react';
import { type Book } from '../types/Book';
import { deleteBook, updateBook, addBook } from '../api/booksApi';

function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Function to fetch the most recent data from Azure
    const refreshData = async () => {
        try {
            const response = await fetch('https://wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net/api/books?pageSize=100');
            const data = await response.json();
            setBooks(data.books);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => { 
        refreshData(); 
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            await deleteBook(id);
            await refreshData(); // Wait for the refresh to finish
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin: Manage Inventory</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { setEditingBook(null); setShowAddForm(true); }}
                >
                    + Add New Book
                </button>
            </div>

            {/* Form Section */}
            {(showAddForm || editingBook) && (
                <div className="card shadow-sm mb-5">
                    <div className="card-body">
                        <BookForm 
                            book={editingBook} 
                            onSuccess={async () => { 
                                setEditingBook(null); 
                                setShowAddForm(false); 
                                await refreshData(); 
                            }} 
                            onCancel={() => { 
                                setEditingBook(null); 
                                setShowAddForm(false); 
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="table-responsive">
                <table className="table table-hover table-bordered shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(b => (
                            <tr key={b.bookID}>
                                <td>{b.bookID}</td>
                                <td><strong>{b.title}</strong></td>
                                <td>{b.author}</td>
                                <td><span className="badge bg-secondary">{b.category}</span></td>
                                <td>${b.price.toFixed(2)}</td>
                                <td className="text-center">
                                    <button 
                                        className="btn btn-warning btn-sm me-2" 
                                        onClick={() => { setShowAddForm(false); setEditingBook(b); }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => handleDelete(b.bookID)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Sub-component for the Add/Edit Form
function BookForm({ book, onSuccess, onCancel }: any) {
    const initialFormState = {
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0
    };

    const [formData, setFormData] = useState(book || initialFormState);

    // CRITICAL: Update the form fields if the "book" prop changes (e.g., clicking Edit on a different row)
    useEffect(() => {
        setFormData(book || initialFormState);
    }, [book]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (book) {
                await updateBook(book.bookID, formData);
            } else {
                await addBook(formData);
            }
            await onSuccess();
        } catch (error) {
            alert("Error saving book. Check your console and CORS settings.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4 className="mb-3">{book ? `Editing: ${book.title}` : 'Add New Book'}</h4>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Author</label>
                    <input className="form-control" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <input className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Price</label>
                    <input type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">ISBN</label>
                    <input className="form-control" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Publisher</label>
                    <input className="form-control" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Classification</label>
                    <input className="form-control" value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})} required />
                </div>
            </div>
            <div className="mt-4">
                <button type="submit" className="btn btn-success me-2 px-4">Save to Database</button>
                <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default AdminBooks;