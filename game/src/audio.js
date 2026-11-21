// Original synthesized sounds only — no audio files. The context is made
// lazily on the first sound (after a user gesture), so nothing plays on load.
let context = null;

function tone(freq, dur = 0.12, type = 'sine', vol = 0.12, delay = 0) {
  try {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    const t = context.currentTime + delay;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch {
    // No audio device, or not allowed yet: the game plays on silently.
  }
}

export const sfx = {
  find() { tone(660); tone(880, 0.14, 'sine', 0.12, 0.09); },
  wrong() { tone(140, 0.2, 'square', 0.08); },
  level() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, 'triangle', 0.12, i * 0.09)); },
  over() { [400, 300, 200].forEach((f, i) => tone(f, 0.2, 'triangle', 0.1, i * 0.12)); },
};
