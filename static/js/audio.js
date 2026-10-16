// -------------------------------------------------------------------------
// Synthesized Web Audio API Sound Effects (Zero External Audio Files)
// -------------------------------------------------------------------------
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

let userHasInteracted = false;
// Proactively unlock Web Audio and Speech Synthesis on ANY user tap/click
document.addEventListener('click', () => {
  userHasInteracted = true;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  if ('speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
});

// Preload available speech voices immediately on page load
if ('speechSynthesis' in window) {
  try { window.speechSynthesis.getVoices(); } catch(e) {}
  window.speechSynthesis.onvoiceschanged = () => {
    try { window.speechSynthesis.getVoices(); } catch(e) {}
  };
}

function playTone(freq, type, duration, delay = 0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const executeTone = () => {
      try {
        const now = ctx.currentTime;
        const start = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.linearRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      } catch(e) {}
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(executeTone).catch(executeTone);
    } else {
      executeTone();
    }
  } catch (e) {
    console.warn("[WebAudio Error]", e);
  }
}

// Recorded sound effects (static/audio/, credits in static/audio/CREDITS.md).
// Each one falls back to a synthesized sound (or silence) if the file can't load or play.
function loadSfx(src, volume) {
  try {
    const a = new Audio(src);
    a.preload = 'auto';
    a.volume = volume;
    return a;
  } catch (e) {
    return null;
  }
}

function playSfx(audio, fallback) {
  if (!audio || audio.error) {
    if (fallback) fallback();
    return;
  }
  try {
    audio.currentTime = 0;
    const p = audio.play();
    if (p && p.catch) p.catch(() => { if (fallback) fallback(); });
  } catch (e) {
    if (fallback) fallback();
  }
}

const barkAudio = loadSfx('/static/audio/bark.mp3', 0.7);
const whineAudio = loadSfx('/static/audio/whine.mp3', 0.6);
const woofAudio = loadSfx('/static/audio/woof.mp3', 0.7);
const cheerAudio = loadSfx('/static/audio/cheer.mp3', 0.55);
const lockAudio = loadSfx('/static/audio/lock.mp3', 0.8);

function playPuppyBark() { playSfx(barkAudio, playSynthBark); }
function playPuppyWhine() { playSfx(whineAudio, null); }
function playGuardWoof() { playSfx(woofAudio, soundBlocked); }
function playCheer() { playSfx(cheerAudio, null); }
function playLockClick() { playSfx(lockAudio, soundClick); }

// Backup puppy yip synthesized with Web Audio
function playSynthBark() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playYip = (delay, baseFreq, peakFreq, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(peakFreq, now + dur * 0.35);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + dur);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + dur + 0.02);
    };

    const executeBarks = () => {
      playYip(0.0, 520, 860, 0.10);
      playYip(0.12, 600, 980, 0.12);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(executeBarks).catch(() => {});
    } else {
      executeBarks();
    }
  } catch (e) {
    console.warn("[Puppy Bark Audio Error]", e);
  }
}

function soundSuccess() {
  playTone(523.25, 'triangle', 0.18, 0);      // C5
  playTone(659.25, 'triangle', 0.18, 0.1);   // E5
  playTone(783.99, 'triangle', 0.22, 0.2);   // G5
  playTone(1046.50, 'triangle', 0.35, 0.3);  // C6
}

function soundBlocked() {
  playTone(220, 'sawtooth', 0.22, 0);
  playTone(180, 'sawtooth', 0.3, 0.12);
}

function soundClick() {
  playTone(800, 'sine', 0.08, 0);
}
