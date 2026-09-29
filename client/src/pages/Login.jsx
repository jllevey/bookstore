import FloatingBooks from '../components/FloatingBooks';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, EMAIL_RE } from '../api';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../components/ProtectedRoute';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email)) return setError('Enter a valid email address');
    if (!form.password) return setError('Enter your password');
    setBusy(true);
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: form });
      navigate(homeFor(saveSession(data)), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <FloatingBooks />
      <form className="auth-card" onSubmit={submit} noValidate>
        <h2 className="brand mb-1">jl book store</h2>
        <p className="text-muted">Log in to browse and manage books.</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <label className="form-label">Email</label>
        <input className="form-control mb-3" name="email" type="email" value={form.email} onChange={set} autoComplete="email" />
        <label className="form-label">Password</label>
        <input className="form-control mb-4" name="password" type="password" value={form.password} onChange={set} autoComplete="current-password" />
        <button className="btn btn-brand w-100" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="mt-3 mb-0 text-center small">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </div>
  );
}
