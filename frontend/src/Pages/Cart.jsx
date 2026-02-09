import React, { useContext } from "react";
import { StoreContext } from "../../Context/storeContext";
import CartSummary from "../../Components/CartSummary";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useContext(StoreContext);

  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) return;
    updateCartItemQuantity(productId, qty);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg mb-4">Your cart is empty.</p>
          <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {cart.items.map(item => (
              <div key={item.product} className="flex items-center bg-white rounded-lg shadow p-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded mr-4" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-500">{item.category}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                      onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                    >-</button>
                    <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                      onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <span className="font-semibold text-lg">₹{item.price * item.quantity}</span>
                  <button
                    className="text-red-500 mt-2 hover:underline"
                    onClick={() => removeFromCart(item.product)}
                  >Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <CartSummary />
            <Link
              to="/checkout"
              className="block w-full mt-6 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
