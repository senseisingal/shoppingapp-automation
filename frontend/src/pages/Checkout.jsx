import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const cart = location?.state?.cart || [];
  const [card, setCard] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const confirmOrder = async () => {
    setError('');
    setLoading(true);

    if (card.length !== 16 || !/^[0-9]+$/.test(card)) {
      setError('Invalid card number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cart, total }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place order');
      }

      navigate('/confirm');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div className="cart-list">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </div>
        ))}
        <div className="cart-total">
          <strong>Total:</strong>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <input
        type="text"
        placeholder="Credit Card Number"
        value={card}
        onChange={(e) => setCard(e.target.value)}
        maxLength={16}
        data-testid="card-input"
      />
      <button onClick={confirmOrder} disabled={loading} data-testid="confirm-order">
        {loading ? 'Placing Order...' : 'Confirm Order'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
