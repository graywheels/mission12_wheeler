import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const { cart, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h3>Your Shopping Cart</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.bookID}>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.bookID)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light border rounded">
                <h4>Total: ${total.toFixed(2)}</h4>
                <div>
                    {/* Return to previous page */}
                    <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>Continue Shopping</button>
                    <button className="btn btn-primary" onClick={() => { alert("Checkout logic not implemented"); clearCart(); }}>Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;