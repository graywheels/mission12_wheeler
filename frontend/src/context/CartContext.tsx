import { createContext, useContext, useState, type ReactNode } from 'react';
import { type CartItem } from '../types/CartItem';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookID: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.bookID === newItem.bookID);
            if (existingItem) {
                // Update quantity if book already exists
                return prevCart.map(i => 
                    i.bookID === newItem.bookID 
                    ? { ...i, quantity: i.quantity + 1 } 
                    : i
                );
            }
            return [...prevCart, newItem];
        });
    };

    const removeFromCart = (bookID: number) => {
        setCart(prev => prev.filter(i => i.bookID !== bookID));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};