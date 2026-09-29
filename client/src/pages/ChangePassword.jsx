import { useState } from 'react';
import { api, STRONG_RE, PW_HINT } from '../api';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!STRONG_RE.test(form.newPassword)) return setMsg({ type: 'danger', text: PW_HINT });
    if (form.newPassword !== form.confirm) return setMsg({ type: 'danger', text: 'New passwords do not match' });
    try {
      await api('/auth/change-password', { method: 'PUT', body: { currentPassword: form.currentPassword, newPassword: form.newPassword } });
      setMsg({ type: 'success', text: 'Password updated' });
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setMsg({ type: 'danger', text: err.message });
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 440 }}>
      <h3 className="mb-3">Change password</h3>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      <form onSubmit={submit}>
        <label className="form-label">Current password</label>
        <input className="form-control mb-3" type="password" name="currentPassword" value={form.currentPassword} onChange={set} />
        <label className="form-label">New password</label>
        <input className="form-control mb-3" type="password" name="newPassword" value={form.newPassword} onChange={set} />
        <label className="form-label">Confirm new password</label>
        <input className="form-control mb-4" type="password" name="confirm" value={form.confirm} onChange={set} />
        <button className="btn btn-brand">Save password</button>
      </form>
    </div>
  );
}
