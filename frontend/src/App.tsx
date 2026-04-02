import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import BookList from './BookList';
import CartPage from './Pages/CartPage'; 
import AdminBooks from './Pages/AdminBooks';

function App() {
  return (
    <div className="App">
      <header className="bg-dark text-white p-3 mb-4">
        <div className="container">
          <h1>Bookstore</h1>
        </div>
      </header>
      <main>
        {/* Define the navigation map */}
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