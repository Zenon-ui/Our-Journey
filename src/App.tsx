/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GateVerification } from './components/GateVerification';
import { CakeBuilder } from './components/CakeBuilder';
import { MusicPlayer } from './components/MusicPlayer';
import { LoveLetter } from './components/LoveLetter';
import { FloatingHearts } from './components/FloatingHearts';
import { ToppingRain } from './components/ToppingRain';
import { romanticMusic } from './audio/romanticMusic';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // Start 2000s romantic music automatically on gate unlock
    try {
      romanticMusic.play();
    } catch {
      // Audio context will start on first user interaction if blocked
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-[#E9A9B4] selection:text-[#2E2450]">
      
      {/* Verification Gate (Gatekeeper) */}
      <AnimatePresence>
        {!isUnlocked && (
          <GateVerification onUnlock={handleUnlock} />
        )}
      </AnimatePresence>

      {/* Main Site when unlocked */}
      {isUnlocked && (
        <motion.div
          id="site"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Ambient Floating Hearts in Background */}
          <FloatingHearts active={isUnlocked} />

          {/* Floating 2000s Romantic Music Controller */}
          <MusicPlayer autoStart={true} />

          {/* Header / Hero */}
          <header className="pt-10 md:pt-14 pb-4 px-4 text-center select-none">
            <p className="text-[11px] md:text-xs font-bold tracking-[0.24em] uppercase text-[#7A64B0] mb-2">
              celebrating our
            </p>

            <h1 className="flex items-baseline justify-center gap-3 md:gap-4 flex-wrap">
              <span
                className="font-script font-bold text-5xl md:text-7xl text-[#E9A9B4] leading-none"
                style={{ textShadow: '0 8px 24px rgba(233, 169, 180, 0.4)' }}
              >
                40<sup className="text-2xl md:text-3xl top-[-0.6em] ml-0.5">th</sup>
              </span>
              <span className="font-display font-bold text-3xl md:text-5xl text-[#2E2450] tracking-tight">
                Monthsary
              </span>
            </h1>

            <p className="mt-3 text-sm md:text-base text-[#5F4D94] font-medium max-w-md mx-auto">
              forty months of us, sweeter than blueberries &amp; cream 💙
            </p>
          </header>

          {/* Cake Building Animation Centerpiece */}
          <section className="relative w-full flex flex-col items-center justify-center my-2">
            <ToppingRain active={isUnlocked} />
            <CakeBuilder />
          </section>

          {/* Love Note & Memories Section */}
          <LoveLetter />

          {/* Romantic Footer */}
          <footer className="mt-auto py-8 text-center text-xs text-[#7A64B0] font-medium border-t border-purple-100/50">
            <p>
              made with love, blueberries, and a little bit of frosting &middot; 40 months &amp; counting 💙
            </p>
          </footer>

        </motion.div>
      )}

    </div>
  );
}
