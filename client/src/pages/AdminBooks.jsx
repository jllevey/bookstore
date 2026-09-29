import { useEffect, useState } from 'react';
import { api } from '../api';

const empty = { title: '', author: '', genre: '', price: '', stock: '', description: '', coverUrl: '' };

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(null); // null = closed
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api('/books').then(setBooks).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setForm(empty); setEditId(null); setError(''); };
  const openEdit = (b) => { setForm({ ...empty, ...b }); setEditId(b._id); setError(''); };

  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      await api(editId ? `/books/${editId}` : '/books', { method: editId ? 'PUT' : 'POST', body });
      setForm(null);
      load();
    } catch (err) { setError(err.message); }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
    try { await api(`/books/${b._id}`, { method: 'DELETE' }); load(); } catch (err) { setError(err.message); }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Book operations</h2>
        <button className="btn btn-brand" onClick={openAdd}>Add book</button>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {form && (
        <form className="card card-body mb-4" onSubmit={save}>
          <h5>{editId ? 'Update book' : 'Add a new book'}</h5>
          <div className="row g-3">
            <div className="col-md-6"><input required className="form-control" name="title" placeholder="Title" value={form.title} onChange={set} /></div>
            <div className="col-md-6"><input required className="form-control" name="author" placeholder="Author" value={form.author} onChange={set} /></div>
            <div className="col-md-4"><input required className="form-control" name="genre" placeholder="Genre" value={form.genre} onChange={set} /></div>
            <div className="col-6 col-md-4"><input required min="0" type="number" className="form-control" name="price" placeholder="Price (₹)" value={form.price} onChange={set} /></div>
            <div className="col-6 col-md-4"><input required min="0" type="number" className="form-control" name="stock" placeholder="Copies in stock" value={form.stock} onChange={set} /></div>
            <div className="col-12"><input className="form-control" name="coverUrl" placeholder="Cover image URL (optional)" value={form.coverUrl} onChange={set} /></div>
            <div className="col-12"><textarea rows="3" className="form-control" name="description" placeholder="Description" value={form.description} onChange={set} /></div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-brand">{editId ? 'Save changes' : 'Add book'}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>Price</th><th>Stock</th><th className="text-end">Actions</th></tr></thead>
          <tbody>
            {books.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No books yet. Use “Add book” to create one.</td></tr>}
            {books.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>₹{b.price}</td>
                <td>{b.stock > 0 ? b.stock : <span className="badge text-bg-danger">Out of stock</span>}</td>
                <td className="text-end text-nowrap">
                  <button className="btn btn-sm btn-outline-dark me-2" onClick={() => openEdit(b)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(b)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
