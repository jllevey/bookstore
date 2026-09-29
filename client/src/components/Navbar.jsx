import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BRAND } from '../brand';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark shell-nav">
      <div className="container">
        <Link className="navbar-brand brand" to={isAdmin ? '/admin' : '/books'}>{BRAND}</Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle menu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            {isAdmin ? (
              <>
                <li className="nav-item"><NavLink end className="nav-link" to="/admin">Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/books">Book operations</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/orders">Orders</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/users">User management</NavLink></li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink end className="nav-link" to="/books">Browse books</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/orders">My orders</NavLink></li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">
                    Cart {count > 0 && <span key={count} className="badge cart-badge">{count}</span>}
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item"><NavLink className="nav-link" to="/change-password">Change password</NavLink></li>
          </ul>
          <span className="navbar-text me-3 small">{user.name} ({user.role})</span>
          <button className="btn btn-sm btn-foil" onClick={signOut}>Log out</button>
        </div>
      </div>
    </nav>
  );
}
