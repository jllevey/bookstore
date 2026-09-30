import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Collapse } from 'bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BRAND } from '../brand';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const signOut = () => {
    close();
    logout();
    navigate('/login');
  };

  // Collapses the mobile menu after a link is tapped, so it doesn't stay open over the page.
  const close = () => {
    const el = document.getElementById('nav');
    if (el?.classList.contains('show')) {
      Collapse.getOrCreateInstance(el).hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark shell-nav">
      <div className="container">
        <Link className="navbar-brand brand" to={isAdmin ? '/admin' : '/books'} onClick={close}>{BRAND}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-label="Toggle menu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            {isAdmin ? (
              <>
                <li className="nav-item"><NavLink end className="nav-link" to="/admin" onClick={close}>Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/books" onClick={close}>Book operations</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/orders" onClick={close}>Orders</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/users" onClick={close}>User management</NavLink></li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink end className="nav-link" to="/books" onClick={close}>Browse books</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/orders" onClick={close}>My orders</NavLink></li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart" onClick={close}>
                    Cart {count > 0 && <span key={count} className="badge cart-badge">{count}</span>}
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item"><NavLink className="nav-link" to="/change-password" onClick={close}>Change password</NavLink></li>
          </ul>
          <span className="navbar-text me-3 small">{user.name} ({user.role})</span>
          <button className="btn btn-sm btn-foil" onClick={signOut}>Log out</button>
        </div>
      </div>
    </nav>
  );
}
