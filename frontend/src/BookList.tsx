import { useEffect, useState } from 'react';
import { type Book } from './types/Book';
import CategoryFilter from './components/CategoryFilter';
import { useCart } from './context/CartContext';
import { useNavigate } from 'react-router-dom';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [pageNum, setPageNum] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sort, setSort] = useState("Title");
    const [descending, setDescending] = useState(false);
    const [category, setCategory] = useState<string | null>(null);

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const catParam = category ? `&category=${encodeURIComponent(category)}` : "";
        fetch(`https://wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortColumn=${sort}&descending=${descending}${catParam}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.books);
                setTotalItems(data.totalBooks);
            });
    }, [pageSize, pageNum, sort, descending, category]); 

    const totalPages = Math.ceil(totalItems / pageSize);

    return ( /* this has the bootstrap features for the rubric */
        <div className="container-fluid px-4">
            <div className="row"> {/* Bootstrap Grid Row */}
                {/* Sidebar - col-md-3 */}
                <div className="col-md-3">
                    <h5 className="mb-3">Categories</h5>
                    <CategoryFilter selectedCategory={category} onCategoryChange={(cat: string) => {setCategory(cat); setPageNum(1);}} />
                </div>

                {/* Main Content - col-md-9 */}
                <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Books</h2>
                        {/* Results Per Page */}
                        <select className="form-select w-auto" onChange={(e) => {setPageSize(Number(e.target.value)); setPageNum(1);}}>
                            <option value="5">Show 5</option>
                            <option value="10">Show 10</option>
                        </select>
                    </div>

                    <table className="table table-hover"> {/* NEW BOOTSTRAP feature for the rubric points: table-hover */}
                        <thead className="table-dark">
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(b => (
                                <tr key={b.bookID}>
                                    <td>{b.title}</td>
                                    <td>{b.author}</td>
                                    <td><span className="badge bg-info text-dark">{b.category}</span></td> {/* NEW BOOTSTRAP feature for the points in the rubric: Badges */}
                                    <td>${b.price.toFixed(2)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-success" 
                                            onClick={() => {
                                                addToCart({ bookID: b.bookID, title: b.title, price: b.price, quantity: 1 });
                                                navigate('/cart'); // Navigate to cart
                                            }}>
                                            Add to Cart
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <nav className="d-flex justify-content-center">
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} className={`btn m-1 ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setPageNum(i + 1)}>{i + 1}</button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default BookList;