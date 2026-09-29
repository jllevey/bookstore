import { useEffect, useState } from 'react';

export default function CountUp({ to, delay = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let frame;
    const begin = performance.now() + delay;
    const step = (t) => {
      const p = Math.max(0, Math.min((t - begin) / 1100, 1));
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [to, delay]);
  return n;
}
