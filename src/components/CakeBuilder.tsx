import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Candle } from './Candle';
import { CakeAssemblyPhase } from '../types';
import { romanticMusic } from '../audio/romanticMusic';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Flame, Wind } from 'lucide-react';

interface CakeBuilderProps {
  onAnimationComplete?: () => void;
}

export const CakeBuilder: React.FC<CakeBuilderProps> = ({ onAnimationComplete }) => {
  const [phase, setPhase] = useState<CakeAssemblyPhase>('idle');
  const [candlesLit, setCandlesLit] = useState(false);
  const [userBlewWish, setUserBlewWish] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Baking our 40th monthsary cake with love...');

  const triggerCelebrationConfetti = useCallback(() => {
    try {
      // Gentle romantic pastel confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E9A9B4', '#C9B7E8', '#7A64B0', '#F3B45E', '#FFFDF9'],
        shapes: ['circle'],
        scalar: 1.1,
      });
    } catch {
      // safe fallback if canvas not available
    }
  }, []);

  const runAssemblySequence = useCallback(() => {
    setCandlesLit(false);
    setUserBlewWish(false);
    setPhase('plate');
    setStatusMessage('Preparing the celebration plate...');

    // Sequence timeline (in milliseconds from start)
    const timeline = [
      {
        t: 400,
        action: () => {
          setPhase('bottom_layer');
          setStatusMessage('Placing bottom blueberry sponge layer...');
          romanticMusic.playLayerDropSound('sponge');
        },
      },
      {
        t: 1200,
        action: () => {
          setPhase('middle_cream');
          setStatusMessage('Layering sweet cream & blueberry filling...');
          romanticMusic.playLayerDropSound('cream');
        },
      },
      {
        t: 2000,
        action: () => {
          setPhase('top_layer');
          setStatusMessage('Adding top blueberry chiffon sponge...');
          romanticMusic.playLayerDropSound('sponge');
        },
      },
      {
        t: 2800,
        action: () => {
          setPhase('frosting');
          setStatusMessage('Drizzling rich vanilla cream frosting...');
          romanticMusic.playLayerDropSound('frosting');
        },
      },
      {
        t: 3600,
        action: () => {
          setPhase('toppings');
          setStatusMessage('Topping with fresh wild blueberries & cream...');
          romanticMusic.playLayerDropSound('berry');
        },
      },
      {
        t: 4500,
        action: () => {
          setPhase('candle_4');
          setStatusMessage('Placing the "4" candle...');
          romanticMusic.playLayerDropSound('candle');
        },
      },
      {
        t: 5200,
        action: () => {
          setPhase('candle_0');
          setStatusMessage('Placing the "0" candle...');
          romanticMusic.playLayerDropSound('candle');
        },
      },
      {
        t: 5900,
        action: () => {
          setPhase('candle_t');
          setStatusMessage('Placing the "T" candle...');
          romanticMusic.playLayerDropSound('candle');
        },
      },
      {
        t: 6600,
        action: () => {
          setPhase('candle_h');
          setStatusMessage('Placing the "H" candle...');
          romanticMusic.playLayerDropSound('candle');
        },
      },
      {
        t: 7400,
        action: () => {
          setPhase('lighting_flames');
          setStatusMessage('Lighting the candles for 40 months of love ✨');
          romanticMusic.playLayerDropSound('ignite');
          setCandlesLit(true);
          triggerCelebrationConfetti();
        },
      },
      {
        t: 8200,
        action: () => {
          setPhase('completed');
          setStatusMessage('Happy 40th Monthsary, my love! 💙');
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        },
      },
    ];

    const timers = timeline.map(({ t, action }) => window.setTimeout(action, t));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onAnimationComplete, triggerCelebrationConfetti]);

  useEffect(() => {
    const cancel = runAssemblySequence();
    return () => {
      cancel();
    };
  }, [runAssemblySequence]);

  const handleToggleCandles = () => {
    if (candlesLit) {
      // Blow out
      setCandlesLit(false);
      setUserBlewWish(true);
      romanticMusic.playLayerDropSound('wish');
      setStatusMessage('Wish made! May all our future months be as sweet 💫');
    } else {
      // Relight
      setCandlesLit(true);
      setUserBlewWish(false);
      romanticMusic.playLayerDropSound('ignite');
      triggerCelebrationConfetti();
      setStatusMessage('Flames burning bright with 40 months of love ✨');
    }
  };

  // State checks for building stages
  const hasPlate = phase !== 'idle';
  const hasBottomLayer = ['bottom_layer', 'middle_cream', 'top_layer', 'frosting', 'toppings', 'candle_4', 'candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasMiddleCream = ['middle_cream', 'top_layer', 'frosting', 'toppings', 'candle_4', 'candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasTopLayer = ['top_layer', 'frosting', 'toppings', 'candle_4', 'candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasFrosting = ['frosting', 'toppings', 'candle_4', 'candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasToppings = ['toppings', 'candle_4', 'candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);

  const hasCandle4 = ['candle_4', 'candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasCandle0 = ['candle_0', 'candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasCandleT = ['candle_t', 'candle_h', 'lighting_flames', 'completed'].includes(phase);
  const hasCandleH = ['candle_h', 'lighting_flames', 'completed'].includes(phase);

  return (
    <div className="relative w-full flex flex-col items-center select-none py-4">
      {/* Ambient background stage glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[500px] h-[340px] md:h-[500px] rounded-full pointer-events-none glow-pulse -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(201, 183, 232, 0.45) 0%, rgba(233, 169, 180, 0.25) 45%, transparent 70%)',
        }}
      />

      {/* Status banner pill during or after building */}
      <motion.div
        key={statusMessage}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-purple-100/70 text-xs md:text-sm font-semibold text-[#4B3B78] flex items-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#E9A9B4] animate-spin" style={{ animationDuration: '6s' }} />
        <span>{statusMessage}</span>
      </motion.div>

      {/* Main Cake Assembly Stage */}
      <div className="relative w-[300px] sm:w-[340px] md:w-[380px] h-[340px] md:h-[380px] flex flex-col items-center justify-end pb-8">
        
        {/* ============================================================== */}
        {/* CANDLES SECTION (4 0 T H) */}
        {/* ============================================================== */}
        <div
          className="absolute z-20 flex items-end justify-center"
          style={{
            bottom: '188px', // Sits precisely atop the top frosting
            width: '240px',
            gap: '8px',
          }}
        >
          <div className="relative">
            <Candle
              char="4"
              isLanded={hasCandle4}
              isLit={candlesLit}
              delayIndex={0}
            />
          </div>
          <div className="relative">
            <Candle
              char="0"
              isLanded={hasCandle0}
              isLit={candlesLit}
              delayIndex={1}
            />
          </div>
          <div className="relative">
            <Candle
              char="T"
              isLanded={hasCandleT}
              isLit={candlesLit}
              delayIndex={2}
            />
          </div>
          <div className="relative">
            <Candle
              char="H"
              isLanded={hasCandleH}
              isLit={candlesLit}
              delayIndex={3}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CAKE PIECES & LAYERS (Built from the bottom up) */}
        {/* ============================================================== */}
        <div className="relative flex flex-col items-center">

          {/* LAYER 4: TOP FROSTING & TOPPINGS */}
          <div className="relative z-10 w-[240px] sm:w-[270px] md:w-[290px] h-0 flex items-center justify-center">
            
            {/* TOPPINGS: Blueberries & Cream Swirls */}
            <AnimatePresence>
              {hasToppings && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-6 inset-x-0 h-10 pointer-events-none z-10"
                >
                  {/* Wild Blueberries */}
                  {/* Berry 1 */}
                  <motion.div
                    initial={{ y: -120, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.05 }}
                    className="absolute left-[10%] -top-2 w-5 h-5 rounded-full shadow-md"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #8f7fd6 0%, #2E2450 65%, #180f2d 100%)',
                    }}
                  >
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/70" />
                  </motion.div>

                  {/* Berry 2 */}
                  <motion.div
                    initial={{ y: -140, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.15 }}
                    className="absolute left-[28%] -top-5 w-5 h-5 rounded-full shadow-md"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #9e8ee6 0%, #2E2450 65%, #180f2d 100%)',
                    }}
                  >
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/80" />
                  </motion.div>

                  {/* Berry 3 (Center) */}
                  <motion.div
                    initial={{ y: -160, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.25 }}
                    className="absolute left-[48%] -top-4 w-5 h-5 rounded-full shadow-md"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #8f7fd6 0%, #2E2450 65%, #180f2d 100%)',
                    }}
                  >
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/70" />
                  </motion.div>

                  {/* Berry 4 */}
                  <motion.div
                    initial={{ y: -130, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.35 }}
                    className="absolute left-[68%] -top-5 w-5 h-5 rounded-full shadow-md"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #9e8ee6 0%, #2E2450 65%, #180f2d 100%)',
                    }}
                  >
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/80" />
                  </motion.div>

                  {/* Berry 5 */}
                  <motion.div
                    initial={{ y: -150, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.45 }}
                    className="absolute left-[84%] -top-2 w-5 h-5 rounded-full shadow-md"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #8f7fd6 0%, #2E2450 65%, #180f2d 100%)',
                    }}
                  >
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/70" />
                  </motion.div>

                  {/* Whipped Cream Swirls */}
                  {/* Swirl 1 */}
                  <motion.div
                    initial={{ y: -100, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 17, delay: 0.1 }}
                    className="absolute left-[4%] -top-3 w-6 h-6 rounded-full shadow-xs"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fffbf2 60%, #eedfc7 100%)',
                    }}
                  />

                  {/* Swirl 2 */}
                  <motion.div
                    initial={{ y: -110, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 17, delay: 0.2 }}
                    className="absolute left-[38%] -top-5 w-6 h-6 rounded-full shadow-xs"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fffbf2 60%, #eedfc7 100%)',
                    }}
                  />

                  {/* Swirl 3 */}
                  <motion.div
                    initial={{ y: -120, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 17, delay: 0.3 }}
                    className="absolute left-[58%] -top-5 w-6 h-6 rounded-full shadow-xs"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fffbf2 60%, #eedfc7 100%)',
                    }}
                  />

                  {/* Swirl 4 */}
                  <motion.div
                    initial={{ y: -110, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 17, delay: 0.4 }}
                    className="absolute left-[78%] -top-3 w-6 h-6 rounded-full shadow-xs"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fffbf2 60%, #eedfc7 100%)',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Whipped Frosting & Hanging Drips */}
            <AnimatePresence>
              {hasFrosting && (
                <motion.div
                  initial={{ y: -160, opacity: 0, scaleY: 0.7 }}
                  animate={{ y: 0, opacity: 1, scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 19 }}
                  className="absolute -top-1 w-full h-8 z-5"
                >
                  {/* Top smooth rounded icing cover */}
                  <div
                    className="w-full h-6 rounded-t-2xl shadow-xs"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 60%, #F5ECDD 100%)',
                      borderTop: '2px solid rgba(255, 255, 255, 0.9)',
                    }}
                  />

                  {/* Natural icing drips hanging down over top sponge */}
                  {/* Drip 1 */}
                  <div
                    className="absolute left-[6%] top-4 w-5 h-7 rounded-b-full shadow-xs"
                    style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #F5ECDD 100%)' }}
                  />
                  {/* Drip 2 */}
                  <div
                    className="absolute left-[24%] top-4 w-6 h-10 rounded-b-full shadow-xs"
                    style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #F5ECDD 100%)' }}
                  />
                  {/* Drip 3 */}
                  <div
                    className="absolute left-[46%] top-4 w-5 h-6 rounded-b-full shadow-xs"
                    style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #F5ECDD 100%)' }}
                  />
                  {/* Drip 4 */}
                  <div
                    className="absolute left-[68%] top-4 w-6 h-9 rounded-b-full shadow-xs"
                    style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #F5ECDD 100%)' }}
                  />
                  {/* Drip 5 */}
                  <div
                    className="absolute left-[86%] top-4 w-5 h-7 rounded-b-full shadow-xs"
                    style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #F5ECDD 100%)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LAYER 3: TOP BLUEBERRY SPONGE */}
          <div className="relative z-4">
            <AnimatePresence>
              {hasTopLayer && (
                <motion.div
                  initial={{ y: -240, opacity: 0, scaleY: 0.6 }}
                  animate={{ y: 0, opacity: 1, scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="w-[230px] sm:w-[260px] md:w-[280px] h-[72px] rounded-t-2xl rounded-b-lg shadow-md relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #5F4D94 0%, #4B3B78 65%, #382C62 100%)',
                    boxShadow: 'inset 0 3px 6px rgba(255, 255, 255, 0.2), inset 0 -4px 8px rgba(46, 36, 80, 0.4), 0 6px 14px rgba(46, 36, 80, 0.2)',
                  }}
                >
                  {/* Sponge Texture lines */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                  {/* Light shimmer on surface */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-white/10" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LAYER 2: SWEET CREAM & BLUEBERRY FILLING (MIDDLE) */}
          <div className="relative z-3 -mt-2">
            <AnimatePresence>
              {hasMiddleCream && (
                <motion.div
                  initial={{ y: -260, opacity: 0, scaleY: 0.5 }}
                  animate={{ y: 0, opacity: 1, scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="w-[250px] sm:w-[280px] md:w-[305px] h-[34px] rounded-lg shadow-md relative overflow-hidden flex items-center justify-between px-3"
                  style={{
                    background: 'linear-gradient(180deg, #FFFDF8 0%, #F5ECDD 45%, #7A64B0 85%, #4B3B78 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -3px 5px rgba(46, 36, 80, 0.3)',
                  }}
                >
                  {/* Visible blueberry jam specks */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#382C62]/70" />
                  <div className="w-2 h-2 rounded-full bg-[#4B3B78]/80" />
                  <div className="w-3 h-2 rounded-full bg-[#382C62]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4B3B78]/70" />
                  <div className="w-2 h-2 rounded-full bg-[#382C62]/80" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LAYER 1: BOTTOM BLUEBERRY SPONGE */}
          <div className="relative z-2 -mt-2">
            <AnimatePresence>
              {hasBottomLayer && (
                <motion.div
                  initial={{ y: -300, opacity: 0, scaleY: 0.5 }}
                  animate={{ y: 0, opacity: 1, scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="w-[270px] sm:w-[300px] md:w-[330px] h-[64px] rounded-t-lg rounded-b-2xl shadow-lg relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #4B3B78 0%, #382C62 60%, #2E2450 100%)',
                    boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.15), inset 0 -6px 12px rgba(20, 14, 38, 0.6), 0 8px 18px rgba(46, 36, 80, 0.35)',
                  }}
                >
                  {/* Subtle sponge texture */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                  {/* Bottom cake rim shadow */}
                  <div className="absolute bottom-0 inset-x-0 h-3 bg-black/25" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LAYER 0: CERAMIC CAKE PLATE & TABLE SHADOW */}
          <div className="relative z-1 -mt-3 flex flex-col items-center">
            {hasPlate && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-[300px] sm:w-[330px] md:w-[365px] h-[22px] rounded-full relative"
                style={{
                  background: 'linear-gradient(180deg, #FFFDF8 0%, #F5ECDD 60%, #DFD1BC 100%)',
                  boxShadow: '0 8px 20px rgba(46, 36, 80, 0.25), inset 0 2px 3px #FFFFFF, inset 0 -2px 3px rgba(46, 36, 80, 0.15)',
                  border: '1px solid rgba(201, 183, 232, 0.3)',
                }}
              >
                {/* Gold rim accent around plate */}
                <div
                  className="absolute inset-x-4 top-1 h-[2px] rounded-full opacity-60"
                  style={{ background: 'linear-gradient(90deg, transparent, #F3B45E, transparent)' }}
                />
              </motion.div>
            )}

            {/* Soft Breathing Floor Shadow */}
            <div
              className="w-[260px] sm:w-[290px] md:w-[320px] h-[18px] rounded-full shadow-breathe -mt-2 -z-10"
              style={{
                background: 'radial-gradient(ellipse, rgba(46, 36, 80, 0.35) 0%, transparent 70%)',
                filter: 'blur(3px)',
              }}
            />
          </div>

        </div>

      </div>

      {/* Interactive Controls below cake */}
      {phase === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-4 z-20"
        >
          {/* Blow / Relight Candles Button */}
          <button
            id="btn-toggle-flame"
            onClick={handleToggleCandles}
            className="px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#2E2450] font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-purple-200/80 active:scale-95 cursor-pointer"
          >
            {candlesLit ? (
              <>
                <Wind className="w-4 h-4 text-[#7A64B0]" />
                <span>Make a 40th Wish (Blow Candles)</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 text-[#F3B45E] fill-[#F3B45E]" />
                <span>Relight 40TH Candles</span>
              </>
            )}
          </button>

          {/* Replay Assembly Animation Button */}
          <button
            id="btn-replay-cake"
            onClick={runAssemblySequence}
            className="px-4 py-2.5 rounded-full bg-[#4B3B78] hover:bg-[#382C62] text-white font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Cake Building</span>
          </button>
        </motion.div>
      )}

      {/* Wish banner when blown out */}
      <AnimatePresence>
        {userBlewWish && !candlesLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-3 text-xs md:text-sm font-medium text-[#7A64B0] text-center"
          >
            🕯️ <i>"Forty months together, and forever to go."</i>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
