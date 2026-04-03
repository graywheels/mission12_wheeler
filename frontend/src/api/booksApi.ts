const API_URL = 'https://wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net/api/books';

export const addBook = async (book: any) => {
    const response = await fetch(API_URL, {
        method: 'POST', // Use POST for creating new entries
        headers: { 'Content-Type': 'application/json' }, // Tell backend to expect JSON
        body: JSON.stringify(book) // Convert object to string
    });
    return response.json();
};

export const updateBook = async (id: number, book: any) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // Use PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    return response.json();
};

export const deleteBook = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); // Standard DELETE request
};