import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Hummingbird from '../components/Hummingbird';
import CountUp from '../components/CountUp';
import { BRAND } from '../brand';

// [left %, top %, size px, colour 1, colour 2, opacity, drift seconds, blur px]
const BOKEH = [
  [3, 14, 150, '#a9e2bd', '#6fce9c', 0.4, 17, 12], [15, 58, 110, '#ffc9a3', '#ffab7f', 0.35, 21, 9],
  [30, 6, 90, '#ffd7b8', '#ffb98f', 0.4, 15, 7], [38, 70, 170, '#5cc590', '#2f8f66', 0.3, 24, 14],
  [50, 18, 70, '#ffc4a0', '#ff9f74', 0.4, 19, 6], [60, 66, 120, '#8fdcae', '#4fb884', 0.3, 18, 10],
  [70, 4, 160, '#ffcfae', '#ffb08a', 0.45, 23, 13], [80, 48, 90, '#7fd6a2', '#48b47e', 0.35, 16, 8],
  [88, 76, 140, '#ffd9bc', '#ffb692', 0.4, 20, 11], [92, 16, 100, '#c9f0d6', '#8fdcae', 0.4, 22, 9]
];
const THUMB_A = [[30, '#c9a24b'], [46, '#7a2432'], [38, '#f2f4f0'], [54, '#0f3b4a'], [34, '#a85a16'], [48, '#3b2a5a'], [40, '#c9a24b']];
const THUMB_B = [[44, '#f3d9c4'], [32, '#2f4a2f'], [52, '#c9651b'], [36, '#1f2a44'], [50, '#c9a24b'], [30, '#7a2432'], [42, '#f2f4f0']];

// Uses your own photo if you save one as client/public/hummingbird.png, otherwise the drawn bird.
function Bird() {
  const [photo, setPhoto] = useState(true);
  return photo
    ? <img className="bird bird-photo" src="/hummingbird.png" alt="A hummingbird hovering in mid-air" onError={() => setPhoto(false)} />
    : <Hummingbird />;
}

function Thumb({ spines, caption }) {
  return (
    <div className="thumb" aria-hidden="true">
      <span className="thumb-cap">{caption}</span>
      {spines.map(([h, c], i) => <i key={i} style={{ height: h, background: c, animationDelay: `${0.2 + i * 0.08}s` }} />)}
    </div>
  );
}

export default function Landing({ splash }) {
  const [t0] = useState(splash ? 3.5 : 0.1); // wait for the opening animation if it is still showing
  const [stats, setStats] = useState({ books: 61, genres: 12 });
  useEffect(() => { api('/stats/public').then(setStats).catch(() => {}); }, []);
  const lines = BRAND.split(' ').length > 2 ? [BRAND.split(' ').slice(0, 2).join(' '), BRAND.split(' ').slice(2).join(' ')] : [BRAND];

  return (
    <div className="landing" style={{ '--t0': `${t0}s` }}>
      <div className="bokeh" aria-hidden="true">
        {BOKEH.map(([l, t, s, c1, c2, o, d, b], i) => (
          <span key={i} className="bk" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, '--c1': c1, '--c2': c2, '--o': o, '--d': `${d}s`, '--b': `${b}px` }} />
        ))}
      </div>

      <header className="land-nav">
        <span className="brand land-brand">{BRAND}</span>
        <div className="d-flex align-items-center gap-3">
          <Link to="/login" className="land-link">Sign in</Link>
          <Link to="/signup" className="btn btn-dark rounded-pill px-3">Get started</Link>
        </div>
      </header>

      <main className="stage">
        <h1 className="wordmark">{lines.map((l) => <span key={l}>{l}</span>)}</h1>

        <div className="bird-wrap"><Bird /></div>

        <div className="copy">
          <div className="copy-label">Over {stats.books} titles, ready to ship</div>
          <h2>Stories that <em>find you</em></h2>
          <p>Browse the shelves, add your favourites to a cart and check out with a clear bill, all in one quiet, fast place.</p>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Link to="/signup" className="btn-pill">Start reading</Link>
            <Link to="/login" className="copy-link">Browse the shelves <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="cards">
          <div className="step-card step-a">
            <span className="step-tag">Catalogue</span>
            <Thumb spines={THUMB_A} caption="Every genre, one shelf" />
            <div className="step-num"><CountUp to={stats.books} delay={t0 * 1000 + 900} /><small>titles</small></div>
          </div>
          <div className="step-card step-b">
            <span className="step-tag">Genres</span>
            <Thumb spines={THUMB_B} caption="Find your next read" />
            <div className="step-num"><CountUp to={stats.genres} delay={t0 * 1000 + 1100} /><small>genres</small></div>
          </div>
        </div>
      </main>
    </div>
  );
}
