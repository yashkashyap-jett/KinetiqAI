import { useEffect, useState, useRef } from 'react';

export default function CountUp({ end, duration = 1000, decimals = 0, suffix = '', prefix = '' }) {
  const [value, setValue] = useState(0);
  const prevEnd = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const startValue = prevEnd.current;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = startValue + (end - startValue) * eased;

      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevEnd.current = end;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
