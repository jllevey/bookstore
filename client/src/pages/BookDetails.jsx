import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import Cover from '../components/Cover';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { inr } from '../pricing';

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add, count } = useCart();
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { api(`/books/${id}`).then(setBook).catch((e) => setError(e.message)); }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!book) return <p className="text-muted">Loading…</p>;
  const canBuy = user.role === 'User';

  return (
    <>
      <Link to="/books" className="d-inline-block mb-3">Back to books</Link>
      <div className="row g-4">
        <div className="col-12 col-md-4"><div className="cover-wrap"><Cover book={book} size="L" /></div></div>
        <div className="col-12 col-md-8">
          <h2>{book.title}</h2>
          <p className="text-muted">by {book.author}</p>
          <p>
            <span className="badge text-bg-dark me-2">{book.genre}</span>
            <span className={`badge text-bg-${book.available ? 'success' : 'danger'}`}>{book.available ? `${book.stock} in stock` : 'Out of stock'}</span>
          </p>
          <h4>{inr(book.price)}</h4>
          <p className="mt-3">{book.description || 'No description has been added for this book yet.'}</p>

          {canBuy && book.available && (
            <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
              <div className="qty">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer">−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(book.stock, qty + 1))} aria-label="More">+</button>
              </div>
              <button className={`btn ${added ? 'btn-success' : 'btn-brand'}`} onClick={() => { add(book, qty); setAdded(true); setTimeout(() => setAdded(false), 1400); }}>
                {added ? 'Added to cart ✓' : 'Add to cart'}
              </button>
              {count > 0 && <Link to="/cart" className="btn btn-outline-dark">Go to cart ({count})</Link>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
