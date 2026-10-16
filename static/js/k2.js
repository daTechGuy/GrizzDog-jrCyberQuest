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

function renderStars() {
  const box = document.getElementById('k2Stars');
  box.innerHTML = '';
  phishScenarios.forEach((_, i) => {
    const s = document.createElement('span');
    s.className = 'k2-star' + (i < phishScore ? ' earned' : '');
    s.innerText = '⭐';
    box.appendChild(s);
  });
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
  document.getElementById('k2LevelBadge').innerText = `Level ${k2Level}`;
  if (k2Level === 1) {
    setBubble("Hi! I'm Grizz Jr! 👋", 'Some messages are nice. Some messages are tricks! Can you help me tell them apart?');
    k2Say = "Hi! I'm Grizz Jr! Some messages are nice. Some messages are tricks! Can you help me tell them apart? Tap Let's Play to start!";
  } else {
    setBubble(`Level ${k2Level}! 🎉`, 'These are a little trickier. Look at who sent it, and what it asks for!');
    k2Say = `Level ${k2Level}! These are a little trickier. Look at who sent it, and what it asks for. Tap Let's Play!`;
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
  document.getElementById('phishFrom').innerText = scenario.from;
  document.getElementById('phishMsgText').innerText = scenario.text;
  // Re-trigger the card's entrance animation
  const card = document.getElementById('phishCard');
  card.classList.add('k2-hidden');
  void card.offsetWidth;
  card.classList.remove('k2-hidden');
  showK2('k2Question', true);
  showK2('phishChoiceGrid', true);
  showK2('phishNextBtn', false);
  renderStars();

  setBubble(`Level ${k2Level} • Message ${phishRound + 1} of ${phishScenarios.length}`, 'Look at who sent it. Is it safe, or a trick?');
  const who = scenario.from.replace('From:', '').trim().toLowerCase();
  say(`Here is a message from ${who}. It says: ${scenario.text} Is it safe, or a trick?`);
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
    const praise = scenario.type === 'trap' ? 'You found the trick!' : 'Yes, that one is safe!';
    setBubble(`🎉 ${praise}`, scenario.win, 'good');
    nextBtn.innerText = (phishRound >= phishScenarios.length - 1) ? 'Get my badge! 🏆' : 'Next ➡️';
    nextBtn.dataset.retry = '';
    say(`Great job! ${praise} ${scenario.win}`);
  } else {
    // Gentle correction: no buzzer, no "wrong", just a hint and another try.
    setBubble('Hmm, let\'s look again! 🔍', scenario.oops, 'oops');
    nextBtn.innerText = 'Try again 🔄';
    nextBtn.dataset.retry = '1';
    playPuppyWhine();
    setTimeout(() => say(`Hmm, let's look again. ${scenario.oops}`), 650);
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
    k2Level = Math.min(K2_MAX_LEVEL, k2Level + 1);
    triggerConfetti();
    soundSuccess();
    showModal({
      badge: "Junior Cyber Detective",
      flag: "🐾 You spotted every trick!",
      xp: 150,
      verdict: "ALL TRICKS SPOTTED 🏆"
    });
    resetK2Game();
    return;
  }
  renderPhishRound();
}
