import { useEffect, useState } from 'react';
import { type Book } from '../types/Book';
import { deleteBook, updateBook, addBook } from '../api/booksApi';

function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const refreshData = () => {
        fetch('http://localhost:5067/api/books?pageSize=100')
            .then(res => res.json())
            .then(data => setBooks(data.books));
    };

    useEffect(() => { refreshData(); }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure?")) {
            await deleteBook(id);
            refreshData();
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Admin: Manage Books</h2>
                <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>Add New Book</button>
            </div>

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
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(b => (
                        <tr key={b.bookID}>
                            <td>{b.bookID}</td>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.category}</td>
                            <td>${b.price.toFixed(2)}</td>
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

// Internal Form Component for Add/Edit
function BookForm({ book, onSuccess, onCancel }: any) {
    const [formData, setFormData] = useState(book || { title: '', author: '', publisher: '', isbn: '', classification: '', category: '', pageCount: 0, price: 0 });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            <div className="row">
                <div className="col-md-6 mb-2">
                    <label>Title</label>
                    <input className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-2">
                    <label>Author</label>
                    <input className="form-control" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                </div>
            </div>
            {/* Add other fields (Category, Price, etc.) here similarly */}
            <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default AdminBooks;