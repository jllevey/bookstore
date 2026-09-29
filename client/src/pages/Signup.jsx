import FloatingBooks from '../components/FloatingBooks';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, EMAIL_RE, STRONG_RE, PW_HINT } from '../api';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../components/ProtectedRoute';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'User', adminCode: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address';
    if (!STRONG_RE.test(form.password)) e.password = PW_HINT;
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (form.role === 'Admin' && !form.adminCode) e.adminCode = 'Admin code is required';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      const { confirm, ...body } = form;
      const data = await api('/auth/signup', { method: 'POST', body });
      navigate(homeFor(saveSession(data)), { replace: true });
    } catch (err) {
      setServerError(err.message);
    }
  };

  const Field = ({ label, name, type = 'text' }) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input className={`form-control ${errors[name] ? 'is-invalid' : ''}`} name={name} type={type} value={form[name]} onChange={set} />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="auth-wrap">
      <FloatingBooks />
      <form className="auth-card" onSubmit={submit} noValidate>
        <h2 className="brand mb-1">Create your account</h2>
        <p className="text-muted">Join jl book store to browse the collection.</p>
        {serverError && <div className="alert alert-danger py-2">{serverError}</div>}
        {Field({ label: 'Full name', name: 'name' })}
        {Field({ label: 'Email', name: 'email', type: 'email' })}
        {Field({ label: 'Password', name: 'password', type: 'password' })}
        {Field({ label: 'Confirm password', name: 'confirm', type: 'password' })}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={form.role} onChange={set}>
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
        {form.role === 'Admin' && Field({ label: 'Admin code', name: 'adminCode', type: 'password' })}
        <button className="btn btn-brand w-100">Sign up</button>
        <p className="mt-3 mb-0 text-center small">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
