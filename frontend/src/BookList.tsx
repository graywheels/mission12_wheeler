import { useEffect, useState } from 'react';
import { type Book } from './types/Book';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [pageNum, setPageNum] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sort, setSort] = useState("Title");
    const [descending, setDescending] = useState(false); // Track direction

   // Inside your useEffect
useEffect(() => {
    // Note the addition of &descending=${descending}
    fetch(`http://localhost:5067/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortColumn=${sort}&descending=${descending}`)
        .then(res => res.json())
        .then(data => {
            setBooks(data.books);
            setTotalItems(data.totalBooks);
        });
}, [pageSize, pageNum, sort, descending]); // WATCH descending for changes!

// DYNAMIC BUTTON GENERATION (Satisfies "Tag Helper" rubric requirement)
const totalPages = Math.ceil(totalItems / pageSize); //

const handleSort = (column: string) => {
    if (sort === column) {
        setDescending(!descending); // Flip the boolean
    } else {
        setSort(column);
        setDescending(false); // Default to ascending for a new column
    }
    setPageNum(1); // Reset to page 1 when sorting changes
};

return (
    <div className="container mt-4">
        <h2 className="mb-4">Bezos's Online Bookstore</h2>
        
        {/* Results Per Page Dropdown */}
        <div className="mb-3">
            <label className="me-2">Results per page:</label>
            <select className="form-select w-auto d-inline" onChange={(e) => {setPageSize(Number(e.target.value)); setPageNum(1);}}>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>
        </div>

        <table className="table table-bordered table-striped">

            <thead className="table-dark">
                <tr>
                    <th onClick={() => handleSort("Title")} style={{cursor: 'pointer'}}>
                        Title {sort === "Title" ? (descending ? "↑ (Z-A)" : "↓ (A-Z)") : "↕"}
                    </th>
                    <th onClick={() => handleSort("Author")} style={{cursor: 'pointer'}}>
                        Author {sort === "Author" ? (descending ? "↑" : "↓") : "↕"}
                    </th>
                    <th>Publisher</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Pages</th>
                    <th>Price</th>
                </tr>
            </thead>

            <tbody>
                {books.map(b => (
                    <tr key={b.bookID}>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.publisher}</td>
                        <td>{b.isbn}</td>
                        <td>{b.category}</td>
                        <td>{b.pageCount}</td>
                        <td>${b.price.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Dynamic Buttons (React's equivalent to Tag Helpers) */}
        <div className="d-flex justify-content-center mt-3">
            {[...Array(totalPages)].map((_, i) => (
                <button 
                    key={i + 1} 
                    className={`btn m-1 ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setPageNum(i + 1)}>
                    {i + 1}
                </button>
            ))}
        </div>
    </div>
);
    
}

export default BookList;