import React, { useEffect, useState } from 'react';

interface ToppingItem {
  id: number;
  type: 'berry' | 'cream' | 'heart';
  leftPercent: number;
  duration: number;
  sway: number;
  size: number;
}

export const ToppingRain: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const [toppings, setToppings] = useState<ToppingItem[]>([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setToppings((prev) => {
        const types: Array<'berry' | 'cream' | 'heart'> = ['berry', 'cream', 'heart'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const newTopping: ToppingItem = {
          id: Date.now() + Math.random(),
          type: chosenType,
          leftPercent: 50 + (Math.random() * 40 - 20), // 30% to 70% around cake
          duration: 3.5 + Math.random() * 2,
          sway: Math.random() * 60 - 30,
          size: 10 + Math.random() * 8,
        };
        const trimmed = prev.slice(-8);
        return [...trimmed, newTopping];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div
      id="topping-field"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {toppings.map((t) => {
        if (t.type === 'heart') {
          return (
            <div
              key={t.id}
              className="absolute -top-6 text-sm text-[#E9A9B4] opacity-80 floating-heart-el"
              style={
                {
                  left: `${t.leftPercent}%`,
                  animationDuration: `${t.duration}s`,
                  '--drift': `${t.sway}px`,
                  animationDirection: 'reverse', // falls down
                  transform: 'scaleY(-1)',
                } as React.CSSProperties
              }
            >
              💙
            </div>
          );
        }

        return (
          <div
            key={t.id}
            className="absolute -top-6 rounded-full shadow-xs opacity-75"
            style={{
              left: `${t.leftPercent}%`,
              width: `${t.size}px`,
              height: `${t.size}px`,
              background:
                t.type === 'berry'
                  ? 'radial-gradient(circle at 35% 30%, #8f7fd6 0%, #2E2450 65%, #180f2d 100%)'
                  : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #FFFDF9 60%, #EFE4CF 100%)',
              animation: `topping-fall ${t.duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`,
              transform: `translateX(${t.sway}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
