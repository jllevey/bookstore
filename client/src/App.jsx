import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Splash from './components/Splash';
import Navbar from './components/Navbar';
import LiveBackground from './components/LiveBackground';
import ProtectedRoute, { homeFor } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminHome from './pages/AdminHome';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import MyOrders from './pages/MyOrders';

function Layout() {
  return (
    <>
      <LiveBackground />
      <Navbar />
      <main className="container py-4"><Outlet /></main>
    </>
  );
}

export default function App() {
  const [splash, setSplash] = useState(true);
  const { user, loading } = useAuth();

  return (
    <>
      {splash && <Splash onDone={() => setSplash(false)} />}
      {!loading && (
        <Routes>
          <Route path="/" element={user ? <Navigate to={homeFor(user)} replace /> : <Landing splash={splash} />} />
          <Route path="/login" element={user ? <Navigate to={homeFor(user)} replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={homeFor(user)} replace /> : <Signup />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<Invoice />} />
          </Route>

          <Route element={<ProtectedRoute role="User"><Layout /></ProtectedRoute>}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route element={<ProtectedRoute role="Admin"><Layout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to={user ? homeFor(user) : '/'} replace />} />
        </Routes>
      )}
    </>
  );
}
