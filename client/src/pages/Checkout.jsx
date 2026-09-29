import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { money, summarize } from '../pricing';

const METHODS = ['Cash on delivery', 'UPI (demo)', 'Card (demo)'];

export default function Checkout() {
  const { user } = useAuth();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [pricing, setPricing] = useState(null);
  const [form, setForm] = useState({ name: user.name, phone: '', address: '', payment: METHODS[0] });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => { api('/orders/pricing').then(setPricing).catch(() => {}); }, []);
  if (items.length === 0 && !busy) return <Navigate to="/cart" replace />;
  const s = summarize(items, pricing);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return setError('Enter your name and delivery address');
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) return setError('Enter a valid phone number');
    setBusy(true);
    setError('');
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: {
          items: items.map((i) => ({ bookId: i.id, qty: i.qty })),
          customer: { name: form.name, phone: form.phone, address: form.address },
          paymentMethod: form.payment
        }
      });
      clear();
      navigate(`/orders/${order._id}`, { replace: true, state: { placed: true } });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <>
      <h2 className="mb-3">Checkout</h2>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="card card-body" onSubmit={submit} noValidate>
            <h5>Delivery details</h5>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <label className="form-label">Full name</label>
            <input className="form-control mb-3" name="name" value={form.name} onChange={set} />
            <label className="form-label">Phone number</label>
            <input className="form-control mb-3" name="phone" value={form.phone} onChange={set} inputMode="tel" />
            <label className="form-label">Delivery address</label>
            <textarea className="form-control mb-3" rows="3" name="address" value={form.address} onChange={set} />
            <label className="form-label">Payment method</label>
            <div className="mb-2">
              {METHODS.map((m) => (
                <div className="form-check" key={m}>
                  <input className="form-check-input" type="radio" name="payment" id={m} value={m} checked={form.payment === m} onChange={set} />
                  <label className="form-check-label" htmlFor={m}>{m}</label>
                </div>
              ))}
            </div>
            <p className="small text-muted">Demo project: no real payment is taken and no card details are asked for.</p>
            <div className="d-flex gap-2">
              <button className="btn btn-brand" disabled={busy}>{busy ? 'Placing order…' : `Place order · ${money(s.total)}`}</button>
              <Link to="/cart" className="btn btn-outline-secondary">Back to cart</Link>
            </div>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="summary p-3">
            <h5>Your books</h5>
            {items.map((i) => (
              <div className="d-flex justify-content-between small mb-1" key={i.id}>
                <span>{i.title} × {i.qty}</span><span>{money(i.price * i.qty)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between"><span>Books</span><span>{money(s.subtotal)}</span></div>
            <div className="d-flex justify-content-between"><span>Delivery</span><span>{s.delivery === 0 ? 'Free' : money(s.delivery)}</span></div>
            <div className="d-flex justify-content-between"><span>Tax ({Math.round(s.rate * 100)}%)</span><span>{money(s.tax)}</span></div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{money(s.total)}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
