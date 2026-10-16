// -------------------------------------------------------------------------
// Game State & Read-Aloud Voice (Native Web Speech API for K-2 Readers)
// -------------------------------------------------------------------------
let currentTier = 'k2';
let totalScore = 0;
let autoReadK2 = true;
let isSpeaking = false;
let speechSupported = ('speechSynthesis' in window);
window._activeUtterances = []; // Prevent V8 garbage collection bug in Chrome

// Novelty/effect voices that sound robotic or spooky. Never use them.
const BAD_VOICE_WORDS = ['albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
  'deranged', 'good news', 'hysterical', 'jester', 'organ', 'superstar', 'trinoids',
  'whisper', 'wobble', 'zarvox', 'pipe', 'fred', 'junior', 'ralph', 'kathy', 'grandma', 'grandpa',
  'eddy', 'flo', 'reed', 'rocko', 'sandy', 'shelley'];

// Score a voice: natural/neural voices first, then warm, clear everyday voices.
function scoreVoice(v) {
  const n = (v.name || '').toLowerCase();
  const lang = (v.lang || '').toLowerCase().replace('_', '-');
  if (!lang.startsWith('en')) return -1;
  if (BAD_VOICE_WORDS.some(w => n.includes(w))) return -1;
  let s = 0;
  if (lang === 'en-us') s += 20;
  if (n.includes('natural') || n.includes('neural') || n.includes('online')) s += 50; // Edge neural voices
  if (n.includes('enhanced') || n.includes('premium')) s += 40;                     // Apple downloadable voices
  if (n.includes('ana')) s += 15;                                                    // Edge "Ana": a friendly young voice
  if (['jenny', 'aria', 'ava', 'emma', 'michelle', 'samantha', 'allison', 'susan', 'nicky', 'zoe'].some(w => n.includes(w))) s += 12;
  if (n.includes('google') && lang === 'en-us') s += 25;                            // Chrome's network voice
  if (n.includes('zira')) s += 5;
  if (['david', 'mark', 'george', 'richard', 'guy'].some(w => n.includes(w))) s -= 10; // flat legacy SAPI voices
  return s;
}

let k2Voice = null;
function pickVoice() {
  if (!speechSupported) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  let best = null, bestScore = -1;
  voices.forEach(v => {
    const s = scoreVoice(v);
    if (s > bestScore) { best = v; bestScore = s; }
  });
  k2Voice = best;
  return best;
}
if (speechSupported) {
  pickVoice();
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
}

function stopSpeech() {
  if (speechSupported) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  window._activeUtterances = [];
  isSpeaking = false;
  updateSpeechUI(false);
}

function cleanForSpeech(text) {
  return text
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, '')
    .replace(/[*"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Speaks text sentence by sentence. Short utterances avoid Chrome's habit of
// cutting off long speech, and give natural pauses between sentences.
function speakText(text, onComplete = null) {
  if (!speechSupported) return;
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;

  stopSpeech();
  isSpeaking = true;
  updateSpeechUI(true);

  const voice = k2Voice || pickVoice();
  const isNeural = voice && /natural|neural|online|enhanced|premium/i.test(voice.name || '');
  const sentences = cleaned.match(/[^.!?]+[.!?]*/g) || [cleaned];

  try {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    sentences.forEach((sentence, i) => {
      const utter = new SpeechSynthesisUtterance(sentence.trim());
      utter.lang = (voice && voice.lang) || 'en-US';
      if (voice) utter.voice = voice;
      utter.volume = 1.0;
      // A touch slower than normal for young listeners; only a slight lift in pitch.
      // Big pitch shifts are what make synthetic voices sound chipmunk-like and eerie.
      utter.rate = 0.92;
      utter.pitch = isNeural ? 1.0 : 1.08;

      const isLast = i === sentences.length - 1;
      utter.onend = () => {
        window._activeUtterances = window._activeUtterances.filter(u => u !== utter);
        if (isLast) {
          isSpeaking = false;
          updateSpeechUI(false);
          if (onComplete) onComplete();
        }
      };
      utter.onerror = (evt) => {
        if (evt.error !== 'interrupted' && evt.error !== 'canceled') console.warn('[TTS Error]', evt.error || evt);
        window._activeUtterances = window._activeUtterances.filter(u => u !== utter);
        if (isLast) { isSpeaking = false; updateSpeechUI(false); }
      };
      window._activeUtterances.push(utter);
      window.speechSynthesis.speak(utter);
    });
  } catch(err) {
    console.error('[TTS Exception]', err);
    isSpeaking = false;
    updateSpeechUI(false);
  }
}

function updateSpeechUI(active) {
  const btn = document.getElementById('btnReadClue');
  const textEl = document.getElementById('btnReadClueText');
  const bubble = document.getElementById('k2Bubble');
  const pup = document.getElementById('k2Pup');
  if (btn && textEl) {
    const iconEl = btn.querySelector('.audio-btn-icon');
    btn.classList.toggle('reading', active);
    if (iconEl) iconEl.innerText = active ? '⏹️' : '🔊';
    textEl.innerText = active ? 'Stop' : 'Hear it';
  }
  if (bubble) bubble.classList.toggle('speaking-active', active);
  if (pup) pup.classList.toggle('talking', active);
}

// What Grizz Jr is currently saying, so "Hear it" and tapping the pup can replay it.
let k2Say = "Hi! I'm Grizz Jr! Some messages are nice. Some messages are tricks! Can you help me tell them apart? Tap Let's Play to start!";

function setBubble(title, text, mood = '') {
  document.getElementById('k2BubbleTitle').innerText = title;
  document.getElementById('k2BubbleText').innerText = text;
  const bubble = document.getElementById('k2Bubble');
  bubble.classList.remove('good', 'oops');
  if (mood) bubble.classList.add(mood);
}

function say(text) {
  k2Say = text;
  if (autoReadK2) speakText(text);
}

function toggleSpeakClue() {
  soundClick();
  if (isSpeaking) stopSpeech();
  else speakText(k2Say);
}

function replayPup() {
  if (!isSpeaking) speakText(k2Say);
}

function toggleAutoRead() {
  soundClick();
  autoReadK2 = !autoReadK2;
  const toggleBtn = document.getElementById('btnAutoReadToggle');
  const label = document.getElementById('autoReadLabel');
  toggleBtn.classList.toggle('off', !autoReadK2);
  label.innerText = autoReadK2 ? '🔊 Voice On' : '🔇 Voice Off';
  if (autoReadK2) speakText("Okay! I'll read to you.");
  else stopSpeech();
}
