import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Don't forget this for styling!
import BookList from './BookList';

function App() {
  return (
    <div className="App">
      <header className="bg-dark text-white p-3 mb-4">
        <div className="container">
          <h1>Bookstore</h1>
        </div>
      </header>
      <main>
        <BookList />
      </main>
    </div>
  );
}

export default App;