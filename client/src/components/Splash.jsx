import { useEffect, useState } from 'react';
import { BRAND, TAGLINE } from '../brand';

// Opening animation, no text: two books sweep across an aurora background, a third rises to the
// centre and opens in a burst of light, then the screen parts down the middle like a book opening.
const DUST = Array.from({ length: 28 }, (_, i) => ({ left: (i * 37) % 100, size: 2 + (i % 4), delay: (i % 9) * 0.35, dur: 4 + (i % 5) }));

function Aurora({ side }) {
  return (
    <div className={`intro-panel ${side}`}>
      <div className="aurora">
        <span className="rb r1" /><span className="rb r2" /><span className="rb r3" /><span className="rb r4" />
      </div>
    </div>
  );
}

// `title` is printed on the cover. `page` (optional) is the message on the page that appears when the book opens.
function Book({ cls, title, page = false }) {
  const brandLines = BRAND.split(' ').length > 2 ? [BRAND.split(' ').slice(0, 2).join(' '), BRAND.split(' ').slice(2).join(' ')] : [BRAND];
  return (
    <div className={`fly ${cls}`}>
      <div className="bob">
        <div className="bk3d">
          <span className="bk-back" />
          <span className="bk-pages" />
          {page && (
            <div className="page-text">
              <small>Welcome to</small>
              <strong>{brandLines.map((l) => <span key={l}>{l}</span>)}</strong>
              <hr />
              <small>{TAGLINE}</small>
            </div>
          )}
          {page && <><span className="leaf l1" /><span className="leaf l2" /><span className="leaf l3" /></>}
          <span className="bk-cover"><em className="bk-title">{title}</em><i /><b /></span>
        </div>
      </div>
    </div>
  );
}

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setLeaving(true), reduce ? 300 : 3400);
    const t2 = setTimeout(onDone, reduce ? 600 : 4300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`intro ${leaving ? 'intro-out' : ''}`} aria-hidden="true">
      <Aurora side="left" />
      <Aurora side="right" />
      <div className="intro-content">
        {DUST.map((d, i) => (
          <span key={i} className="dust" style={{ left: `${d.left}%`, width: d.size, height: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
        ))}
        <Book cls="b1" title="Stories" />
        <Book cls="b2" title="Adventures" />
        <Book cls="b3" title="Welcome" page />
        <span className="burst" />
      </div>
      <span className="seam" />
    </div>
  );
}
