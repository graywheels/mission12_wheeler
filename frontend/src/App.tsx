import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'; // Add this
import BookList from './BookList';
import CartPage from './Pages/CartPage'; // Import your new CartPage

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
        </Routes>
      </main>
    </div>
  );
}

export default App;