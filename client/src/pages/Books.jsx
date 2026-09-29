import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Cover from '../components/Cover';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { inr } from '../pricing';

const SPINES = [
  [58, '#7a2432'], [78, '#c9a24b'], [64, '#3b2a5a'], [88, '#0f3b4a'], [70, '#a85a16'], [82, '#f2f4f0'], [60, '#4a3728'],
  [90, '#7a2432'], [68, '#2f4a2f'], [80, '#c9a24b'], [62, '#1f2a44'], [86, '#c9651b'], [72, '#f2f4f0'], [66, '#7a2432']
];

function AddButton({ book }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  if (!book.available) return <button className="btn btn-sm btn-outline-secondary w-100 mt-2" disabled>Out of stock</button>;
  return (
    <button
      className={`btn btn-sm w-100 mt-2 ${done ? 'btn-success' : 'btn-brand'}`}
      onClick={() => { add(book, 1); setDone(true); setTimeout(() => setDone(false), 1200); }}
    >
      {done ? 'Added to cart ✓' : 'Add to cart'}
    </button>
  );
}

export default function Books() {
  const { user } = useAuth();
  const canBuy = user.role === 'User';
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { api('/books/genres').then((g) => setGenres(g.sort())).catch(() => {}); }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (genre) params.set('genre', genre);
      api('/books?' + params).then(setBooks).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q, genre]);

  return (
    <>
      <section className="hero">
        <h2>The reading room</h2>
        <p>Pick a genre, search a title or author, add books to your cart and check out with a clear bill.</p>
        <div className="spines" aria-hidden="true">
          {SPINES.map(([h, c], i) => <span key={i} className="spine" style={{ height: h, background: c, animationDelay: `${0.15 + i * 0.07}s` }} />)}
        </div>
        <div className="hero-shelf" />
      </section>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <input className="form-control" placeholder="Search by title or author" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All genres</option>
            {genres.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="chips mb-4">
        <button className={`chip ${genre === '' ? 'on' : ''}`} onClick={() => setGenre('')}>All</button>
        {genres.map((g) => <button key={g} className={`chip ${genre === g ? 'on' : ''}`} onClick={() => setGenre(g)}>{g}</button>)}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      <p className="text-muted small">{books.length} {books.length === 1 ? 'book' : 'books'} found</p>
      {books.length === 0 && !error && <p className="text-muted">No books match your search. Try a different title, author or genre.</p>}

      <div className="row g-4">
        {books.map((b, i) => (
          <div className="col-6 col-md-4 col-lg-3" key={b._id}>
            <div className="book-tile rise-in" style={{ animationDelay: `${Math.min(i, 12) * 55}ms` }}>
              <Link to={`/books/${b._id}`} className="book-link">
                <div className="cover-wrap"><Cover book={b} /></div>
                <div className="ledge" />
                <div className="meta">
                  <div className="fw-bold title-line">{b.title}</div>
                  <div className="small text-muted">{b.author}</div>
                  <div className="d-flex justify-content-between mt-1">
                    <span>{inr(b.price)}</span>
                    <span className={`small ${b.available ? 'text-success' : 'text-danger'}`}>{b.available ? 'In stock' : 'Out of stock'}</span>
                  </div>
                </div>
              </Link>
              {canBuy && <AddButton book={b} />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
