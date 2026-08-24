import React, { useEffect, useState } from 'react';
import { romanticMusic } from '../audio/romanticMusic';
import { Play, Pause, Volume2, VolumeX, Music, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MusicPlayerProps {
  autoStart?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoStart = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const unsubscribe = romanticMusic.subscribe((playing, muted, vol) => {
      setIsPlaying(playing);
      setIsMuted(muted);
      setVolume(vol);
    });

    if (autoStart) {
      romanticMusic.play();
    }

    return () => {
      unsubscribe();
    };
  }, [autoStart]);

  const handlePlayPause = () => {
    romanticMusic.togglePlay();
  };

  const handleMuteToggle = () => {
    romanticMusic.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    romanticMusic.setVolume(val);
    if (isMuted && val > 0) {
      romanticMusic.setMuted(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40"
    >
      <div className="relative flex items-center gap-2.5 p-2 pr-3.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-purple-200/80 text-[#2E2450] hover:shadow-xl transition-all duration-300">
        
        {/* Animated Equalizer or Music Icon */}
        <div
          onClick={handlePlayPause}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4B3B78] to-[#7A64B0] flex items-center justify-center text-white cursor-pointer shadow-sm relative group overflow-hidden"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying && !isMuted ? (
            <div className="flex items-end gap-[2px] h-4">
              <span className="w-1 bg-[#E9A9B4] rounded-full eq-bar-1" />
              <span className="w-1 bg-[#FFFDF9] rounded-full eq-bar-2" />
              <span className="w-1 bg-[#C9B7E8] rounded-full eq-bar-3" />
              <span className="w-1 bg-[#F3B45E] rounded-full eq-bar-4" />
            </div>
          ) : (
            <Music className="w-4 h-4 text-[#FFFDF9]" />
          )}
        </div>

        {/* Track Info (2000s Ballad) */}
        <div className="flex flex-col select-none pr-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-[#2E2450] tracking-wide">2000s Love Ballad</span>
            <Heart className="w-2.5 h-2.5 text-[#E9A9B4] fill-[#E9A9B4] heart-beat" />
          </div>
          <span className="text-[9px] font-medium text-[#7A64B0]">Acoustic & Rhodes Piano</span>
        </div>

        {/* Play/Pause Button */}
        <button
          id="btn-music-play-pause"
          onClick={handlePlayPause}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#4B3B78] hover:bg-[#FBF5EC] active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Mute/Unmute & Volume control */}
        <div className="relative flex items-center">
          <button
            id="btn-music-mute"
            onClick={handleMuteToggle}
            onMouseEnter={() => setShowVolumeSlider(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#4B3B78] hover:bg-[#FBF5EC] active:scale-95 transition-all cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#E9A9B4]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Popover Volume Slider */}
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute bottom-11 right-0 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 flex flex-col items-center gap-2 z-50 min-w-[120px]"
              >
                <span className="text-[10px] font-semibold text-[#4B3B78]">Volume {Math.round((isMuted ? 0 : volume) * 100)}%</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#7A64B0]"
                  aria-label="Music volume slider"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};
