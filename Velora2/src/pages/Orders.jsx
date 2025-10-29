import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-03-15',
        status: 'delivered',
        total: 299.99,
        items: [
          {
            id: '1',
            name: 'Classic White Sneakers',
            quantity: 1,
            price: 149.99,
            image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
          },
          {
            id: '2',
            name: 'Leather Crossbody Bag',
            quantity: 1,
            price: 150.00,
            image: 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg',
          },
        ],
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        date: '2024-03-20',
        status: 'shipped',
        total: 89.99,
        items: [
          {
            id: '3',
            name: 'Minimalist Watch',
            quantity: 1,
            price: 89.99,
            image: 'https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg',
          },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 500);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'processing':
        return <Package className="status-icon processing" />;
      case 'shipped':
        return <Package className="status-icon shipped" />;
      case 'delivered':
        return <CheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <XCircle className="status-icon cancelled" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <Package size={64} />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>{order.orderNumber}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-badge ${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="order-item-details">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-quantity">Quantity: {item.quantity}</p>
                      </div>
                      <p className="order-item-price">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>${order.total.toFixed(2)}</strong>
                  </div>
                  <button
                    className="order-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
              <h2>Order Details</h2>
              <div className="order-modal-content">
                <div className="order-modal-info">
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedOrder.status)}</p>
                </div>
                <div className="order-modal-items">
                  <h3>Items</h3>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="order-modal-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-modal-total">
                  <strong>Total: ${selectedOrder.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
