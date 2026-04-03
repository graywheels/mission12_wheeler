import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link } from 'react-router-dom';
import BookList from './BookList';
import CartPage from './Pages/CartPage'; 
import AdminBooks from './Pages/AdminBooks';

// 1. Navbar is defined here
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        {/* Removed 'border-0' as it's not a standard Link prop */}
        <Link className="navbar-brand" to="/">Wheeler Bookstore</Link>
        <div className="navbar-nav ms-auto"> {/* Added ms-auto to push links to the right */}
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/cart">Cart</Link>
          
          {/* THE ADMIN BUTTON FOR THE TA */}
          <Link className="btn btn-outline-warning ms-lg-3" to="/adminbooks">
            Admin Panel (CRUD)
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      {/* 2. Place Navbar here so it shows on every page */}
      <Navbar /> 

      <main className="container"> {/* Added container for better spacing */}
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;