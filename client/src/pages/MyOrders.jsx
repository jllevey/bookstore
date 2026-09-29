import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { money } from '../pricing';

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/orders/mine').then(setOrders).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h2 className="mb-3">My orders</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {orders && orders.length === 0 && (
        <p className="text-muted">You have not placed any orders yet. <Link to="/books">Browse books</Link></p>
      )}
      <div className="row g-3">
        {orders?.map((o) => (
          <div className="col-12 col-md-6" key={o._id}>
            <div className="summary p-3">
              <div className="d-flex justify-content-between">
                <span className="fw-bold">{o.orderNo}</span>
                <span className="badge text-bg-success">{o.status}</span>
              </div>
              <div className="small text-muted">{new Date(o.createdAt).toLocaleString('en-IN')}</div>
              <div className="mt-2 small">{o.items.map((i) => `${i.title} × ${i.qty}`).join(', ')}</div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="fw-bold">{money(o.total)}</span>
                <Link to={`/orders/${o._id}`} className="btn btn-sm btn-outline-dark">View bill</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
