import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Send, Check } from 'lucide-react';

export const LoveLetter: React.FC = () => {
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [hasSent, setHasSent] = useState(false);

  const handleAddLoveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNote.trim()) return;
    setSavedNotes((prev) => [userNote.trim(), ...prev]);
    setUserNote('');
    setHasSent(true);
    setTimeout(() => setHasSent(false), 2500);
  };

  return (
    <section className="relative z-10 w-full max-w-[620px] mx-auto px-4 py-8 flex flex-col gap-6">
      
      {/* 40th Milestone Counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-xs border border-purple-100/60 shadow-sm text-center flex flex-col items-center justify-center">
          <span className="font-script text-2xl md:text-3xl font-bold text-[#E9A9B4]">40</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B3B78]">Months</span>
          <span className="text-[10px] text-[#7A64B0]">Together</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-xs border border-purple-100/60 shadow-sm text-center flex flex-col items-center justify-center">
          <span className="font-script text-2xl md:text-3xl font-bold text-[#7A64B0]">1,217+</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B3B78]">Days</span>
          <span className="text-[10px] text-[#7A64B0]">Of Sunshine</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-xs border border-purple-100/60 shadow-sm text-center flex flex-col items-center justify-center">
          <span className="font-script text-2xl md:text-3xl font-bold text-[#F3B45E]">29,200+</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B3B78]">Hours</span>
          <span className="text-[10px] text-[#7A64B0]">Of Laughs</span>
        </div>
      </div>

      {/* Main Love Note Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full bg-[#FFFCF6] rounded-[28px] p-7 md:p-9 text-center shadow-lg border border-[#C9B7E8]/40 relative overflow-hidden"
      >
        {/* Soft background watermark */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-10">
          <Heart className="w-24 h-24 text-[#E9A9B4] fill-[#E9A9B4]" />
        </div>

        <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#7A64B0] mb-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A9B4]" />
          <span>a note, sealed with icing</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E9A9B4]" />
        </p>

        <p className="font-display italic text-lg md:text-xl text-[#382C62] leading-relaxed mb-5">
          &ldquo;Forty months of little moments stacked like layers of cake &mdash; each one soft, sweet, and completely ours. Thank you for growing this with me, one month, one memory, one slice at a time.&rdquo;
        </p>

        <p className="font-script text-2xl md:text-3xl text-[#E9A9B4] font-bold">
          here&apos;s to the next layer &mdash; happy 40th monthsary 💙
        </p>
      </motion.div>

      {/* Interactive Sweet Note / Reply Box */}
      <div className="w-full bg-white/70 backdrop-blur-xs rounded-2xl p-5 border border-purple-100 shadow-xs">
        <form onSubmit={handleAddLoveNote} className="flex flex-col gap-2.5">
          <label htmlFor="love-note-input" className="text-xs font-bold text-[#4B3B78] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#E9A9B4] fill-[#E9A9B4]" />
            <span>Leave a sweet 40th monthsary memory or wish:</span>
          </label>
          <div className="flex gap-2">
            <input
              id="love-note-input"
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="e.g. My favorite memory of us is..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E6DCF7] bg-[#FBF5EC] text-sm text-[#2E2450] outline-none focus:border-[#E9A9B4] transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#4B3B78] hover:bg-[#382C62] text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              {hasSent ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
              <span>{hasSent ? 'Saved!' : 'Add'}</span>
            </button>
          </div>
        </form>

        {/* Display saved love notes */}
        <AnimatePresence>
          {savedNotes.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-purple-100">
              {savedNotes.map((note, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2.5 rounded-xl bg-[#FBF5EC] text-xs text-[#382C62] flex items-center gap-2 border border-purple-50"
                >
                  <Heart className="w-3 h-3 text-[#E9A9B4] fill-[#E9A9B4] shrink-0" />
                  <span className="italic">&ldquo;{note}&rdquo;</span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
};
