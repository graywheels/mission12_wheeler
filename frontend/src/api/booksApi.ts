const API_URL = 'wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net';


export const addBook = async (book: any) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    return response.json();
};

export const updateBook = async (id: number, book: any) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    return response.json();
};

export const deleteBook = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};