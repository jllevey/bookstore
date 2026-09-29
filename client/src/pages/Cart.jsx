import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Cover from '../components/Cover';
import { useCart } from '../context/CartContext';
import { inr, money, summarize } from '../pricing';

export default function Cart() {
  const { items, setQty, remove, sync } = useCart();
  const [pricing, setPricing] = useState(null);
  const refreshed = useRef(false);

  useEffect(() => { api('/orders/pricing').then(setPricing).catch(() => {}); }, []);

  // Once per visit, refresh prices and stock from the store so the bill is never out of date.
  useEffect(() => {
    if (refreshed.current || items.length === 0) return;
    refreshed.current = true;
    Promise.all(
      items.map((i) =>
        api(`/books/${i.id}`).then(
          (b) => ({ ...i, title: b.title, author: b.author, price: b.price, stock: b.stock, qty: Math.min(i.qty, b.stock) }),
          () => null
        )
      )
    ).then((list) => sync(list.filter((i) => i && i.qty > 0)));
  }, [items]);

  const s = summarize(items, pricing);

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>Your cart is empty</h3>
        <p className="text-muted">Add a few books and they will show up here.</p>
        <Link to="/books" className="btn btn-brand">Browse books</Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-3">Your cart</h2>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {items.map((i) => (
            <div className="cart-item d-flex gap-3 align-items-center mb-3 p-3" key={i.id}>
              <div className="cart-thumb"><Cover book={{ _id: i.id, title: i.title, author: i.author, genre: i.genre, coverUrl: i.coverUrl }} /></div>
              <div className="flex-grow-1">
                <div className="fw-bold">{i.title}</div>
                <div className="small text-muted">{i.author}</div>
                <div className="small">{inr(i.price)} each</div>
                <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
                  <div className="qty">
                    <button type="button" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Fewer">−</button>
                    <span>{i.qty}</span>
                    <button type="button" onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= i.stock} aria-label="More">+</button>
                  </div>
                  <button className="btn btn-link btn-sm text-danger p-0" onClick={() => remove(i.id)}>Remove</button>
                  {i.qty >= i.stock && <span className="small text-muted">Only {i.stock} in stock</span>}
                </div>
              </div>
              <div className="fw-bold text-nowrap">{money(i.price * i.qty)}</div>
            </div>
          ))}
        </div>

        <div className="col-12 col-lg-4">
          <div className="summary p-3">
            <h5>Order summary</h5>
            <div className="d-flex justify-content-between"><span>Books</span><span>{money(s.subtotal)}</span></div>
            <div className="d-flex justify-content-between"><span>Delivery</span><span>{s.delivery === 0 ? 'Free' : money(s.delivery)}</span></div>
            <div className="d-flex justify-content-between"><span>Tax ({Math.round(s.rate * 100)}%)</span><span>{money(s.tax)}</span></div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{money(s.total)}</span></div>
            {pricing && s.delivery > 0 && <p className="small text-muted mt-2 mb-0">Add {inr(pricing.freeDeliveryOver - s.subtotal)} more for free delivery.</p>}
            <Link to="/checkout" className="btn btn-brand w-100 mt-3">Proceed to checkout</Link>
          </div>
        </div>
      </div>
    </>
  );
}
