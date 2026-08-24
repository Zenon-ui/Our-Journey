import React, { useEffect, useState } from 'react';

interface FloatingHeartItem {
  id: number;
  symbol: string;
  left: number;
  duration: number;
  drift: number;
  size: number;
}

const symbols = ['💙', '💜', '✨', '💖', '🫐', '🌸'];

export const FloatingHearts: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const [hearts, setHearts] = useState<FloatingHeartItem[]>([]);

  useEffect(() => {
    if (!active) return;

    // Spawn heart generator
    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart: FloatingHeartItem = {
          id: Date.now() + Math.random(),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          left: Math.random() * 94 + 3, // 3% to 97%
          duration: 8 + Math.random() * 7,
          drift: Math.random() * 80 - 40,
          size: 0.8 + Math.random() * 0.9,
        };
        // Keep array clean
        const trimmed = prev.slice(-15);
        return [...trimmed, newHeart];
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div
      id="floating-hearts"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart-el absolute -bottom-10 select-none opacity-70"
          style={
            {
              left: `${h.left}vw`,
              fontSize: `${h.size}rem`,
              animationDuration: `${h.duration}s`,
              '--drift': `${h.drift}px`,
            } as React.CSSProperties
          }
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
};
