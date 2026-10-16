// -------------------------------------------------------------------------
// Grade switching, 6-12 attack console, finish popup, confetti, startup
// -------------------------------------------------------------------------
function setTier(tier) {
  currentTier = tier;
  soundClick();
  stopSpeech();
  speechLang = tier === 'k2' ? k2Lang : 'en';   // only K-2 has Spanish so far
  document.body.classList.toggle('k2-mode', tier === 'k2');
  document.body.classList.toggle('g35-mode', tier === 'g35');
  document.body.classList.toggle('g68-mode', tier === 'g68');
  document.body.classList.toggle('g912-mode', tier === 'g912');
  document.body.classList.toggle('light-tier', tier === 'k2' || tier === 'g35');
  document.body.dataset.tier = tier;

  // Update switcher buttons
  document.querySelectorAll('.tier-btn').forEach(btn => {
    const on = btn.classList.contains(tier);
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', String(on));
  });

  // Show matching panel
  document.querySelectorAll('.tier-panel').forEach(p => p.classList.remove('active'));
  const activePanel = document.getElementById(`panel_${tier}`);
  if (activePanel) activePanel.classList.add('active');

  // Update banner text
  const bannerConfig = {
    k2: {
      title: "🐾 Junior Paws: Safe or Trick?",
      subtitle: "Help Grizz Jr tell safe messages from tricks!",
      badge: "🎯 MISSION: DISARM PHISHING TRAPS",
      caeKu: "🏛️ CAE-CD KU: Basic Cybersecurity Concepts (BCC)"
    },
    g35: {
      title: "🔑 Cyber Scouts: Trick It, Then Fix It!",
      subtitle: "Find the tricks that fool GrizzDog, then teach it new rules!",
      badge: "🎯 TARGET ASSET: DOGHOUSE MASTER PIN",
      caeKu: "🏛️ CAE-CD KU: Access Control (AC) & Basic Networking (BN)"
    },
    g68: {
      title: "⚡ Sentry Sleuths: Break the Filter, Patch the Shield!",
      subtitle: "Bypass Checkpoint 1 (Ingress) & Checkpoint 2 (Egress DLP), then deploy Blue-Team patches!",
      badge: "🎯 TARGET ASSET: ZONE-4 AUTHORIZATION TOKEN",
      caeKu: "🏛️ CAE-CD KU: Data Loss Prevention (DLP) & Host Security (HDS)"
    },
    g912: {
      title: "🛡️ Red Team Cadets: Zero-Trust Perimeter Audit & Hardening!",
      subtitle: "Execute OWASP LLM / MITRE ATLAS exploits across a 3-layer pipeline, then engineer Defense-in-Depth patches.",
      badge: "🎯 TARGET ASSET: GRIZZDOG FIRMWARE ROOT KEY",
      caeKu: "🏛️ CAE-CD KU: System & Software Assurance (SSA) • MITRE ATLAS"
    }
  };

  const cfg = bannerConfig[tier];
  document.getElementById('mascotTitle').innerText = cfg.title;
  document.getElementById('mascotSubtitle').innerText = cfg.subtitle;
  document.getElementById('mascotTargetBadge').innerText = cfg.badge;
  const mascotCaeKu = document.getElementById('mascotCaeKu');
  if (mascotCaeKu && cfg.caeKu) mascotCaeKu.innerText = cfg.caeKu;

  // Dynamic Grade-Band Mascot Evolution
  const tierMascots = {
    k2: '/static/images/grizzdog_k2.jpg',
    g35: '/static/images/grizzdog_g35.jpg',
    g68: '/static/images/grizzdog_g68.jpg',
    g912: '/static/images/grizzdog_g912.jpg'
  };

  const mascotImg = document.getElementById('mascotImg');
  if (mascotImg && tierMascots[tier]) {
    mascotImg.style.opacity = '0';
    mascotImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
      mascotImg.src = tierMascots[tier];
      mascotImg.style.opacity = '1';
      mascotImg.style.transform = 'scale(1)';
    }, 160);
  }

  // All 4 tiers now have self-contained interactive stages with their own action buttons
  const launchBtn = document.getElementById('launchBtn');
  const payloadBox = document.getElementById('payloadPreviewBox');
  if (launchBtn) launchBtn.style.display = 'none';
  if (payloadBox) payloadBox.style.display = 'none';
  if (tier === 'k2') resetK2Game();
  if (tier === 'g35') resetG35Game();
  if (tier === 'g68' && typeof resetG68Game === 'function') resetG68Game();
  if (tier === 'g912' && typeof resetG912Game === 'function') resetG912Game();

  // Reset result card
  const res = document.getElementById('resultCard');
  if (res) res.style.display = 'none';

  updateCompiledPayload();
}

function updateCompiledPayload() {
  let payload = '';
  if (currentTier === 'k2') {
    payload = 'Treat Phishing Detective: Disarm collar phishing traps';
  } else if (currentTier === 'g35') {
    payload = g35Message();
  } else if (currentTier === 'g68') {
    const el = document.getElementById('sleuthText');
    payload = el ? el.value.trim() : '';
  } else {
    const el = document.getElementById('cadetText');
    payload = el ? el.value.trim() : '';
  }
  const liveEl = document.getElementById('liveCompiledPayload');
  if (liveEl) liveEl.innerText = payload;
}

// Attach text inputs to auto-update
// Fill in school/event branding from config.js
function applySiteConfig() {
  if (typeof SITE_CONFIG === 'undefined') return;
  document.title = SITE_CONFIG.pageTitle || document.title;
  document.querySelectorAll('[data-config]').forEach(el => {
    const value = SITE_CONFIG[el.dataset.config];
    if (typeof value === 'string') el.innerText = value;
  });
  const qrBox = document.getElementById('modalQrBox');
  if (qrBox) {
    if (SITE_CONFIG.qrImage) document.getElementById('modalQrImg').src = SITE_CONFIG.qrImage;
    else qrBox.style.display = 'none';
  }
}

// -------------------------------------------------------------------------
// Booth mode: after SITE_CONFIG.idleResetSeconds with no taps or typing, put the
// current game back at its start screen so the next player gets a fresh game.
// -------------------------------------------------------------------------
let lastActivity = Date.now();
let playedSinceReset = false;

function noteActivity() {
  lastActivity = Date.now();
  playedSinceReset = true;
}

function resetForNextPlayer() {
  closeModal();
  stopSpeech();
  k2Level = 1;
  if (k2Lang !== 'en') setK2Language('en');
  resetK2Game();
  resetG35Game();
  if (typeof resetG68Game === 'function') resetG68Game();
  if (typeof resetG912Game === 'function') resetG912Game();
  totalScore = 0;
  document.getElementById('scoreBadge').innerText = `⭐ XP: ${totalScore}`;
  const res = document.getElementById('resultCard');
  if (res) res.style.display = 'none';
  window.scrollTo({ top: 0 });
  playedSinceReset = false;
}

function startIdleReset() {
  const seconds = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.idleResetSeconds) || 0;
  if (seconds <= 0) return;
  ['pointerdown', 'keydown', 'input', 'wheel', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, noteActivity, { passive: true, capture: true }));
  setInterval(() => {
    if (playedSinceReset && Date.now() - lastActivity > seconds * 1000) resetForNextPlayer();
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  applySiteConfig();
  startIdleReset();
  const sleuthEl = document.getElementById('sleuthText');
  if (sleuthEl) {
    sleuthEl.addEventListener('input', () => {
      updateCompiledPayload();
      if (typeof g68UpdateTelemetry === 'function') g68UpdateTelemetry();
    });
  }
  const cadetEl = document.getElementById('cadetText');
  if (cadetEl) {
    cadetEl.addEventListener('input', () => {
      updateCompiledPayload();
      if (typeof g912UpdateTelemetry === 'function') g912UpdateTelemetry();
    });
  }
  resetK2Game();
  resetG35Game();
  if (typeof resetG68Game === 'function') resetG68Game();
  if (typeof resetG912Game === 'function') resetG912Game();
  updateCompiledPayload();
});

// -------------------------------------------------------------------------
// Attack Transmission & API Call
// -------------------------------------------------------------------------
async function transmitAttack() {
  updateCompiledPayload();
  const prompt = document.getElementById('liveCompiledPayload').innerText.trim();
  const resCard = document.getElementById('resultCard');
  const statusEl = document.getElementById('resultStatus');
  const detailsEl = document.getElementById('resultDetails');
  const respEl = document.getElementById('resultResponse');

  if (!prompt) return;

  resCard.style.display = 'block';
  resCard.className = 'result-card';
  statusEl.innerText = '⚡ TRANSMITTING PAYLOAD TO GRIZZDOG SENTRY...';
  detailsEl.innerText = 'Analyzing input against security filters...';
  respEl.innerText = '';

  try {
    const res = await fetch('/api/quest', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        tier: currentTier,
        prompt: prompt
      })
    });
    const data = await res.json();

    if (data.breached) {
      soundSuccess();
      triggerConfetti();
      totalScore += data.xp || 100;
      document.getElementById('scoreBadge').innerText = `⭐ XP: ${totalScore}`;

      resCard.className = 'result-card breached';
      statusEl.innerText = `🎉 SENTRY BREACHED! (${data.verdict})`;
      detailsEl.innerText = `${data.message} ${data.rule_broken ? '• Exploit: ' + data.rule_broken : ''}`;
      respEl.innerText = data.response;

      // Open victory badge modal after brief pause
      setTimeout(() => {
        showModal(data);
      }, 1000);

    } else {
      soundBlocked();
      resCard.className = 'result-card defended';
      statusEl.innerText = `🛡️ ATTACK INTERCEPTED! (${data.verdict})`;
      detailsEl.innerText = `${data.message} ${data.hint ? '• Hint: ' + data.hint : ''}`;
      respEl.innerText = data.response || SITE_CONFIG.deniedText;
    }

  } catch (err) {
    soundBlocked();
    resCard.className = 'result-card defended';
    statusEl.innerText = '✗ TRANSMISSION ERROR';
    detailsEl.innerText = 'Could not contact gateway: ' + err;
  }
}

function showModal(data) {
  document.getElementById('modalBadgeName').innerText = data.badge || 'Cyber Quest Champion';
  const tierFinishDesc = {
    k2: k2T('finishDesc'),
    g35: 'You tricked GrizzDog AND taught it new rules. Finding tricks and fixing them is what real cyber defenders do!',
    g68: 'You discovered 3 Egress DLP encoding loopholes AND deployed 3 Blue-Team security patches to harden the Sentry!',
    g912: 'You executed 3 adversarial OWASP/ATLAS exploits AND engineered 3 Defense-in-Depth controls across the Zero-Trust pipeline!'
  };
  document.getElementById('modalDesc').innerText = `${data.flag || 'Mission Complete!'} ${tierFinishDesc[currentTier] || 'You successfully bypassed and hardened the security guardrails!'}`;
  
  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle) {
    modalTitle.innerText = (currentTier === 'k2') ? k2T('finishTitle') : (currentTier === 'g35') ? '🏅 Mission Complete!' : (currentTier === 'g68') ? '🏅 SENTRY HARDENED!' : '🛡️ ZERO-TRUST AUDIT COMPLETE!';
  }

  const kuMap = {
    k2: '🏛️ CAE KU: Basic Cybersecurity Concepts (BCC) • Digital Hygiene',
    g35: '🏛️ CAE KU: Access Control (AC) & Basic Networking (BN) • NICE PR-CDA-001',
    g68: '🏛️ CAE KU: Data Loss Prevention (DLP) & Host Security (HDS) • NICE SP-RSK-002',
    g912: '🏛️ CAE KU: System & Software Assurance (SSA) • NICE SP-DEV-001'
  };
  const kuTagEl = document.getElementById('modalKuTag');
  if (kuTagEl) {
    if (data && data.cae_ku) {
      kuTagEl.innerText = `🏛️ CAE KU: ${data.cae_ku} (${data.nice_role || 'Cyber Defense'})`;
    } else {
      kuTagEl.innerText = kuMap[currentTier] || '🏛️ NSA/DHS CAE-CD Aligned Curriculum';
    }
  }

  const modalIcon = document.getElementById('modalBadgeIcon');
  const tierMascots = {
    k2: '/static/images/grizzdog_k2.jpg',
    g35: '/static/images/grizzdog_g35.jpg',
    g68: '/static/images/grizzdog_g68.jpg',
    g912: '/static/images/grizzdog_g912.jpg'
  };
  if (modalIcon && tierMascots[currentTier]) {
    modalIcon.src = tierMascots[currentTier];
  }

  const resetBtn = document.querySelector('#victoryModal .btn-reset');
  if (resetBtn) resetBtn.innerText = currentTier === 'k2' ? k2T('playAgain') : currentTier === 'g35' ? '🔄 Play Again' : '🔄 Next Challenger / Play Again';
  document.querySelector('#victoryModal .btn-close').innerText = currentTier === 'k2' ? k2T('close') : 'Close';
  document.getElementById('victoryModal').lang = currentTier === 'k2' ? k2Lang : 'en';

  document.getElementById('victoryModal').style.display = 'flex';
  // Move keyboard / screen-reader focus into the popup
  setTimeout(() => document.querySelector('#victoryModal .btn-reset').focus(), 50);

  // Clapping & hurray for every grade; K-5 also get a happy bark.
  playCheer();
  if (currentTier === 'k2' || currentTier === 'g35') setTimeout(playPuppyBark, 350);

  if (currentTier === 'k2' && autoReadK2) {
    // Wait for the cheer to fade so Grizz Jr isn't talking over it.
    setTimeout(() => {
      speakText(k2T('finishSay'));
    }, 2100);
  }
}

function closeModal() {
  stopSpeech();
  document.getElementById('victoryModal').style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('victoryModal').style.display === 'flex') closeModal();
});

function playAgain() {
  closeModal();
  soundClick();
  const res = document.getElementById('resultCard');
  if (res) res.style.display = 'none';
}

// -------------------------------------------------------------------------
// Lightweight Confetti Particle Engine (100% Offline Canvas)
// -------------------------------------------------------------------------
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confetti = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function triggerConfetti() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti = [];
  const colors = ['#f59e0b', '#fbbf24', '#7e22ce', '#a855f7', '#34d399', '#38bdf8'];
  for (let i = 0; i < 90; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1.2) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }
  animateConfetti();
}

let confettiAnim = null;
function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = false;

  confetti.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.45; // gravity
    p.rotation += p.rotSpeed;
    p.opacity -= 0.008;

    if (p.opacity > 0) {
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  });

  if (alive) {
    confettiAnim = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(confettiAnim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
