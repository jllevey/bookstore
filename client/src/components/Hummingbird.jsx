// A hummingbird hovering head-on. Wings are drawn as a fan of translucent, blurred "ghost" positions
// to suggest mid-beat motion, with a gentle (not strobing) shimmer.
const WING = 'M0 0 C -30 -46 -140 -84 -205 -44 C -150 -22 -60 12 0 0 Z';
const GHOSTS = [[-28, 0.3], [-12, 0.5], [4, 0.62], [20, 0.48], [36, 0.3]];

function Wings() {
  return GHOSTS.map(([angle, opacity]) => (
    <path key={angle} d={WING} fill="url(#hb-wing)" opacity={opacity} transform={`rotate(${angle})`} />
  ));
}

export default function Hummingbird() {
  return (
    <svg className="bird" viewBox="0 0 440 420" role="img" aria-label="A hummingbird hovering in mid-air, wings blurred">
      <defs>
        <linearGradient id="hb-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6fe0a6" />
          <stop offset=".55" stopColor="#1f8a5f" />
          <stop offset="1" stopColor="#0e4d38" />
        </linearGradient>
        <radialGradient id="hb-throat" cx=".5" cy=".3" r=".8">
          <stop offset="0" stopColor="#ff7d8a" />
          <stop offset=".55" stopColor="#c9243d" />
          <stop offset="1" stopColor="#6d1224" />
        </radialGradient>
        <linearGradient id="hb-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f3e8" />
          <stop offset="1" stopColor="#cfd8c6" />
        </linearGradient>
        <linearGradient id="hb-wing" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#f2fbf5" stopOpacity=".95" />
          <stop offset="1" stopColor="#c6e8d6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hb-beak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2b" />
          <stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
        <filter id="hb-blur" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
      </defs>

      {/* wings, behind the body */}
      <g transform="translate(170 184)">
        <g className="beat beat-l" filter="url(#hb-blur)"><Wings /></g>
      </g>
      <g transform="translate(270 184) scale(-1 1)">
        <g className="beat beat-r" filter="url(#hb-blur)"><Wings /></g>
      </g>

      {/* tail fan */}
      <path d="M196 296 L146 394 Q220 418 294 394 L244 296 Z" fill="#0e4d38" />
      <path d="M208 300 L186 402 M220 300 L220 410 M232 300 L254 402" stroke="#2f9e6b" strokeWidth="2" fill="none" opacity=".7" />
      <ellipse cx="170" cy="399" rx="16" ry="5" fill="#f4f1e6" />
      <ellipse cx="220" cy="410" rx="18" ry="5" fill="#f4f1e6" />
      <ellipse cx="270" cy="399" rx="16" ry="5" fill="#f4f1e6" />

      {/* body */}
      <ellipse cx="220" cy="238" rx="54" ry="80" fill="url(#hb-green)" />
      <ellipse cx="220" cy="266" rx="30" ry="50" fill="url(#hb-belly)" opacity=".92" />

      {/* throat patch */}
      <ellipse cx="220" cy="178" rx="37" ry="27" fill="url(#hb-throat)" />

      {/* head */}
      <circle cx="220" cy="128" r="47" fill="url(#hb-green)" />
      <ellipse cx="203" cy="106" rx="18" ry="8" fill="#fff" opacity=".2" transform="rotate(-18 203 106)" />

      {/* eyes */}
      <circle cx="195" cy="124" r="6.5" fill="#101010" />
      <circle cx="245" cy="124" r="6.5" fill="#101010" />
      <circle cx="197.5" cy="121.5" r="1.9" fill="#fff" />
      <circle cx="247.5" cy="121.5" r="1.9" fill="#fff" />
      <circle cx="187" cy="133" r="2.4" fill="#fff" opacity=".85" />
      <circle cx="253" cy="133" r="2.4" fill="#fff" opacity=".85" />

      {/* beak, pointing at the viewer */}
      <polygon points="214,126 226,126 222.5,192 217.5,192" fill="url(#hb-beak)" />
      <path d="M219.5 130 L219.5 186" stroke="#5a5a5a" strokeWidth="1.2" opacity=".8" />
    </svg>
  );
}
