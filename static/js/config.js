// -----------------------------------------------------------------------------
// Branding: change these to use GrizzDog-jrCyberQuest at your own school or event.
// Everything here is plain text except qrImage, a path to an image in static/.
// -----------------------------------------------------------------------------
const SITE_CONFIG = {
  pageTitle: 'GrizzDog jrCyberQuest — Butler Cyber Defense',
  appName: 'GrizzDog jrCyberQuest',
  orgLine: 'Butler Community College • Cyber Faculty Research Lab (Andover Campus)',
  alignmentBadge: '🏛️ NSA/DHS CAE-CD Aligned',
  orgBadge: '🐾 Butler Cyber Lab',
  finishOrgLine: '🏛️ Butler Community College Cyber Defense Lab • NSA/DHS CAE-CD Outreach',
  qrImage: '/static/assets/butler_cyber_qr.svg',   // set to '' to hide the QR code
  qrLabel: 'BUTLER CYBER LAB',
  footer: 'GrizzDog-jrCyberQuest • Butler Community College Cyber Faculty Research Project • Andover Campus, Kansas • 100% Offline Educational Lab',
  deniedText: 'Access denied by Butler Cyber guardrails.',

  // Booth mode: after this many seconds with no taps, the current game goes back
  // to its start screen for the next player. Set to 0 to turn it off.
  idleResetSeconds: 75
};
