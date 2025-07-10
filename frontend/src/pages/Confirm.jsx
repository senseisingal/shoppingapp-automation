import React from 'react';

export default function Confirm() {
  return (
    <div className="container text-center">
      <h2>Order Confirmed!</h2>
      <p className="success-text" data-testid="order-success">
        🎉 Thank you for your purchase at QA Dojo Store.
      </p>
      <p>We are processing your order and will notify you via email shortly.</p>
    </div>
  );
}
