import { useEffect, useState } from 'react';

// Fallback binding colours per genre, used until (or unless) a real cover image is found.
const PALETTE = {
  Fiction: ['#17352e', '#c9a24b'], Fantasy: ['#3b2a5a', '#e0c36a'], Mystery: ['#1f2a44', '#d9d9d9'],
  'Sci-Fi': ['#0f3b4a', '#7fe0d0'], Romance: ['#7a2432', '#f3d9c4'], 'Self-Help': ['#a85a16', '#fff3d6'],
  Biography: ['#4a3728', '#e8d5a9'], History: ['#5b4a2e', '#f0e2b6'], Science: ['#12304d', '#9ad0ff'],
  Technology: ['#1c1c28', '#5ee0a0'], Business: ['#2f4a2f', '#f3e6b0'], Children: ['#c9651b', '#ffffff']
};
export const colorsFor = (genre) => PALETTE[genre] || ['#17352e', '#c9a24b'];

// --- Cover lookup on Open Library (free), a few requests at a time, remembered in the browser ---
const memory = new Map();
const queue = [];
let active = 0;
function pump() {
  while (active < 4 && queue.length) {
    active += 1;
    queue.shift()();
  }
}
function limited(task) {
  return new Promise((resolve) => {
    queue.push(() => {
      task().then(resolve, () => resolve(undefined)).finally(() => { active -= 1; pump(); });
    });
    pump();
  });
}

async function findCoverId(book) {
  const key = `coverid:${book.title}|${book.author}`;
  if (memory.has(key)) return memory.get(key);
  try {
    const saved = localStorage.getItem(key);
    if (saved) { memory.set(key, saved); return saved; }
  } catch { /* storage blocked */ }

  const id = await limited(async () => {
    const q = new URLSearchParams({ title: book.title, author: book.author.split(' and ')[0], limit: '1', fields: 'cover_i' });
    const res = await fetch('https://openlibrary.org/search.json?' + q);
    if (!res.ok) throw new Error('lookup failed');
    const data = await res.json();
    return data.docs?.[0]?.cover_i ? String(data.docs[0].cover_i) : null;
  });
  memory.set(key, id || null);
  if (id) { try { localStorage.setItem(key, id); } catch { /* ignore */ } }
  return id || null;
}

export default function Cover({ book, size = 'M', className = '' }) {
  const [src, setSrc] = useState(book.coverUrl || null);
  const [bad, setBad] = useState(false);

  useEffect(() => {
    let live = true;
    setBad(false);
    if (book.coverUrl) { setSrc(book.coverUrl); return undefined; }
    setSrc(null);
    findCoverId(book).then((id) => { if (live && id) setSrc(`https://covers.openlibrary.org/b/id/${id}-${size}.jpg?default=false`); });
    return () => { live = false; };
  }, [book._id, book.coverUrl, book.title, book.author, size]);

  const [bg, fg] = colorsFor(book.genre);
  return (
    <div className={`cover-box ${className}`}>
      <div className="cover-fallback" style={{ background: `linear-gradient(135deg, ${bg}, ${bg}e6)`, color: fg, borderLeftColor: fg }}>
        <span className="cf-genre">{book.genre}</span>
        <span className="cf-title">{book.title}</span>
        <span className="cf-rule" style={{ background: fg }} />
        <span className="cf-author">{book.author}</span>
      </div>
      {src && !bad && (
        <img src={src} alt={`Cover of ${book.title}`} className="cover-img cover-fade" loading="lazy" onError={() => setBad(true)} />
      )}
    </div>
  );
}
