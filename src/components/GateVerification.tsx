import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface GateVerificationProps {
  onUnlock: () => void;
}

const encouragements = [
  'Not quite — try again, love 💙',
  'So close! Give it another guess 🥰',
  "Hmm, that's not it — one more try 💕",
  "Almost! Think about today's special milestone 💐",
];

function normalizeAnswer(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isCorrectAnswer(raw: string): boolean {
  const normalized = normalizeAnswer(raw);
  const accepted = [
    '40thmonthsary',
    '40th',
    '40',
    'fortiethmonthsary',
    'fortieth',
    'monthsary40',
    '40monthsary',
    '40thmonth',
    '40months',
  ];
  return accepted.includes(normalized);
}

export const GateVerification: React.FC<GateVerificationProps> = ({ onUnlock }) => {
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputVal.trim();

    if (!val) {
      triggerError();
      return;
    }

    if (isCorrectAnswer(val)) {
      setIsSuccess(true);
      setFeedback('Correct! Unwrapping our celebration… 🎂');
      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      triggerError();
    }
  };

  const triggerError = () => {
    setIsSuccess(false);
    const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
    setFeedback(msg);
    setShakeKey((prev) => prev + 1);
  };

  return (
    <div
      id="gate"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gradient-to-br from-[#2E2450] via-[#4B3B78] to-[#7A64B0]"
    >
      {/* Background Twinkle Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40 twinkle-bg">
        <div className="absolute top-[15%] left-[20%] w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
        <div className="absolute top-[35%] left-[80%] w-2 h-2 rounded-full bg-white shadow-xs" />
        <div className="absolute top-[75%] left-[30%] w-1 h-1 rounded-full bg-white shadow-xs" />
        <div className="absolute top-[65%] left-[70%] w-2 h-2 rounded-full bg-white shadow-xs" />
        <div className="absolute top-[25%] left-[55%] w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
      </div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[460px] bg-[#FFFCF6] rounded-[28px] p-8 md:p-10 text-center shadow-2xl border border-white/40"
      >
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#7A64B0] mb-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A9B4]" />
          <span>a little surprise, just for you</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E9A9B4]" />
        </p>

        <h1 className="font-display font-semibold text-2xl md:text-3xl text-[#2E2450] leading-snug mb-3">
          Before we cut the cake&hellip;
        </h1>

        <p className="text-base md:text-lg text-[#4B3B78] font-semibold mb-6 flex items-center justify-center gap-1.5">
          What monthsary is it today?{' '}
          <span className="heart-beat inline-block">💙</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <input
              id="gate-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your answer here (e.g. 40th)"
              autoFocus
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#E6DCF7] bg-[#FBF5EC] text-[#2E2450] text-center text-base md:text-lg font-medium outline-none focus:border-[#E9A9B4] focus:ring-4 focus:ring-[#E9A9B4]/20 transition-all placeholder:text-[#7A64B0]/50"
            />
          </motion.div>

          <button
            id="gate-submit-btn"
            type="submit"
            disabled={isSuccess}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4B3B78] to-[#2E2450] hover:from-[#5F4D94] hover:to-[#382C62] text-[#FFFCF6] font-bold text-base tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
          >
            <span>Unlock our celebration</span>
            <Heart className="w-4 h-4 fill-[#E9A9B4] text-[#E9A9B4]" />
          </button>
        </form>

        <div className="min-h-[26px] mt-4">
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-semibold ${
                isSuccess ? 'text-emerald-600' : 'text-[#E9A9B4]'
              }`}
            >
              {feedback}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
