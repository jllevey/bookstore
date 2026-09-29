// Decorative books drifting upward behind the login and sign-up cards.
export default function FloatingBooks() {
  return (
    <div className="floaters" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => <span key={i} className={`fb fb${i + 1}`} />)}
    </div>
  );
}
