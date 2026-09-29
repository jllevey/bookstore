import FloatingBooks from './FloatingBooks';

// Slow-moving colour blobs with faint books drifting through, behind every page after login.
export default function LiveBackground() {
  return (
    <div className="live-bg" aria-hidden="true">
      <span className="lb lb1" /><span className="lb lb2" /><span className="lb lb3" /><span className="lb lb4" />
      <FloatingBooks />
    </div>
  );
}
