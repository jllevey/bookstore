import { useEffect, useState } from 'react';
import { api, EMAIL_RE, STRONG_RE, PW_HINT } from '../api';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', email: '', password: '', role: 'User', active: true };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api('/users').then(setUsers).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email)) return setError('Enter a name and a valid email');
    if (!editId && !STRONG_RE.test(form.password)) return setError(PW_HINT);
    try {
      const body = editId
        ? { name: form.name, email: form.email, role: form.role, active: form.active }
        : form;
      await api(editId ? `/users/${editId}` : '/users', { method: editId ? 'PUT' : 'POST', body });
      setForm(null);
      setError('');
      load();
    } catch (err) { setError(err.message); }
  };

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name}? Their account will be deleted.`)) return;
    try { await api(`/users/${u._id}`, { method: 'DELETE' }); load(); } catch (err) { setError(err.message); }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">User management</h2>
        <button className="btn btn-brand" onClick={() => { setForm(empty); setEditId(null); setError(''); }}>Add user</button>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {form && (
        <form className="card card-body mb-4" onSubmit={save}>
          <h5>{editId ? 'Update user' : 'Add a new user'}</h5>
          <div className="row g-3">
            <div className="col-md-6"><input className="form-control" name="name" placeholder="Full name" value={form.name} onChange={set} /></div>
            <div className="col-md-6"><input className="form-control" name="email" placeholder="Email" value={form.email} onChange={set} /></div>
            {!editId && <div className="col-md-4"><input className="form-control" type="password" name="password" placeholder="Temporary password" value={form.password} onChange={set} /></div>}
            <div className="col-md-4">
              <select className="form-select" name="role" value={form.role} onChange={set}><option>User</option><option>Admin</option></select>
            </div>
            {editId && (
              <div className="col-md-4">
                <select className="form-select" value={form.active ? 'true' : 'false'} onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}>
                  <option value="true">Active</option><option value="false">Inactive</option>
                </select>
              </div>
            )}
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-brand">{editId ? 'Save changes' : 'Add user'}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td><span className={`badge text-bg-${u.active ? 'success' : 'secondary'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                <td className="text-end text-nowrap">
                  <button className="btn btn-sm btn-outline-dark me-2" onClick={() => { setForm({ ...u }); setEditId(u._id); setError(''); }}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" disabled={u._id === me.id} onClick={() => remove(u)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
