import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import CountUp from '../components/CountUp';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/stats').then(setStats).catch(() => {}); }, []);

  const tiles = stats && [
    ['Books in catalogue', stats.books, ''],
    ['Registered users', stats.users, ''],
    ['Orders placed', stats.orders, ''],
    ['Revenue', Math.round(stats.revenue), '₹'],
    ['Out of stock', stats.outOfStock, '']
  ];

  return (
    <>
      <h2 className="mb-1">Store overview</h2>
      <p className="text-muted">Manage the catalogue, the orders and the people who use the store.</p>

      <div className="row row-cols-2 row-cols-lg-5 g-3 mb-4">
        {tiles?.map(([label, value, prefix]) => (
          <div className="col" key={label}>
            <div className="stat"><div className="stat-num">{prefix}<CountUp to={value} /></div><div>{label}</div></div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <h5>Recent activity</h5>
          <ul className="list-group">
            {stats?.recent.length === 0 && <li className="list-group-item text-muted">Nothing yet. Add a book to get started.</li>}
            {stats?.recent.map((a) => (
              <li key={a._id} className="list-group-item d-flex justify-content-between flex-wrap gap-1">
                <span>{a.message}</span>
                <small className="text-muted">{new Date(a.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-12 col-lg-5">
          <h5>What you can do</h5>
          <div className="list-group">
            <Link className="list-group-item list-group-item-action" to="/admin/books">Add, edit and delete books</Link>
            <Link className="list-group-item list-group-item-action" to="/admin/orders">See orders and their bills</Link>
            <Link className="list-group-item list-group-item-action" to="/admin/users">Add, edit and remove users</Link>
            <Link className="list-group-item list-group-item-action" to="/change-password">Change your password</Link>
          </div>
        </div>
      </div>
    </>
  );
}
