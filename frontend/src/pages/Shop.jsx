import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const goToCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  return (
    <div className="container">
      <h2>Welcome to QA Dojo Store</h2>
      <div className="cart-summary">
        <span data-testid="cart-count">🛒 Cart: {cart.length}</span>
        <button className="checkout-button" onClick={goToCheckout} data-testid="go-to-checkout">
          Checkout
        </button>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card" data-testid={`product-${product.id}`}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)} data-testid={`add-to-cart-${product.id}`}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
