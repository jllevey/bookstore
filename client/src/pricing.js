export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const money = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Same maths as the server, used only to show the bill before the order is placed.
export function summarize(items, p) {
  const rate = p?.taxRate ?? 0;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = !p || subtotal === 0 || subtotal >= p.freeDeliveryOver ? 0 : p.deliveryFee;
  const tax = Math.round(subtotal * rate * 100) / 100;
  return { subtotal, delivery, tax, total: Math.round((subtotal + delivery + tax) * 100) / 100, rate };
}
