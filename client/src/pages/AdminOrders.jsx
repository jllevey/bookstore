import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { money } from '../pricing';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api('/orders').then(setOrders).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h2 className="mb-3">Orders</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Order</th><th>Customer</th><th>Books</th><th>Total</th><th>Placed</th><th className="text-end">Bill</th></tr></thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No orders yet.</td></tr>}
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.orderNo}</td>
                <td>{o.customer.name}<div className="small text-muted">{o.user?.email}</div></td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>{money(o.total)}</td>
                <td className="text-nowrap">{new Date(o.createdAt).toLocaleString('en-IN')}</td>
                <td className="text-end"><Link className="btn btn-sm btn-outline-dark" to={`/orders/${o._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
