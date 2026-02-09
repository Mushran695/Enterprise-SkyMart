import React, { useContext } from "react";
import { StoreContext } from "../../Context/storeContext";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const RightSideOrder = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  const handleDecrease = (item) => {
    if ((item.qty || 1) > 1) {
      // Decrease quantity
      addToCart({ ...item, qty: (item.qty || 1) - 1 });
    } else {
      removeFromCart(item._id);
    }
  };

  const handleIncrease = (item) => {
    addToCart({ ...item, qty: (item.qty || 1) + 1 });
  };

  const handleViewCart = () => {
    onClose && onClose();
    navigate("/cart");
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-full max-w-xs h-full bg-white shadow-lg z-50 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ width: 360 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-lg">My Order</h2>
        <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={onClose} />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-4">
              <div className="flex gap-3">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="px-2 py-1 border rounded"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span>{item.qty || 1}</span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="px-2 py-1 border rounded"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="font-medium">₹{(item.price * (item.qty || 1)).toFixed(2)}</p>
                <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={() => removeFromCart(item._id)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-white">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-medium">₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleViewCart}
          disabled={cart.length === 0}
          className="w-full bg-black text-white py-3 rounded disabled:bg-gray-400"
        >
          View Cart
        </button>
      </div>
    </aside>
  );
};

export default RightSideOrder;
