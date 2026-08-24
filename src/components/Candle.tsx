import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CandleProps {
  char: '4' | '0' | 'T' | 'H';
  isLanded: boolean;
  isLit: boolean;
  delayIndex: number;
  onExtinguish?: () => void;
  flameIgnitedTime?: number;
}

export const Candle: React.FC<CandleProps> = ({
  char,
  isLanded,
  isLit,
  delayIndex,
}) => {
  // Wax styling accents per candle character
  const colorMap = {
    '4': {
      stripe1: '#E9A9B4', // blush
      stripe2: '#FFFDF9', // cream
      glow: '#F3B45E',
      accent: '#7A64B0',
    },
    '0': {
      stripe1: '#C9B7E8', // lavender
      stripe2: '#FFFDF9', // cream
      glow: '#F3B45E',
      accent: '#4B3B78',
    },
    'T': {
      stripe1: '#E9A9B4', // blush
      stripe2: '#FFFDF9', // cream
      glow: '#F3B45E',
      accent: '#7A64B0',
    },
    'H': {
      stripe1: '#C9B7E8', // lavender
      stripe2: '#FFFDF9', // cream
      glow: '#F3B45E',
      accent: '#4B3B78',
    },
  };

  const currentTheme = colorMap[char];

  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: '38px' }}>
      {/* Flame & Glow Container */}
      <div className="relative w-8 h-10 flex items-center justify-center -mb-1">
        <AnimatePresence>
          {isLanded && isLit && (
            <motion.div
              key="flame"
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="absolute bottom-0 flex flex-col items-center"
            >
              {/* Outer Ambient Flame Glow */}
              <div
                className="absolute -top-3 w-14 h-14 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(243, 180, 94, 0.65) 0%, rgba(243, 180, 94, 0.2) 45%, transparent 75%)',
                  filter: 'blur(3px)',
                  animation: 'glowPulse 2s ease-in-out infinite',
                }}
              />

              {/* Teardrop Flame */}
              <div
                className="relative w-4 h-6 flame-flicker"
                style={{
                  background: 'radial-gradient(ellipse at 50% 85%, #ffffff 0%, #fff2be 22%, #f3b45e 55%, #e8783f 88%)',
                  borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
                  boxShadow: '0 0 12px 2px rgba(243, 180, 94, 0.8), 0 0 4px 1px #fff',
                }}
              >
                {/* Inner bright blue/white core base */}
                <div
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-2 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #ffffff 40%, #7dc9ff 90%)',
                    opacity: 0.85,
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Smoke puff when blown out */}
          {isLanded && !isLit && (
            <motion.div
              key="smoke"
              initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -24, scale: 1.6 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-400/50 pointer-events-none blur-[1px]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Candle Body (Falls down smoothly during assembly) */}
      <AnimatePresence>
        {isLanded ? (
          <motion.div
            key="candle-body"
            initial={{ y: -180 - delayIndex * 40, opacity: 0, rotate: -4 + delayIndex * 3 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 18,
              mass: 0.9,
            }}
            className="relative flex flex-col items-center"
          >
            {/* Candle Wick */}
            <div className="w-[3px] h-3 bg-stone-800 rounded-t-sm shadow-xs -mb-[1px] relative z-10">
              {isLit && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px]" />
              )}
            </div>

            {/* Candle Wax Cylinder */}
            <div
              className="relative w-8 h-14 rounded-t-lg rounded-b-md flex flex-col items-center justify-center overflow-hidden shadow-md"
              style={{
                background: `repeating-linear-gradient(
                  145deg,
                  ${currentTheme.stripe1} 0px,
                  ${currentTheme.stripe1} 7px,
                  ${currentTheme.stripe2} 7px,
                  ${currentTheme.stripe2} 14px
                )`,
                boxShadow: 'inset -3px 0 5px rgba(46, 36, 80, 0.2), inset 3px 0 4px rgba(255, 255, 255, 0.6), 0 4px 10px rgba(46, 36, 80, 0.22)',
                border: '1px solid rgba(75, 59, 120, 0.15)',
              }}
            >
              {/* Wax top rim highlight */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-white/70 rounded-t-lg" />

              {/* Character badge / engraved 3D text */}
              <div
                className="relative z-10 w-6 h-7 rounded-md bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs border border-white/60"
                style={{
                  boxShadow: '0 2px 5px rgba(46, 36, 80, 0.15)',
                }}
              >
                <span
                  className="font-bold text-sm leading-none select-none"
                  style={{
                    color: currentTheme.accent,
                    fontFamily: 'var(--font-display)',
                    textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {char}
                </span>
              </div>

              {/* Cute wax drip on side */}
              <div
                className="absolute top-2 -left-0.5 w-1.5 h-3 rounded-full"
                style={{ background: currentTheme.stripe2, opacity: 0.9 }}
              />
              <div
                className="absolute top-3 -right-0.5 w-1.5 h-2 rounded-full"
                style={{ background: currentTheme.stripe1, opacity: 0.9 }}
              />
            </div>

            {/* Candle base stake insert into frosting */}
            <div className="w-2.5 h-1.5 bg-stone-300 rounded-b-sm shadow-xs -mt-[1px]" />
          </motion.div>
        ) : (
          <div className="w-8 h-18 opacity-0" />
        )}
      </AnimatePresence>
    </div>
  );
};
