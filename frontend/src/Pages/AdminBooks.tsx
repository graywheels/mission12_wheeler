import { useEffect, useState } from 'react';
import { type Book } from '../types/Book';
import { deleteBook, updateBook, addBook } from '../api/booksApi';

function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const refreshData = () => {
        fetch('https://wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net/api/books?pageSize=100')
            .then(res => res.json())
            .then(data => setBooks(data.books));
    };

    useEffect(() => { refreshData(); }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this book?")) { // Defensive confirmation
            await deleteBook(id);
            refreshData(); // Refresh list after deletion
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Admin: Manage Books</h2>
                <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>Add New Book</button>
            </div>

            {/* Conditional Rendering: Show form only if adding or editing */}
            {(showAddForm || editingBook) && (
                <BookForm 
                    book={editingBook} 
                    onSuccess={() => { setEditingBook(null); setShowAddForm(false); refreshData(); }} 
                    onCancel={() => { setEditingBook(null); setShowAddForm(false); }}
                />
            )}

            <table className="table table-striped table-bordered mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(b => (
                        <tr key={b.bookID}>
                            <td>{b.bookID}</td>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => setEditingBook(b)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.bookID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function BookForm({ book, onSuccess, onCancel }: any) {
    // Two-way data binding: link value to state
    const [formData, setFormData] = useState(book || { title: '', author: '', publisher: '', isbn: '', classification: '', category: '', pageCount: 0, price: 0 });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Stop page reload
        if (book) {
            await updateBook(book.bookID, formData);
        } else {
            await addBook(formData);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light mb-4">
            <h4>{book ? 'Edit Book' : 'Add New Book'}</h4>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Author</label>
                    <input className="form-control" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                </div>
                {/* Repeat pattern for other required fields like Category, ISBN, Price */}
            </div>
            <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default AdminBooks;