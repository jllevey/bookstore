import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

// The cart lives in this browser (one cart per logged-in user) until the order is placed.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = user ? `cart:${user.id}` : null;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!key) return setItems([]);
    try { setItems(JSON.parse(localStorage.getItem(key)) || []); } catch { setItems([]); }
  }, [key]);

  const save = (next) => {
    setItems(next);
    if (key) { try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage blocked */ } }
  };

  const add = (book, qty = 1) => {
    if (!book.stock) return false;
    const found = items.find((i) => i.id === book._id);
    const line = {
      id: book._id, title: book.title, author: book.author, genre: book.genre,
      price: book.price, stock: book.stock, coverUrl: book.coverUrl || '',
      qty: Math.min((found ? found.qty : 0) + qty, book.stock)
    };
    save(found ? items.map((i) => (i.id === book._id ? line : i)) : [...items, line]);
    return true;
  };
  const setQty = (id, qty) => save(items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)));
  const remove = (id) => save(items.filter((i) => i.id !== id));
  const clear = () => save([]);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <CartContext.Provider value={{ items, count, add, setQty, remove, clear, sync: save }}>{children}</CartContext.Provider>;
}
