// -------------------------------------------------------------------------
// K-2 "Safe or Trick?" Scenarios & Engine
// Lesson: look at who sent it and what it asks for. Never share a password.
// When unsure, ask a grown-up.
// -------------------------------------------------------------------------
// Each game deals K2_ROUNDS messages (half safe, half tricks) from this deck.
// Written for K-2: short sentences, everyday words, one idea per message.
// Level 1: easy tricks (prizes for passwords) vs. kind notes from family and teachers.
// Level 2: tricks that ask for private things, or rush you.
// Level 3: sneakier. A friend or "game helper" asks for a password; some safe
//          messages say "hurry" or "password" but come from your grown-ups.
const K2_ROUNDS = 4;
const K2_MAX_LEVEL = 3;
// PHISH_DECK (the messages) lives in k2-messages.js so teachers can edit it easily.

// Words on the K-2 screen and in Grizz Jr's voice, in English and Spanish.
// {n}, {i}, {total}, {who}, {text} are filled in when used.
const K2_TEXT = {
  en: {
    langButton: '🌐 Español',
    hiTitle: "Hi! I'm Grizz Jr! 👋",
    hiText: 'Some messages are nice. Some messages are tricks! Can you help me tell them apart?',
    hiSay: "Hi! I'm Grizz Jr! Some messages are nice. Some messages are tricks! Can you help me tell them apart? Tap Let's Play to start!",
    levelTitle: 'Level {n}! I grew bigger! 🎉',
    levelText: 'You helped me grow! These are a little trickier. Look at who sent it, and what it asks for!',
    levelSay: "Level {n}! Look, I grew bigger! These are a little trickier. Look at who sent it, and what it asks for. Tap Let's Play!",
    level: 'Level {n}',
    roundTitle: 'Level {n} • Message {i} of {total}',
    roundText: 'Look at who sent it. Is it safe, or a trick?',
    roundSay: 'Here is a message from {who}. It says: {text} Is it safe, or a trick?',
    fromPrefix: 'From:',
    praiseTrap: 'You found the trick!',
    praiseSafe: 'Yes, that one is safe!',
    greatJob: 'Great job!',
    lookAgainTitle: "Hmm, let's look again! 🔍",
    lookAgainSay: "Hmm, let's look again.",
    next: 'Next ➡️',
    levelUpButton: 'Level Up! Grow Grizz Jr! ⬆️',
    badgeButton: 'Get my badge! 🏆',
    tryAgain: 'Try again 🔄',
    play: "▶️ Let's Play!",
    startOver: '🔁 Start over',
    voiceOn: '🔊 Voice On',
    voiceOff: '🔇 Voice Off',
    voiceOnSay: "Okay! I'll read to you.",
    hearIt: 'Hear it',
    stop: 'Stop',
    question: 'Is it <span style="color:#059669">safe</span> or a <span style="color:#dc2626">trick</span>?',
    safeWord: 'Safe',
    safeSub: "It's OK!",
    trickWord: 'Trick!',
    trickSub: "Don't do it!",
    rule1: '🔑 Keep passwords secret',
    rule2: '🙋 Not sure? Ask a grown-up!',
    pupAlt: 'Grizz Jr the puppy',
    stage1: '🐶 Level 1 • Little Puppy',
    stage2: '🐕 Level 2 • Growing Pup!',
    stage3: '🦮 Level 3 • Big Dog!',
    badge: 'Junior Cyber Detective',
    flag: '🐾 You spotted every trick!',
    finishTitle: '🎉 You did it!',
    finishDesc: 'Remember: keep passwords secret, and ask a grown-up when something feels tricky!',
    finishSay: 'You did it! You helped Grizz Jr grow all the way to Level 3 and spotted every trick! Now you are a Junior Cyber Detective! High five!',
    playAgain: '🔄 Play Again',
    close: 'Close'
  },
  es: {
    langButton: '🌐 English',
    hiTitle: '¡Hola! ¡Soy Grizz Jr! 👋',
    hiText: 'Algunos mensajes son amables. ¡Otros son trucos! ¿Me ayudas a distinguirlos?',
    hiSay: '¡Hola! ¡Soy Grizz Jr! Algunos mensajes son amables. ¡Otros son trucos! ¿Me ayudas a distinguirlos? ¡Toca A jugar para empezar!',
    levelTitle: '¡Nivel {n}! ¡Crecí más grande! 🎉',
    levelText: '¡Me ayudaste a crecer! Estos son un poco más difíciles. ¡Fíjate quién lo mandó y qué te pide!',
    levelSay: '¡Nivel {n}! ¡Mira, crecí más grande! Estos son un poco más difíciles. Fíjate quién lo mandó y qué te pide. ¡Toca A jugar!',
    level: 'Nivel {n}',
    roundTitle: 'Nivel {n} • Mensaje {i} de {total}',
    roundText: 'Fíjate quién lo mandó. ¿Es seguro o es un truco?',
    roundSay: 'Aquí hay un mensaje de {who}. Dice: {text} ¿Es seguro o es un truco?',
    fromPrefix: 'De:',
    praiseTrap: '¡Encontraste el truco!',
    praiseSafe: '¡Sí, ese es seguro!',
    greatJob: '¡Muy bien!',
    lookAgainTitle: 'Mmm, ¡miremos otra vez! 🔍',
    lookAgainSay: 'Mmm, miremos otra vez.',
    next: 'Siguiente ➡️',
    levelUpButton: '¡Subir de nivel! ¡Crecer! ⬆️',
    badgeButton: '¡Quiero mi insignia! 🏆',
    tryAgain: 'Intenta otra vez 🔄',
    play: '▶️ ¡A jugar!',
    startOver: '🔁 Empezar de nuevo',
    voiceOn: '🔊 Voz: Sí',
    voiceOff: '🔇 Voz: No',
    voiceOnSay: '¡Bien! Yo te leo.',
    hearIt: 'Escuchar',
    stop: 'Parar',
    question: '¿Es <span style="color:#059669">seguro</span> o es un <span style="color:#dc2626">truco</span>?',
    safeWord: 'Seguro',
    safeSub: '¡Está bien!',
    trickWord: '¡Truco!',
    trickSub: '¡No lo hagas!',
    rule1: '🔑 Tus contraseñas son secretas',
    rule2: '🙋 ¿No estás seguro? ¡Pregúntale a un adulto!',
    pupAlt: 'Grizz Jr, el perrito',
    stage1: '🐶 Nivel 1 • Perrito Pequeño',
    stage2: '🐕 Nivel 2 • ¡Creciendo!',
    stage3: '🦮 Nivel 3 • ¡Perro Grande!',
    badge: 'Detective Cibernético Junior',
    flag: '🐾 ¡Encontraste todos los trucos!',
    finishTitle: '🎉 ¡Lo lograste!',
    finishDesc: '¡Recuerda: tus contraseñas son secretas, y pregúntale a un adulto cuando algo parezca un truco!',
    finishSay: '¡Lo lograste! ¡Ayudaste a Grizz Jr a crecer hasta el Nivel 3 y encontraste todos los trucos! ¡Choca esos cinco!',
    playAgain: '🔄 Jugar otra vez',
    close: 'Cerrar'
  }
};

let k2Lang = 'en';

function k2T(key, vars = {}) {
  const text = (K2_TEXT[k2Lang] && K2_TEXT[k2Lang][key]) || K2_TEXT.en[key] || '';
  return text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

// A message field in the current language (falls back to English if a translation is missing).
function k2Msg(m, field) {
  return (k2Lang !== 'en' && m[k2Lang] && m[k2Lang][field]) || m[field];
}

// Relabel the fixed parts of the K-2 screen (elements marked data-k2="key").
function applyK2Language() {
  const panel = document.getElementById('panel_k2');
  panel.lang = k2Lang;
  panel.querySelectorAll('[data-k2]').forEach(el => { el.innerText = k2T(el.dataset.k2); });
  document.getElementById('k2Question').innerHTML = k2T('question');   // trusted text from K2_TEXT
  document.getElementById('k2Pup').alt = k2T('pupAlt');
  document.getElementById('autoReadLabel').innerText = k2T(autoReadK2 ? 'voiceOn' : 'voiceOff');
  document.getElementById('k2LevelBadge').innerText = k2T(`stage${k2Level}`);
  updateSpeechUI(isSpeaking);
}

function setK2Language(lang) {
  k2Lang = K2_TEXT[lang] ? lang : 'en';
  speechLang = k2Lang;
  stopSpeech();
  applyK2Language();
  const playing = document.getElementById('k2StartBtn').classList.contains('k2-hidden');
  if (playing) renderPhishRound();   // same message, now in the new language
  else resetK2Intro();
}

function toggleK2Language() {
  soundClick();
  setK2Language(k2Lang === 'en' ? 'es' : 'en');
  if (autoReadK2) speakText(k2Say);
}


// Level 1 is easiest; each finished game moves up a level (max 3).
// "Start over" puts the next player back at level 1.
let k2Level = 1;

// Shuffled draw piles per level and type, refilled when they run low,
// so a message only repeats after the rest of its pile has been played.
const k2Piles = {};
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function drawFromPile(level, type, count) {
  const key = `${level}-${type}`;
  const pile = k2Piles[key] = k2Piles[key] || [];
  if (pile.length < count) {
    pile.push(...shuffle(PHISH_DECK.filter(s => s.level === level && s.type === type && !pile.includes(s))));
  }
  return pile.splice(0, count);
}
function dealK2Game() {
  const traps = Math.ceil(K2_ROUNDS / 2);
  return shuffle([...drawFromPile(k2Level, 'trap', traps), ...drawFromPile(k2Level, 'safe', K2_ROUNDS - traps)]);
}

function startOverK2() {
  soundClick();
  stopSpeech();
  k2Level = 1;
  resetK2Game();
  if (autoReadK2) speakText(k2Say);
}

let phishScenarios = [];

let phishRound = 0;
let phishScore = 0;

// Grizz Jr starts as a small 88px puppy in Level 1 and grows larger with every star and level-up (up to 256px in Level 3).
function k2PupScale(level = k2Level, stars = phishScore) {
  const clampedLevel = Math.max(1, Math.min(K2_MAX_LEVEL, level));
  const clampedStars = Math.max(0, Math.min(K2_ROUNDS, stars));
  const basePxByLevel = { 1: 88, 2: 152, 3: 208 };
  return basePxByLevel[clampedLevel] + clampedStars * 12;
}

function updateK2PupSize() {
  if (typeof document === 'undefined') return;
  const pup = document.getElementById('k2Pup');
  if (!pup) return;
  const clampedLevel = Math.max(1, Math.min(K2_MAX_LEVEL, k2Level));
  const px = k2PupScale(clampedLevel, phishScore);
  pup.dataset.level = String(clampedLevel);
  pup.style.width = `${px}px`;
  pup.style.height = `${px}px`;
  const badge = document.getElementById('k2LevelBadge');
  if (badge) badge.innerText = k2T(`stage${clampedLevel}`);
}

function renderStars() {
  const box = document.getElementById('k2Stars');
  box.innerHTML = '';
  phishScenarios.forEach((_, i) => {
    const s = document.createElement('span');
    s.className = 'k2-star' + (i < phishScore ? ' earned' : '');
    s.innerText = '⭐';
    box.appendChild(s);
  });
  updateK2PupSize();
}

function showK2(id, show) {
  document.getElementById(id).classList.toggle('k2-hidden', !show);
}

function resetK2Game() {
  phishScenarios = dealK2Game();
  phishRound = 0;
  phishScore = 0;
  renderStars();
  showK2('k2StartBtn', true);
  showK2('phishCard', false);
  showK2('k2Question', false);
  showK2('phishChoiceGrid', false);
  showK2('phishNextBtn', false);
  resetK2Intro();
}

function resetK2Intro() {
  updateK2PupSize();
  if (k2Level === 1) {
    setBubble(k2T('hiTitle'), k2T('hiText'));
    k2Say = k2T('hiSay');
  } else {
    setBubble(k2T('levelTitle', { n: k2Level }), k2T('levelText'));
    k2Say = k2T('levelSay', { n: k2Level });
  }
}

function startK2Game() {
  soundClick();
  showK2('k2StartBtn', false);
  renderPhishRound();
}

function renderPhishRound() {
  const scenario = phishScenarios[phishRound];
  document.getElementById('phishEmoji').innerText = scenario.icon;
  document.getElementById('phishFrom').innerText = k2Msg(scenario, 'from');
  document.getElementById('phishMsgText').innerText = k2Msg(scenario, 'text');
  // Re-trigger the card's entrance animation
  const card = document.getElementById('phishCard');
  card.classList.add('k2-hidden');
  void card.offsetWidth;
  card.classList.remove('k2-hidden');
  showK2('k2Question', true);
  showK2('phishChoiceGrid', true);
  showK2('phishNextBtn', false);
  renderStars();

  setBubble(k2T('roundTitle', { n: k2Level, i: phishRound + 1, total: phishScenarios.length }), k2T('roundText'));
  const who = k2Msg(scenario, 'from').replace(k2T('fromPrefix'), '').trim().toLowerCase();
  say(k2T('roundSay', { who, text: k2Msg(scenario, 'text') }));
}

function handlePhishChoice(choice) {
  soundClick();
  const scenario = phishScenarios[phishRound];
  showK2('phishChoiceGrid', false);
  showK2('k2Question', false);
  showK2('phishNextBtn', true);
  const nextBtn = document.getElementById('phishNextBtn');
  const pup = document.getElementById('k2Pup');

  if (choice === scenario.type) {
    soundSuccess();
    playPuppyBark();
    phishScore++;
    totalScore += 50;
    document.getElementById('scoreBadge').innerText = `⭐ XP: ${totalScore}`;
    renderStars();
    pup.classList.remove('happy'); void pup.offsetWidth; pup.classList.add('happy');
    const praise = k2T(scenario.type === 'trap' ? 'praiseTrap' : 'praiseSafe');
    setBubble(`🎉 ${praise}`, k2Msg(scenario, 'win'), 'good');
    const isLastRound = phishRound >= phishScenarios.length - 1;
    const endBtnKey = k2Level < K2_MAX_LEVEL ? 'levelUpButton' : 'badgeButton';
    nextBtn.innerText = k2T(isLastRound ? endBtnKey : 'next');
    nextBtn.dataset.retry = '';
    say(`${k2T('greatJob')} ${praise} ${k2Msg(scenario, 'win')}`);
  } else {
    // Gentle correction: no buzzer, no "wrong", just a hint and another try.
    setBubble(k2T('lookAgainTitle'), k2Msg(scenario, 'oops'), 'oops');
    nextBtn.innerText = k2T('tryAgain');
    nextBtn.dataset.retry = '1';
    playPuppyWhine();
    setTimeout(() => say(`${k2T('lookAgainSay')} ${k2Msg(scenario, 'oops')}`), 650);
  }
}

function nextPhishRound() {
  soundClick();
  stopSpeech();
  const nextBtn = document.getElementById('phishNextBtn');
  if (nextBtn.dataset.retry) {
    renderPhishRound();
    return;
  }

  phishRound++;
  if (phishRound >= phishScenarios.length) {
    triggerConfetti();
    soundSuccess();
    if (k2Level < K2_MAX_LEVEL) {
      k2Level++;
      playCheer();
      setTimeout(playPuppyBark, 300);
      resetK2Game();
      const pup = document.getElementById('k2Pup');
      if (pup) {
        pup.classList.remove('happy');
        void pup.offsetWidth;
        pup.classList.add('happy');
      }
      if (autoReadK2) {
        setTimeout(() => speakText(k2Say), 600);
      }
      return;
    }
    k2Level = 1;
    showModal({
      badge: k2T('badge'),
      flag: k2T('flag'),
      xp: 150,
      verdict: "ALL TRICKS SPOTTED 🏆"
    });
    resetK2Game();
    return;
  }
  renderPhishRound();
}
