/**
 * Romantic 2000s-inspired Web Audio Synthesizer
 * Plays an acoustic guitar & Rhodes piano nostalgic chord progression (I - V - vi - IV in E Major: E -> B -> C#m7 -> Aadd9)
 * with a sweet melody line inspired by early 2000s romantic acoustic ballads.
 */

class RomanticMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlayingAudio = false;
  private isMutedAudio = false;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private timerId: number | null = null;
  private currentStep = 0;
  private volumeLevel = 0.7;
  private listeners: Array<(playing: boolean, muted: boolean, vol: number) => void> = [];

  // 2000s Romantic Progression: E Major -> B/D# -> C#m7 -> Aadd9 (80 BPM, 4 beats per bar)
  // Frequencies for chords & acoustic guitar picking arpeggios
  private chordProgression = [
    // Bar 1: E Major (E3, B3, E4, G#4, B4)
    { root: 164.81, notes: [164.81, 246.94, 329.63, 415.30, 493.88], melody: [659.25, 493.88, 415.30, 493.88] },
    // Bar 2: B Major / D# (B2, F#3, D#4, F#4, B4)
    { root: 123.47, notes: [123.47, 185.00, 311.13, 369.99, 493.88], melody: [587.33, 493.88, 369.99, 440.00] },
    // Bar 3: C#m7 (C#3, G#3, E4, B4, E5)
    { root: 138.59, notes: [138.59, 207.65, 329.63, 493.88, 659.25], melody: [659.25, 554.37, 493.88, 415.30] },
    // Bar 4: Aadd9 (A2, E3, C#4, B4, E5)
    { root: 110.00, notes: [110.00, 164.81, 277.18, 493.88, 659.25], melody: [554.37, 493.88, 415.30, 329.63] },
    // Bar 5: F#m7 (F#2, C#3, A3, E4, A4)
    { root: 92.50, notes: [92.50, 138.59, 220.00, 329.63, 440.00], melody: [440.00, 493.88, 554.37, 659.25] },
    // Bar 6: G#m7 (G#2, D#3, B3, F#4, B4)
    { root: 103.83, notes: [103.83, 155.56, 246.94, 369.99, 493.88], melody: [493.88, 554.37, 659.25, 739.99] },
    // Bar 7: Aadd9 (A2, E3, A3, C#4, E4)
    { root: 110.00, notes: [110.00, 164.81, 220.00, 277.18, 329.63], melody: [830.61, 739.99, 659.25, 554.37] },
    // Bar 8: Bsus4 -> B (B2, F#3, B3, E4 -> D#4)
    { root: 123.47, notes: [123.47, 185.00, 246.94, 329.63, 493.88], melody: [659.25, 554.37, 493.88, 493.88] }
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMutedAudio ? 0 : this.volumeLevel, this.ctx.currentTime);
      
      // Simple synthetic impulse response reverb for lush 2000s ballad warmth
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.createReverbBuffer(this.ctx, 2.4, 1.8);
      
      const reverbGain = this.ctx.createGain();
      reverbGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.reverbNode.connect(reverbGain);
      reverbGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createReverbBuffer(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const factor = Math.exp(-n * decay);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }
    return impulse;
  }

  // Plucks an acoustic guitar style string (triangle + sine + harmonic decay)
  private playAcousticPluck(freq: number, time: number, gainAmt = 0.18, duration = 1.6) {
    if (!this.ctx || !this.masterGain || !this.reverbNode) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.002, time); // slight chorus detune

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainAmt, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(gainAmt * 0.4, time + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    gain.connect(this.reverbNode);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  // Soft Rhodes / Music Box Chime melody
  private playRhodesChime(freq: number, time: number, gainAmt = 0.12, duration = 2.0) {
    if (!this.ctx || !this.masterGain || !this.reverbNode) return;

    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq * 2, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainAmt, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(gainAmt * 0.3, time + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.reverbNode);

    osc.start(time);
    sub.start(time);
    osc.stop(time + duration + 0.1);
    sub.stop(time + duration + 0.1);
  }

  // Warm acoustic bass note
  private playWarmBass(freq: number, time: number, duration = 2.2) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq / 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.24, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.08, time + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  private scheduleNextMeasure() {
    if (!this.isPlayingAudio || !this.ctx) return;

    const now = this.ctx.currentTime;
    const barIndex = this.currentStep % this.chordProgression.length;
    const bar = this.chordProgression[barIndex];
    const beatDuration = 0.72; // ~83.3 BPM

    // Play bass note on downbeat
    this.playWarmBass(bar.root, now + 0.02, beatDuration * 3.6);

    // Arpeggiated guitar picking pattern (4 beats: 8 eighth notes)
    // 0: Root note, 1: 3rd, 2: 5th, 3: 7th, 4: High 9th/octave, 5: 5th, 6: 3rd, 7: 5th
    const notes = bar.notes;
    const arpeggioIdxs = [0, 1, 2, 3, 4, 3, 2, 1];

    arpeggioIdxs.forEach((nIdx, step) => {
      const noteFreq = notes[nIdx % notes.length];
      const stepTime = now + step * (beatDuration / 2);
      const isDownbeat = step === 0 || step === 4;
      this.playAcousticPluck(noteFreq, stepTime, isDownbeat ? 0.16 : 0.10, beatDuration * 1.5);
    });

    // Melodic accents on quarter beats
    if (bar.melody && bar.melody.length) {
      bar.melody.forEach((melFreq, mIdx) => {
        const melTime = now + mIdx * beatDuration + 0.1;
        this.playRhodesChime(melFreq, melTime, 0.13, 2.0);
      });
    }

    this.currentStep++;

    // Schedule next measure
    const nextTimeMs = beatDuration * 4 * 1000 - 40;
    this.timerId = window.setTimeout(() => {
      this.scheduleNextMeasure();
    }, nextTimeMs);
  }

  public play() {
    this.initContext();
    if (this.isPlayingAudio) return;

    this.isPlayingAudio = true;
    this.scheduleNextMeasure();
    this.notify();
  }

  public pause() {
    this.isPlayingAudio = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlayingAudio) {
      this.pause();
    } else {
      this.play();
    }
  }

  public toggleMute() {
    this.setMuted(!this.isMutedAudio);
  }

  public setMuted(muted: boolean) {
    this.isMutedAudio = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volumeLevel, this.ctx.currentTime);
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volumeLevel = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMutedAudio) {
      this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
    }
    this.notify();
  }

  public isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  public isMuted(): boolean {
    return this.isMutedAudio;
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public subscribe(cb: (playing: boolean, muted: boolean, vol: number) => void): () => void {
    this.listeners.push(cb);
    cb(this.isPlayingAudio, this.isMutedAudio, this.volumeLevel);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.isPlayingAudio, this.isMutedAudio, this.volumeLevel));
  }

  // Soft sound effects for cake building & candle interaction
  public playLayerDropSound(type: 'sponge' | 'cream' | 'frosting' | 'berry' | 'candle' | 'ignite' | 'wish') {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMutedAudio) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    switch (type) {
      case 'sponge': {
        // Soft deep thud with gentle bounce
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }
      case 'cream': {
        // Smooth slide & soft pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.21);
        break;
      }
      case 'frosting': {
        // Drizzle chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.28);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.31);
        break;
      }
      case 'berry': {
        // Cute high bubble pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }
      case 'candle': {
        // Soft bell tap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(784, now);
        osc.frequency.exponentialRampToValueAtTime(523, now + 0.2);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.23);
        break;
      }
      case 'ignite': {
        // Sparkle shimmer
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.linearRampToValueAtTime(1318.5, now + 0.15);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.42);
        break;
      }
      case 'wish': {
        // Gentle breath out & twinkle
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.42);
        break;
      }
    }
  }
}

export const romanticMusic = new RomanticMusicPlayer();
