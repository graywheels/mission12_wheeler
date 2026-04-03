import { useEffect, useState } from 'react';

function CategoryFilter({ selectedCategory, onCategoryChange }: any) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetch('https://wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net/api/books/categories')
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);

    return (
        <div className="list-group">
            <button 
                className={`list-group-item list-group-item-action ${!selectedCategory ? 'active' : ''}`}
                onClick={() => onCategoryChange(null)}>
                All Categories
            </button>
            {categories.map(cat => (
                <button 
                    key={cat}
                    className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => onCategoryChange(cat)}>
                    {cat}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;