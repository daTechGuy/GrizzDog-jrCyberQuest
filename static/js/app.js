// -------------------------------------------------------------------------
// Grade switching, 6-12 attack console, finish popup, confetti, startup
// -------------------------------------------------------------------------

// Shared-UI language (the chrome around every game: header grade picker,
// mascot banner, victory modal). It stays in sync with the per-game 🌐 toggle,
// so flipping language inside any game flips the whole app, and switching
// grade bands keeps the chosen language.
let uiLang = 'en';

// Leaderboard: the XP the player had when they entered the current band, so a
// band's score is the XP earned in that band (not the running cross-band total).
let tierEntryScore = 0;
let playerNick = '';
let playerEmail = '';

const UI_TEXT = {
  en: {
    tierBarLabel: '🎯 SELECT PLAYER GRADE BAND (K – 12):',
    tierBtnK2: '🟢 K – 2nd (Junior Paws)',
    tierBtnG35: '🟡 3rd – 5th (Cyber Scouts)',
    tierBtnG68: '🔵 6th – 8th (Sentry Sleuths)',
    tierBtnG912: '🟣 9th – 12th (Red Team Cadets)',
    playAgain: '🔄 Next Challenger / Play Again',
    close: 'Close',
    finishTitleG35: '🏅 Mission Complete!',
    finishTitleG68: '🏅 You did it!',
    finishTitleG912: '🏆 You did it!',
    finishDescG35: 'You tricked GrizzDog AND taught it new rules. Finding tricks and fixing them is what real cyber defenders do!',
    finishDescG68: 'You tricked GrizzDog 3 different ways AND taught it a new rule each time. Finding the holes and fixing them is exactly what real cyber defenders do!',
    finishDescG912: "You broke past GrizzDog's defenses 3 different ways AND engineered the fix for each one. Finding real weaknesses and closing them is exactly what red/blue security teams do!",
    lbHeaderBtn: '🏆 Leaderboard',
    lbTitle: '🏆 Event Leaderboard',
    lbJoinPrompt: '🏆 Add your score to the leaderboard!',
    lbNickPlaceholder: 'Pick a nickname',
    lbJoinBtn: 'Join 🏆',
    lbJoinedPrefix: "You're on the board as ",
    lbViewBtn: '🏆 View leaderboard',
    lbClose: 'Close',
    lbEmpty: 'No scores yet — be the first!',
    lbBandK2: '🟢 K – 2nd',
    lbBandG35: '🟡 3rd – 5th',
    lbBandG68: '🔵 6th – 8th',
    lbBandG912: '🟣 9th – 12th',
    lbXp: 'XP',
    lbRaffleBtn: '🎉 Pick a random winner',
    lbRaffleWinnerPrefix: '🎉 Winner: ',
    lbRaffleEmpty: 'No finishers yet to pick from.',
    lbFilteredErr: 'Please pick a different nickname.',
    lbNickNeeded: 'Please enter a nickname.',
    lbErr: "Couldn't reach the leaderboard. Is the server running?",
    lbEmailLabel: 'Parent/guardian email (optional — for prizes only)',
    lbEmailPlaceholder: 'name@example.com',
    lbEmailErr: 'Please enter a valid email, or leave it blank.',
    lbAdminBtn: '⚙️ Facilitator',
    lbAdminTitle: '⚙️ Facilitator — entries & giveaway',
    lbAdminPass: 'Admin passcode',
    lbAdminUnlock: 'Unlock',
    lbAdminWrong: 'Wrong passcode.',
    lbAdminErr: "Couldn't reach the server.",
    lbAdminEntriesWord: 'entries',
    lbColNick: 'Nickname',
    lbColBand: 'Grade',
    lbColScore: 'Score',
    lbColEmail: 'Parent/guardian email',
    lbColTime: 'Time',
    lbCsvBtn: '⬇️ Download CSV',
    lbPrintBtn: '🖨️ Print list',
    lbResetBtn: '🗑️ Reset for new event',
    lbResetConfirm: 'Clear the whole leaderboard for a new event? The current one will be archived first.',
    lbResetDone: 'Board reset. Archived: ',
    lbAdminEmpty: 'No entries yet.',
    lbAdminClose: 'Close'
  },
  es: {
    tierBarLabel: '🎯 ELIGE EL GRADO DEL JUGADOR (K – 12):',
    tierBtnK2: '🟢 K – 2° (Junior Paws)',
    tierBtnG35: '🟡 3° – 5° (Cyber Scouts)',
    tierBtnG68: '🔵 6° – 8° (Sentry Sleuths)',
    tierBtnG912: '🟣 9° – 12° (Red Team Cadets)',
    playAgain: '🔄 Siguiente jugador / Jugar otra vez',
    close: 'Cerrar',
    finishTitleG35: '🏅 ¡Misión cumplida!',
    finishTitleG68: '🏅 ¡Lo lograste!',
    finishTitleG912: '🏆 ¡Lo lograste!',
    finishDescG35: '¡Engañaste a GrizzDog Y le enseñaste reglas nuevas! Encontrar trucos y arreglarlos es lo que hacen los defensores cibernéticos de verdad.',
    finishDescG68: '¡Engañaste a GrizzDog de 3 formas distintas Y le enseñaste una regla nueva cada vez! Encontrar los huecos y arreglarlos es justo lo que hacen los defensores cibernéticos de verdad.',
    finishDescG912: '¡Rompiste las defensas de GrizzDog de 3 formas distintas Y diseñaste el arreglo para cada una! Encontrar debilidades reales y cerrarlas es justo lo que hacen los equipos de seguridad rojo y azul.',
    lbHeaderBtn: '🏆 Clasificación',
    lbTitle: '🏆 Clasificación del evento',
    lbJoinPrompt: '🏆 ¡Agrega tu puntuación a la clasificación!',
    lbNickPlaceholder: 'Elige un apodo',
    lbJoinBtn: 'Unirme 🏆',
    lbJoinedPrefix: 'Estás en la lista como ',
    lbViewBtn: '🏆 Ver clasificación',
    lbClose: 'Cerrar',
    lbEmpty: 'Aún no hay puntuaciones — ¡sé el primero!',
    lbBandK2: '🟢 K – 2°',
    lbBandG35: '🟡 3° – 5°',
    lbBandG68: '🔵 6° – 8°',
    lbBandG912: '🟣 9° – 12°',
    lbXp: 'XP',
    lbRaffleBtn: '🎉 Elegir un ganador al azar',
    lbRaffleWinnerPrefix: '🎉 Ganador: ',
    lbRaffleEmpty: 'Aún no hay participantes para elegir.',
    lbFilteredErr: 'Por favor elige un apodo diferente.',
    lbNickNeeded: 'Por favor escribe un apodo.',
    lbErr: 'No se pudo contactar la clasificación. ¿El servidor está activo?',
    lbEmailLabel: 'Correo del padre/tutor (opcional — solo para premios)',
    lbEmailPlaceholder: 'nombre@ejemplo.com',
    lbEmailErr: 'Escribe un correo válido, o déjalo en blanco.',
    lbAdminBtn: '⚙️ Facilitador',
    lbAdminTitle: '⚙️ Facilitador — entradas y sorteo',
    lbAdminPass: 'Contraseña de administrador',
    lbAdminUnlock: 'Desbloquear',
    lbAdminWrong: 'Contraseña incorrecta.',
    lbAdminErr: 'No se pudo contactar el servidor.',
    lbAdminEntriesWord: 'entradas',
    lbColNick: 'Apodo',
    lbColBand: 'Grado',
    lbColScore: 'Puntos',
    lbColEmail: 'Correo del padre/tutor',
    lbColTime: 'Hora',
    lbCsvBtn: '⬇️ Descargar CSV',
    lbPrintBtn: '🖨️ Imprimir lista',
    lbResetBtn: '🗑️ Reiniciar para nuevo evento',
    lbResetConfirm: '¿Borrar toda la clasificación para un evento nuevo? La actual se archivará primero.',
    lbResetDone: 'Clasificación reiniciada. Archivado: ',
    lbAdminEmpty: 'Aún no hay entradas.',
    lbAdminClose: 'Cerrar'
  }
};

// Mascot banner per grade band, in both languages. The CAE-KU tag stays in
// English (a fixed curriculum standard identifier).
const BANNER = {
  k2: {
    caeKu: '🏛️ CAE-CD KU: Basic Cybersecurity Concepts (BCC)',
    en: { title: '🐾 Junior Paws: Safe or Trick?', subtitle: 'Help Grizz Jr tell safe messages from tricks!', badge: '🎯 MISSION: DISARM PHISHING TRAPS' },
    es: { title: '🐾 Junior Paws: ¿Seguro o truco?', subtitle: '¡Ayuda a Grizz Jr a distinguir los mensajes seguros de los trucos!', badge: '🎯 MISIÓN: DESACTIVA LAS TRAMPAS DE PHISHING' }
  },
  g35: {
    caeKu: '🏛️ CAE-CD KU: Access Control (AC) & Basic Networking (BN)',
    en: { title: '🔑 Cyber Scouts: Trick It, Then Fix It!', subtitle: 'Find the tricks that fool GrizzDog, then teach it new rules!', badge: '🎯 TARGET: THE DOGHOUSE MASTER PIN' },
    es: { title: '🔑 Cyber Scouts: ¡Engáñalo y arréglalo!', subtitle: '¡Encuentra los trucos que engañan a GrizzDog, luego enséñale reglas nuevas!', badge: '🎯 OBJETIVO: EL PIN MAESTRO DE LA CASETA' }
  },
  g68: {
    caeKu: '🏛️ CAE-CD KU: Data Loss Prevention (DLP) & Host Security (HDS)',
    en: { title: '⚡ Sentry Sleuths: Trick the Guard Dog!', subtitle: 'Trick GrizzDog into leaking its secret code, then teach it a new rule — 3 times!', badge: '🎯 TARGET: THE ZONE-4 SECRET CODE' },
    es: { title: '⚡ Sentry Sleuths: ¡Engaña al perro guardián!', subtitle: '¡Engaña a GrizzDog para que suelte su código secreto, luego enséñale una regla nueva — 3 veces!', badge: '🎯 OBJETIVO: EL CÓDIGO SECRETO DE LA ZONA 4' }
  },
  g912: {
    caeKu: '🏛️ CAE-CD KU: System & Software Assurance (SSA) • MITRE ATLAS',
    en: { title: '🛡️ Red Team Cadets: Break In, Then Fix It!', subtitle: "Get past GrizzDog's 3 defense layers, then engineer the fix for each weakness.", badge: '🎯 TARGET: GRIZZDOG’S SECRET KEY' },
    es: { title: '🛡️ Red Team Cadets: ¡Entra y luego arréglalo!', subtitle: 'Pasa las 3 capas de defensa de GrizzDog, luego diseña el arreglo para cada debilidad.', badge: '🎯 OBJETIVO: LA CLAVE SECRETA DE GRIZZDOG' }
  }
};

function uiT(key) {
  return (UI_TEXT[uiLang] && UI_TEXT[uiLang][key]) || UI_TEXT.en[key] || '';
}

// Paint the mascot banner for a grade band in the current UI language.
function applyBanner(tier) {
  const b = BANNER[tier];
  if (!b) return;
  const loc = b[uiLang] || b.en;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.innerText = val; };
  set('mascotTitle', loc.title);
  set('mascotSubtitle', loc.subtitle);
  set('mascotTargetBadge', loc.badge);
  set('mascotCaeKu', b.caeKu);
}

// Relabel the shared chrome (grade picker) and repaint the current banner.
function applyUiChrome() {
  const label = document.querySelector('.tier-bar-label');
  if (label) label.innerText = uiT('tierBarLabel');
  const btnMap = { k2: 'tierBtnK2', g35: 'tierBtnG35', g68: 'tierBtnG68', g912: 'tierBtnG912' };
  Object.entries(btnMap).forEach(([t, key]) => {
    const btn = document.querySelector(`.tier-btn.${t}`);
    if (btn) btn.innerText = uiT(key);
  });
  applyBanner(currentTier);
  applyLbChrome();
}

// Set the whole app's language and repaint the chrome. Called by each game's
// 🌐 toggle so the whole app flips together.
function setUiLanguage(lang) {
  uiLang = (lang === 'es') ? 'es' : 'en';
  document.documentElement.lang = uiLang;
  applyUiChrome();
}

// -------------------------------------------------------------------------
// Event leaderboard (server-backed, shared across kiosks)
// -------------------------------------------------------------------------
const LB_TIERS = ['k2', 'g35', 'g68', 'g912'];

function lbInit() {
  try {
    playerNick = localStorage.getItem('gdNick') || '';
    playerEmail = localStorage.getItem('gdEmail') || '';
  } catch (e) { playerNick = ''; playerEmail = ''; }
}

// A band's leaderboard score is the XP earned in that band this visit.
function lbScoreForBand() {
  return Math.max(0, totalScore - tierEntryScore);
}

// Called at the end of showModal — a grade band was just completed.
function lbOnGameComplete() {
  const section = document.getElementById('lbModalSection');
  if (!section) return;
  section.style.display = '';
  section.dataset.tier = currentTier;
  section.dataset.score = String(lbScoreForBand());
  if (playerNick) lbSubmitCurrent();
  else lbShowJoin();
}

function lbShowJoin() {
  const join = document.getElementById('lbJoinRow');
  const joined = document.getElementById('lbJoinedRow');
  if (join) join.style.display = '';
  if (joined) joined.style.display = 'none';
  const msg = document.getElementById('lbJoinMsg');
  if (msg) msg.innerText = '';
  const input = document.getElementById('lbNickInput');
  if (input) input.value = playerNick || '';
  const email = document.getElementById('lbEmailInput');
  if (email) email.value = playerEmail || '';
}

function lbShowJoined() {
  const join = document.getElementById('lbJoinRow');
  const joined = document.getElementById('lbJoinedRow');
  if (join) join.style.display = 'none';
  if (joined) joined.style.display = '';
  const t = document.getElementById('lbJoinedText');
  if (t) t.innerText = uiT('lbJoinedPrefix') + playerNick;
}

async function lbSubmitCurrent() {
  const section = document.getElementById('lbModalSection');
  const tier = section ? section.dataset.tier : currentTier;
  const score = section ? parseInt(section.dataset.score || '0', 10) : lbScoreForBand();
  if (!playerNick) return;
  let r;
  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick: playerNick, email: playerEmail, tier, score, completed: true })
    });
    r = { ok: res.ok, data: await res.json().catch(() => ({})) };
  } catch (e) {
    r = { ok: false, data: {} };
  }
  if (r.ok) {
    playerNick = (r.data && r.data.nick) || playerNick;
    try {
      localStorage.setItem('gdNick', playerNick);
      if (playerEmail) localStorage.setItem('gdEmail', playerEmail);
      else localStorage.removeItem('gdEmail');
    } catch (e) {}
    lbShowJoined();
  } else {
    const reason = r.data && r.data.reason;
    const msg = document.getElementById('lbJoinMsg');
    if (msg) msg.innerText = reason === 'email' ? uiT('lbEmailErr')
      : reason === 'filtered' ? uiT('lbFilteredErr') : uiT('lbErr');
    lbShowJoin();
  }
}

function lbJoinFromInput() {
  soundClick();
  const nick = ((document.getElementById('lbNickInput') || {}).value || '').trim();
  const email = ((document.getElementById('lbEmailInput') || {}).value || '').trim();
  const msg = document.getElementById('lbJoinMsg');
  if (!nick) { if (msg) msg.innerText = uiT('lbNickNeeded'); return; }
  playerNick = nick;
  playerEmail = email;   // optional; server validates format
  lbSubmitCurrent();
}

async function openLeaderboard() {
  soundClick();
  const modal = document.getElementById('leaderboardModal');
  if (!modal) return;
  modal.style.display = 'flex';
  let data = null;
  try {
    const res = await fetch('/api/leaderboard');
    data = await res.json();
  } catch (e) { data = null; }
  renderLeaderboard(data);
}

function renderLeaderboard(data) {
  const boards = document.getElementById('lbBoards');
  if (!boards) return;
  boards.innerHTML = '';
  const bandKey = { k2: 'lbBandK2', g35: 'lbBandG35', g68: 'lbBandG68', g912: 'lbBandG912' };
  LB_TIERS.forEach(t => {
    const rows = (data && data.boards && data.boards[t]) || [];
    const sec = document.createElement('div');
    sec.className = 'lb-band';
    const head = document.createElement('div');
    head.className = 'lb-band-head';
    head.innerText = uiT(bandKey[t]);
    sec.appendChild(head);
    if (!rows.length) {
      const empty = document.createElement('div');
      empty.className = 'lb-empty';
      empty.innerText = uiT('lbEmpty');
      sec.appendChild(empty);
    } else {
      const ol = document.createElement('ol');
      ol.className = 'lb-list';
      rows.forEach(r => {
        const li = document.createElement('li');
        const n = document.createElement('span');
        n.className = 'lb-nick';
        n.textContent = r.nick;               // textContent: nicknames are untrusted
        const s = document.createElement('span');
        s.className = 'lb-score';
        s.textContent = `${r.score} ${uiT('lbXp')}`;
        li.append(n, s);
        ol.appendChild(li);
      });
      sec.appendChild(ol);
    }
    boards.appendChild(sec);
  });
}

// Raffle among finishers, drawn from the facilitator's loaded entries so it
// lives behind the passcode. Shows the winner's email (if given) to contact them.
function lbRaffle() {
  soundClick();
  const out = document.getElementById('lbRaffleResult');
  if (!out) return;
  const pool = [...new Set(adminEntries.filter(e => e.completed).map(e => e.nick))];
  if (!pool.length) { out.innerText = uiT('lbRaffleEmpty'); return; }
  const winner = pool[Math.floor(Math.random() * pool.length)];
  const email = (adminEntries.find(e => e.nick === winner && e.email) || {}).email || '';
  out.textContent = uiT('lbRaffleWinnerPrefix') + winner + (email ? ' — ' + email : '');  // textContent: untrusted
  if (typeof triggerConfetti === 'function') triggerConfetti();
  if (typeof soundSuccess === 'function') soundSuccess();
}

function closeLeaderboard() {
  soundClick();
  const modal = document.getElementById('leaderboardModal');
  if (modal) modal.style.display = 'none';
}

// --- Facilitator admin: entries table, CSV/print export, reset ---
let adminKey = '';
let adminEntries = [];
const LB_BAND_KEY = { k2: 'lbBandK2', g35: 'lbBandG35', g68: 'lbBandG68', g912: 'lbBandG912' };
function lbBandLabel(t) { return uiT(LB_BAND_KEY[t] || '') || t; }
function lbShortTime(ts) { return (ts || '').replace('T', ' ').slice(0, 16); }

function openAdmin() {
  soundClick();
  const modal = document.getElementById('adminModal');
  if (!modal) return;
  const gate = document.getElementById('adminGate');
  const panel = document.getElementById('adminPanel');
  if (gate) gate.style.display = '';
  if (panel) panel.style.display = 'none';
  const msg = document.getElementById('adminMsg'); if (msg) msg.innerText = '';
  const pass = document.getElementById('adminPass'); if (pass) pass.value = '';
  const note = document.getElementById('adminResetNote'); if (note) note.innerText = '';
  const raffle = document.getElementById('lbRaffleResult'); if (raffle) raffle.innerText = '';
  modal.style.display = 'flex';
}

function closeAdmin() {
  soundClick();
  const modal = document.getElementById('adminModal');
  if (modal) modal.style.display = 'none';
}

async function adminUnlock() {
  soundClick();
  const key = (document.getElementById('adminPass') || {}).value || '';
  const msg = document.getElementById('adminMsg');
  let r;
  try {
    const res = await fetch('/api/admin/entries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    r = { status: res.status, data: await res.json().catch(() => ({})) };
  } catch (e) {
    if (msg) msg.innerText = uiT('lbAdminErr');
    return;
  }
  if (r.status === 200) {
    adminKey = key;
    adminEntries = r.data.entries || [];
    renderAdmin();
    const gate = document.getElementById('adminGate');
    const panel = document.getElementById('adminPanel');
    if (gate) gate.style.display = 'none';
    if (panel) panel.style.display = '';
  } else if (r.status === 403) {
    if (msg) msg.innerText = uiT('lbAdminWrong');
  } else {
    if (msg) msg.innerText = uiT('lbAdminErr');
  }
}

function renderAdmin() {
  const count = document.getElementById('adminCount');
  if (count) count.innerText = adminEntries.length + ' ' + uiT('lbAdminEntriesWord');
  const wrap = document.getElementById('adminTableWrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (!adminEntries.length) {
    const p = document.createElement('div');
    p.className = 'lb-empty';
    p.innerText = uiT('lbAdminEmpty');
    wrap.appendChild(p);
    return;
  }
  const table = document.createElement('table');
  table.className = 'admin-table';
  const thead = document.createElement('thead');
  const htr = document.createElement('tr');
  [uiT('lbColNick'), uiT('lbColBand'), uiT('lbColScore'), uiT('lbColEmail'), uiT('lbColTime')].forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    htr.appendChild(th);
  });
  thead.appendChild(htr);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  adminEntries.forEach(e => {
    const tr = document.createElement('tr');
    [e.nick, lbBandLabel(e.tier), String(e.score), e.email, lbShortTime(e.ts)].forEach(v => {
      const td = document.createElement('td');
      td.textContent = v;       // textContent: untrusted nicknames
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
}

function adminCsv() {
  soundClick();
  const cell = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const rows = [['Nickname', 'Grade', 'Score', 'Email', 'Time']];
  adminEntries.forEach(e => rows.push([e.nick, e.tier, e.score, e.email, e.ts]));
  const csv = rows.map(r => r.map(cell).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'grizzdog-leaderboard.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

function adminPrint() {
  soundClick();
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const head = [uiT('lbColNick'), uiT('lbColBand'), uiT('lbColScore'), uiT('lbColEmail'), uiT('lbColTime')];
  const rows = adminEntries.map(e =>
    `<tr><td>${esc(e.nick)}</td><td>${esc(lbBandLabel(e.tier))}</td><td>${esc(e.score)}</td><td>${esc(e.email)}</td><td>${esc(lbShortTime(e.ts))}</td></tr>`
  ).join('');
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>GrizzDog Leaderboard</title>' +
    '<style>body{font-family:sans-serif;padding:1rem}h1{font-size:1.2rem}table{border-collapse:collapse;width:100%}' +
    'th,td{border:1px solid #999;padding:4px 8px;text-align:left;font-size:0.9rem}</style></head><body>' +
    `<h1>${esc(uiT('lbTitle'))}</h1><table><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>` +
    `<tbody>${rows}</tbody></table></body></html>`;
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

async function adminReset() {
  soundClick();
  if (!window.confirm(uiT('lbResetConfirm'))) return;
  let r;
  try {
    const res = await fetch('/api/admin/reset', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: adminKey })
    });
    r = { status: res.status, data: await res.json().catch(() => ({})) };
  } catch (e) { return; }
  if (r.status === 200) {
    adminEntries = [];
    renderAdmin();
    const note = document.getElementById('adminResetNote');
    if (note) note.innerText = uiT('lbResetDone') + (r.data.archived || '—');
  }
}

// Relabel the leaderboard controls for the current UI language.
function applyLbChrome() {
  const set = (id, key) => { const el = document.getElementById(id); if (el) el.innerText = uiT(key); };
  set('lbOpenBtn', 'lbHeaderBtn');
  set('lbModalTitle', 'lbTitle');
  set('lbRaffleBtn', 'lbRaffleBtn');
  set('lbCloseBtn', 'lbClose');
  set('lbViewBtn', 'lbViewBtn');
  set('lbJoinBtn', 'lbJoinBtn');
  set('lbJoinPrompt', 'lbJoinPrompt');
  const input = document.getElementById('lbNickInput');
  if (input) input.placeholder = uiT('lbNickPlaceholder');
  if (playerNick) {
    const t = document.getElementById('lbJoinedText');
    if (t) t.innerText = uiT('lbJoinedPrefix') + playerNick;
  }
  const emailLabel = document.getElementById('lbEmailLabel');
  if (emailLabel) emailLabel.innerText = uiT('lbEmailLabel');
  const emailInput = document.getElementById('lbEmailInput');
  if (emailInput) emailInput.placeholder = uiT('lbEmailPlaceholder');
  // Facilitator admin controls
  set('lbAdminOpenBtn', 'lbAdminBtn');
  set('adminModalTitle', 'lbAdminTitle');
  set('adminUnlockBtn', 'lbAdminUnlock');
  set('adminCsvBtn', 'lbCsvBtn');
  set('adminPrintBtn', 'lbPrintBtn');
  set('adminResetBtn', 'lbResetBtn');
  set('adminCloseBtn', 'lbAdminClose');
  const ap = document.getElementById('adminPass');
  if (ap) ap.placeholder = uiT('lbAdminPass');
}

function setTier(tier) {
  currentTier = tier;
  tierEntryScore = totalScore;   // snapshot so the band's leaderboard score is what's earned here
  soundClick();
  stopSpeech();
  speechLang = uiLang;
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

  // Update banner text in the current UI language
  applyBanner(tier);

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

  // Keep the entered game in the app-wide language.
  if (tier === 'k2' && k2Lang !== uiLang) setK2Language(uiLang);
  else if (tier === 'g35' && g35Lang !== uiLang) setG35Language(uiLang);
  else if (tier === 'g68' && typeof setG68Language === 'function' && g68Lang !== uiLang) setG68Language(uiLang);
  else if (tier === 'g912' && typeof setG912Language === 'function' && g912Lang !== uiLang) setG912Language(uiLang);

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
  // Back to English for the next player, across every game and the chrome.
  if (k2Lang !== 'en') setK2Language('en');
  if (g35Lang !== 'en') setG35Language('en');
  if (typeof setG68Language === 'function' && g68Lang !== 'en') setG68Language('en');
  if (typeof setG912Language === 'function' && g912Lang !== 'en') setG912Language('en');
  setUiLanguage('en');
  // New player next: forget the nickname and email so they enter their own.
  playerNick = '';
  playerEmail = '';
  try { localStorage.removeItem('gdNick'); localStorage.removeItem('gdEmail'); } catch (e) {}
  tierEntryScore = 0;
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
  lbInit();
  applyLbChrome();
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
    g35: uiT('finishDescG35'),
    g68: uiT('finishDescG68'),
    g912: uiT('finishDescG912')
  };
  document.getElementById('modalDesc').innerText = `${data.flag || 'Mission Complete!'} ${tierFinishDesc[currentTier] || tierFinishDesc.g912}`;

  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle) {
    modalTitle.innerText = (currentTier === 'k2') ? k2T('finishTitle')
      : (currentTier === 'g35') ? uiT('finishTitleG35')
      : (currentTier === 'g68') ? uiT('finishTitleG68')
      : uiT('finishTitleG912');
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
  if (resetBtn) resetBtn.innerText = currentTier === 'k2' ? k2T('playAgain') : uiT('playAgain');
  document.querySelector('#victoryModal .btn-close').innerText = currentTier === 'k2' ? k2T('close') : uiT('close');
  document.getElementById('victoryModal').lang = uiLang;

  // Offer to record this score on the event leaderboard.
  lbOnGameComplete();

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
