import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../brand';
import { money } from '../pricing';

export default function Invoice() {
  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const [o, setO] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api(`/orders/${id}`).then(setO).catch((e) => setError(e.message)); }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!o) return <p className="text-muted">Loading your bill…</p>;
  const rate = o.subtotal ? Math.round((o.tax / o.subtotal) * 100) : 0;

  return (
    <>
      {state?.placed && (
        <div className="alert alert-success no-print">
          Your order is placed. Here is your bill. You can print it or save it as a PDF.
        </div>
      )}
      <div className="invoice p-4 mx-auto">
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h3 className="brand mb-0">{BRAND}</h3>
            <div className="text-muted small">Bill / Invoice</div>
          </div>
          <div className="text-md-end">
            <div className="fw-bold">{o.orderNo}</div>
            <div className="small text-muted">{new Date(o.createdAt).toLocaleString('en-IN')}</div>
            <div className="small">Status: {o.status}</div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-6">
            <div className="small text-muted">Billed to</div>
            <div className="fw-bold">{o.customer.name}</div>
            <div>{o.customer.phone}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{o.customer.address}</div>
          </div>
          <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
            <div className="small text-muted">Payment</div>
            <div className="fw-bold">{o.paymentMethod}</div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>#</th><th>Book</th><th className="text-end">Price</th><th className="text-end">Qty</th><th className="text-end">Amount</th></tr></thead>
            <tbody>
              {o.items.map((i, n) => (
                <tr key={i.book || n}>
                  <td>{n + 1}</td>
                  <td>{i.title}<div className="small text-muted">{i.author}</div></td>
                  <td className="text-end">{money(i.price)}</td>
                  <td className="text-end">{i.qty}</td>
                  <td className="text-end">{money(i.price * i.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ms-auto" style={{ maxWidth: 320 }}>
          <div className="d-flex justify-content-between"><span>Books total</span><span>{money(o.subtotal)}</span></div>
          <div className="d-flex justify-content-between"><span>Delivery</span><span>{o.delivery === 0 ? 'Free' : money(o.delivery)}</span></div>
          <div className="d-flex justify-content-between"><span>Tax ({rate}%)</span><span>{money(o.tax)}</span></div>
          <hr />
          <div className="d-flex justify-content-between fw-bold fs-4"><span>Total</span><span>{money(o.total)}</span></div>
        </div>
        <p className="text-center text-muted small mt-4 mb-0">Thank you for shopping at {BRAND}.</p>
      </div>

      <div className="d-flex gap-2 justify-content-center mt-3 no-print flex-wrap">
        <button className="btn btn-brand" onClick={() => window.print()}>Print bill</button>
        <Link to={user.role === 'Admin' ? '/admin/orders' : '/orders'} className="btn btn-outline-dark">{user.role === 'Admin' ? 'All orders' : 'My orders'}</Link>
        {user.role === 'User' && <Link to="/books" className="btn btn-outline-dark">Continue shopping</Link>}
      </div>
    </>
  );
}
