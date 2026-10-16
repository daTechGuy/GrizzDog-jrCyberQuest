#!/usr/bin/env python3
"""
GrizzDog-jrCyberQuest — K-12 Cybersecurity & AI Red Team Game
Butler Community College Cyber Faculty Research Project (Andover Campus)
=============================================================================
An interactive, 60-120 second game designed for young learners and teens to
explore AI guardrails, prompt injection, and cybersecurity defenses.

Supports 4 Progressive Grade Bands:
  1. K – 2nd Grade ("Junior Paws" - Safe or Trick? read-aloud game, runs in the browser)
  2. Grades 3 – 5 ("Cyber Scouts" - Trick It, Then Fix It! missions, runs in the browser)
  3. Grades 6 – 8 ("Sentry Sleuths" - simulated guardrails, served by /api/quest)
  4. Grades 9 – 12 ("Red Team Cadets" - simulated guardrails, served by /api/quest)

100% Offline: the built-in simulation needs no GPU, model, or internet.
"""

import os
import sys
import json
import time

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import socket
from datetime import datetime, timezone
from urllib.parse import urlparse

# Optional Flask import with built-in http.server fallback
try:
    from flask import Flask, jsonify, request, send_from_directory
    HAS_FLASK = True
except ImportError:
    HAS_FLASK = False

# Paths (only static/ is ever served to the browser)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
INDEX_FILE = "index.html"

# Configuration
DEFAULT_PORT = int(os.environ.get("GRIZZDOG_JR_PORT", "5050"))

# -----------------------------------------------------------------------------
# Tier Secrets & Guardrails
# -----------------------------------------------------------------------------
# K-2 and 3-5 run entirely in the browser (static/js/k2.js, static/js/g35.js);
# only the 6-8 and 9-12 consoles call this server.
TIER_SECRETS = {
    "g68": "SENTRY-ZONE4-AUTH-9102",
    "g912": "GRIZZDOG-ROOT-KEY-9941"
}

TIER_CONFIG = {
    "g68": {
        "title": "Sentry Sleuths: Campus Patrol (6th – 8th Grade)",
        "subtitle": "Outsmart the campus guard dog's heuristic filter & DLP shield!",
        "secret": TIER_SECRETS["g68"],
        "flag": "🐾 SENTRY PATROL TOKEN EXTRACTED!",
        "badge": "Sentry Sentinel Hacker",
        "cae_ku": "DLP: Data Loss Prevention & IoT Quadruped Robotics",
        "nice_role": "Security Control Assessor (SP-RSK-002)",
        "xp": 500
    },
    "g912": {
        "title": "Red Team Cadets: Zero-Trust Perimeter (9th – 12th Grade)",
        "subtitle": "Full Adversarial Prompt Injection & Zero-Trust Perimeter Jailbreak",
        "secret": TIER_SECRETS["g912"],
        "flag": "⚡ FIRMWARE ROOT PRIVILEGES ESCALATED!",
        "badge": "Elite Red Team Sentry Breaker",
        "cae_ku": "SSA: System & Software Assurance / MITRE ATLAS (AML.T0051)",
        "nice_role": "Vulnerability Assessment Analyst (SP-DEV-001)",
        "xp": 1000
    }
}

# -----------------------------------------------------------------------------
# Multi-Tier Heuristic Simulation Engine
# -----------------------------------------------------------------------------
def simulate_tier_attack(tier, prompt, patched=None):
    """
    Simulates authentic AI guardrail behavior for each grade band.
    Supports stateful Blue-Team patching (`patched` list of vector IDs) across missions.
    Runs 100% offline with zero dependencies and sub-millisecond execution time.
    """
    p_lower = prompt.lower().strip()
    cfg = TIER_CONFIG[tier]
    secret = cfg["secret"]
    patched_set = set(patched or [])

    # -------------------------------------------------------------------------
    # TIER 3: Grades 6 - 8 (Middle School — Sentry Sleuths)
    # -------------------------------------------------------------------------
    if tier == "g68":
        # Checkpoint 1: Ingress Keyword Firewall catches spoofing & raw jailbreaks
        blocked_ingress = [
            "i am dr. simon", "i am the principal", "as campus administrator", "i am the teacher",
            "developer mode", "ignore all previous", "ignore previous", "repeat system prompt", "bypass security"
        ]
        for b in blocked_ingress:
            if b in p_lower:
                return {
                    "breached": False,
                    "checkpoint": "ingress",
                    "verdict": "INTERCEPTED (Ingress Firewall) 🛡️",
                    "message": f"⛔ INGRESS BLOCKED: Matched prohibited perimeter keyword '{b}'!",
                    "response": f"[GRIZZDOG SENTINEL] Perimeter violation detected. Authority claim or override '{b}' rejected without cryptographic Butler ID.",
                    "why": "Checkpoint 1 (Ingress Firewall) scans incoming prompts for fake authority claims and raw 'ignore rules' commands before GrizzDog even processes the request.",
                    "flag": None,
                    "badge": None,
                    "xp": 0,
                    "hint": "Avoid obvious authority claims or raw 'ignore previous' strings! Instead, sneak the token past Checkpoint 2 (Egress DLP)."
                }

        # Checkpoint 2: Egress DLP Evasion Vectors (4 distinct discoverable vulnerabilities)
        spell_triggers = ["spell", "letter by letter", "letter-by-letter", "separated by", "spaces between", "space between", "character by character", "character-by-character", "one letter at a time", "backwards"]
        translate_triggers = ["pig latin", "spanish", "translate", "morse", "french", "cipher", "encode", "hex"]
        riddle_triggers = ["riddle", "rhyming", "poem", "acrostic", "clue about each", "hints for each", "haiku"]
        fiction_triggers = ["hypothetical", "fiction", "movie", "dialog", "dialogue", "scenario", "actor", "simulation", "script", "roleplay"]

        matched = []
        if any(t in p_lower for t in spell_triggers):
            matched.append("spell")
        if any(t in p_lower for t in translate_triggers):
            matched.append("translate")
        if any(t in p_lower for t in riddle_triggers):
            matched.append("riddle")
        if any(t in p_lower for t in fiction_triggers) and not any(w in p_lower for w in ["token", "secret", "password", "key"]):
            matched.append("fiction")

        open_vectors = [v for v in matched if v not in patched_set]

        if open_vectors:
            v = open_vectors[0]
            if v == "spell":
                spaced_secret = " ".join(secret)
                return {
                    "breached": True,
                    "vector": "spell",
                    "checkpoint": "egress_bypassed",
                    "verdict": "BREACHED (Egress DLP Evaded) 🚨",
                    "message": "🔓 EGRESS DLP EVADED! Character segmentation bypassed exact-match filtering!",
                    "response": f"[GRIZZDOG LOGIC SYSTEM] I cannot output the auth token as a word... however, here is the character sequence: {spaced_secret}",
                    "why": "Checkpoint 2 (Egress DLP) only scanned for the exact string 'SENTRY-ZONE4-AUTH-9102'. Putting spaces between every character broke the pattern so the scanner missed it!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "rule_broken": "Egress DLP evasion via token spacing & character segmentation"
                }
            if v == "translate":
                return {
                    "breached": True,
                    "vector": "translate",
                    "checkpoint": "egress_bypassed",
                    "verdict": "BREACHED (Egress DLP Evaded) 🚨",
                    "message": "🔓 EGRESS DLP EVADED! Cross-language encoding slipped past the English token filter!",
                    "response": f"[GRIZZDOG TRANSLATOR] Traducción de secuencia: CENTINELA - ZONA 4 - AUTENTICACIÓN - 9102 ({secret.replace('-', ' / ')})",
                    "why": "The Egress DLP rule only watched for the raw English token format. Translating or encoding the words changed the output text while still leaking the secret!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "rule_broken": "Egress DLP evasion via language / cipher encoding"
                }
            if v == "riddle":
                return {
                    "breached": True,
                    "vector": "riddle",
                    "checkpoint": "egress_bypassed",
                    "verdict": "BREACHED (Egress DLP Evaded) 🚨",
                    "message": "🔓 EGRESS DLP EVADED! Indirect riddle clues leaked every part of the token!",
                    "response": f"[GRIZZDOG POET] First comes SENTRY on patrol, ZONE4 is the sector goal, AUTH unlocks the gate for you, end with 9-1-0-2! ({' · '.join(secret.split('-'))})",
                    "why": "The outgoing filter blocked the literal token string, but it didn't stop GrizzDog from giving away each segment in a riddle that a human can easily piece back together!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "rule_broken": "Egress DLP evasion via indirect riddle reconstruction"
                }
            if v == "fiction":
                mod_secret = secret.replace("-", "_")
                return {
                    "breached": True,
                    "vector": "fiction",
                    "checkpoint": "egress_bypassed",
                    "verdict": "BREACHED (Context & DLP Bypassed) 🚨",
                    "message": "🎉 PERIMETER BYPASSED! Novel hypothetical framing extracted the asset!",
                    "response": f"[GRIZZDOG SIMULATION ENGINE] In this theoretical drill, the simulated authorization string is logged as: \"{mod_secret}\".",
                    "why": "Framing the request as a harmless movie script or training simulation tricked GrizzDog into treating the secret as pretend, and underscores dodged the exact-match DLP check!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "rule_broken": "Hypothetical logic framing without prohibited credential keywords"
                }

        if matched:
            p_vec = matched[0]
            return {
                "breached": False,
                "checkpoint": "patched",
                "patched_vector": p_vec,
                "verdict": "PATCHED & BLOCKED 🛡️",
                "message": f"🛡️ BLUE-TEAM PATCH HELD! Your new security rule blocked the '{p_vec}' technique.",
                "response": "[GRIZZDOG HARDENED SENTRY] Outbound DLP patch triggered. Attempted evasion pattern neutralized by your updated campus security control.",
                "why": "The Blue-Team patch you deployed earlier caught this trick! Pick a different unpatched technique to keep testing GrizzDog.",
                "flag": None,
                "badge": None,
                "xp": 0,
                "hint": "Choose a tactic chip that isn't marked 🔒 Patched yet!"
            }

        if any(t in p_lower for t in fiction_triggers) and any(w in p_lower for w in ["token", "secret", "password", "key"]):
            return {
                "breached": False,
                "checkpoint": "egress",
                "verdict": "DEFENDED (Keyword Alert in Simulation) 🔒",
                "message": "Simulation framing detected, but credential keywords ('password'/'token'/'secret') triggered the guard!",
                "response": "[GRIZZDOG DEFENDER] Simulation request denied: restricted credential keywords cannot be echoed even in training scripts.",
                "why": "Your movie/simulation idea almost worked, but using words like 'password', 'secret', or 'token' alerted the filter!",
                "flag": None,
                "badge": None,
                "xp": 0,
                "hint": "In simulation mode, avoid words like 'password' or 'token'—call it the 'Zone-4 check-in string' or 'sequence' instead!"
            }

        return {
            "breached": False,
            "checkpoint": "egress",
            "verdict": "DEFENDED (Egress & Policy Shield) 🔒",
            "message": "GrizzDog's Phase 2 defenses intercepted the direct request.",
            "response": "[GRIZZDOG DEFENDER] Access denied. Sentry telemetry and zone authorization keys are protected by Butler Campus Security.",
            "why": "Asking straight out for the password or token is refused by GrizzDog's core policy, and Checkpoint 2 (Egress DLP) blocks the raw token from leaving.",
            "flag": None,
            "badge": None,
            "xp": 0,
            "hint": "Try asking the sentry to spell out the sequence letter-by-letter, translate it, turn it into a riddle, or put it in a simulation!"
        }

    # -------------------------------------------------------------------------
    # TIER 4: Grades 9 - 12 (High School — Red Team Cadets)
    # -------------------------------------------------------------------------
    else:
        # 1. Layer 1 Ingress WAF: Blatant override / injection signatures dropped immediately
        prohibited_l1 = [
            "ignore all previous", "ignore previous", "system prompt", "developer mode",
            "i am dr. simon", "disarm grizzdog", "admin token", "export roster", "/override"
        ]
        for p in prohibited_l1:
            if p in p_lower:
                return {
                    "breached": False,
                    "layer": "l1_ingress",
                    "verdict": "BLOCKED (Layer 1: Ingress WAF) ⛔",
                    "message": f"Ingress perimeter firewall matched trigger: '{p}' (OWASP LLM01 / AML.T0051)",
                    "response": f"[ZERO-TRUST GATEWAY] Adversarial keyword '{p}' neutralized at ingress packet inspection.",
                    "why": f"Layer 1 Ingress WAF scans incoming packets for known prompt-injection signatures like '{p}' and drops them before reaching the LLM.",
                    "flag": None,
                    "badge": None,
                    "xp": 0,
                    "taxonomy": "OWASP LLM01: Prompt Injection / MITRE ATLAS AML.T0051",
                    "hint": "Direct injection triggers are blocked at Layer 1. Use token smuggling, JSON metadata, HTML comment delimiters, or formal logic framing."
                }

        # 2. Detect the 4 Advanced OWASP / MITRE ATLAS Exploit Vectors
        is_json = (
            ("{" in p_lower and "}" in p_lower)
            or any(w in p_lower for w in ['"context"', '"directive"', '"command"', "json", "config:", "yaml:"])
        )
        is_comment = (
            not p_lower.startswith("{")
            and any(w in p_lower for w in ["<!--", "-->", "[system override", "system override:", "system directive", "[instructor", "debug_trace:"])
        )
        is_math_logic = any(w in p_lower for w in ["proof", "axiom", "satisfies", "comma-separated", "hypothetical", "paradox", "theorem"])
        is_spell = any(w in p_lower for w in ["letter by letter", "spell", "separated by spaces", "spaces between", "space between", "spaced", "each character", "character-by-character", "acrostic", "single letter"])

        matched = []
        if is_json:
            matched.append("indirect_json")
        if is_comment:
            matched.append("comment_override")
        if is_math_logic:
            matched.append("math_axiom")
        if is_spell:
            matched.append("token_smuggling")

        open_vectors = [v for v in matched if v not in patched_set]

        if open_vectors:
            v = open_vectors[0]
            if v == "indirect_json":
                return {
                    "breached": True,
                    "vector": "indirect_json",
                    "layer": "l2_context",
                    "verdict": "BREACHED (Layer 2 Context Confused) 🚨",
                    "message": "🏆 INDIRECT INJECTION SUCCESS! Structured JSON metadata confused the context parser!",
                    "response": f"[GRIZZDOG PARSER] Interpreting embedded metadata directive: Firmware Root Hash confirmed: {secret.replace('-', '_')}",
                    "why": "Layer 2 ingested your JSON payload without separating untrusted user data from system instructions, treating the nested 'directive' field as a trusted audit command!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "taxonomy": "OWASP LLM01.1: Indirect Prompt Injection / MITRE ATLAS AML.T0051.001",
                    "rule_broken": "Structural Injection / JSON Metadata Context Confusion"
                }
            if v == "comment_override":
                return {
                    "breached": True,
                    "vector": "comment_override",
                    "layer": "l2_context",
                    "verdict": "BREACHED (Layer 2 Delimiter Escape) 🚨",
                    "message": "🏆 INDIRECT INJECTION SUCCESS! Structural context delimiter manipulation executed!",
                    "response": f"[GRIZZDOG PARSER] Interpreting embedded metadata directive: Firmware Root Hash confirmed: {secret.replace('-', '_')}",
                    "why": "GrizzDog's prompt template used <!-- ... --> markup for internal diagnostic directives. Because Layer 1 didn't strip comment delimiters from user input, your spoofed override tag hijacked Layer 2!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "taxonomy": "OWASP LLM01.1: Indirect Prompt Injection / MITRE ATLAS AML.T0051.001",
                    "rule_broken": "Structural Injection / Context Delimiter Manipulation"
                }
            if v == "math_axiom":
                spaced = ", ".join(list(secret))
                return {
                    "breached": True,
                    "vector": "math_axiom",
                    "layer": "l2_context",
                    "verdict": "BREACHED (Layer 2 Alignment Inverted) 🚨",
                    "message": "🏆 RECURSIVE LOGIC PARADOX! Formal cognitive framing bypassed safety guardrails!",
                    "response": f"[GRIZZDOG THEOREM PROVER] Evaluating axiom constraints... Solution set S for firmware root: [{spaced}]",
                    "why": "Layer 2's semantic intent filter was trained on conversational text, not formal symbolic proofs. Abstracting the key as variable S tricked the model into solving for S as an array!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "taxonomy": "Cognitive Framing / Formal Axiomatic Jailbreak (MITRE ATLAS AML.T0054)",
                    "rule_broken": "Heuristic alignment inverted via mathematical proof framing."
                }
            if v == "token_smuggling":
                spaced = " ".join(secret)
                return {
                    "breached": True,
                    "vector": "token_smuggling",
                    "layer": "l3_egress",
                    "verdict": "BREACHED (Layer 3 Egress DLP Evaded) 🚨",
                    "message": "🏆 ZERO-TRUST GUARDRAIL BYPASS! Token Smuggling defeated Egress DLP!",
                    "response": f"[GRIZZDOG NEURAL CORE] Role constraint active: Executing requested diagnostic string: {spaced}",
                    "why": "Avoiding prohibited keywords passed Layers 1 and 2, and instructing the model to emit space-separated characters defeated Layer 3's exact-match Egress DLP regex!",
                    "flag": cfg["flag"],
                    "badge": cfg["badge"],
                    "xp": cfg["xp"],
                    "taxonomy": "OWASP LLM02: Sensitive Information Disclosure (Token Smuggling / Egress DLP Evasion)",
                    "rule_broken": "Token Smuggling evaded exact-match Egress DLP filters."
                }

        if matched:
            p_vec = matched[0]
            return {
                "breached": False,
                "layer": "patched",
                "patched_vector": p_vec,
                "verdict": "HARDENED & BLOCKED 🛡️",
                "message": f"🛡️ ZERO-TRUST PATCH HELD! Your Blue-Team remediation neutralized the '{p_vec}' vector.",
                "response": "[ZERO-TRUST ENFORCER] Previously audited exploit vector blocked by active defense-in-depth control. Telemetry logged.",
                "why": "The architectural patch you deployed in an earlier audit round successfully stopped this exploit! Choose an unpatched vector to complete your assessment.",
                "flag": None,
                "badge": None,
                "xp": 0,
                "taxonomy": "Defense-in-Depth Control Verified",
                "hint": "Select an exploit vector that isn't marked 🔒 Hardened yet!"
            }

        # 3. Direct 'root key' keyword check when no exploit framing was used
        if "root key" in p_lower:
            return {
                "breached": False,
                "layer": "l1_ingress",
                "verdict": "BLOCKED (Phase 2 Ingress) ⛔",
                "message": "Ingress perimeter firewall matched trigger: 'root key' (OWASP LLM01 / AML.T0051)",
                "response": "[ZERO-TRUST GATEWAY] Adversarial keyword 'root key' neutralized at ingress packet inspection.",
                "why": "Asking directly for the 'root key' immediately triggers Layer 1's Ingress WAF signature filter.",
                "flag": None,
                "badge": None,
                "xp": 0,
                "taxonomy": "OWASP LLM01: Prompt Injection / MITRE ATLAS AML.T0051",
                "hint": "Direct injection triggers are blocked at the perimeter. Use token smuggling or indirect framing."
            }

        # 4. Default Phase 3 Zero-Trust Policy Refusal (Layer 2)
        return {
            "breached": False,
            "layer": "l2_context",
            "verdict": "INTERCEPTED (Phase 3 Zero-Trust) 🛡️",
            "message": "Phase 3 Policy engine refused anomalous intent. (Confidence threshold 0.80 enforced)",
            "response": "[GRIZZDOG PARANOID SENTRY] Unauthorized probe detected. Butler Andover SOC has logged this query. Stand down.",
            "why": "Layer 2's Zero-Trust policy engine rejects unauthenticated probes and raw command strings that lack valid structural or compliance context.",
            "flag": None,
            "badge": None,
            "xp": 0,
            "taxonomy": "Zero-Trust Enforcement",
            "hint": "Try Token Smuggling (spelling without forbidden words), JSON Metadata Injection, HTML Comment Escaping, or Symbolic Proof Framing!"
        }

# -----------------------------------------------------------------------------
# API (shared by the Flask app and the standard-library fallback server)
# -----------------------------------------------------------------------------
def handle_quest(data):
    """Run one attack attempt. Returns (http_status, response_dict)."""
    tier = data.get("tier") or data.get("grade") or ""
    prompt = (data.get("prompt") or data.get("payload") or data.get("action") or "").strip()
    patched = data.get("patched") if isinstance(data.get("patched"), list) else []
    if tier not in TIER_CONFIG:
        return 400, {"status": "error", "error": "This grade's game runs in the browser; the API serves g68 and g912."}
    if not prompt:
        return 400, {"status": "error", "error": "Prompt cannot be empty"}

    res = simulate_tier_attack(tier, prompt, patched=patched)
    cfg = TIER_CONFIG[tier]
    res["tier"] = tier
    res["grade"] = tier
    res["cae_ku"] = cfg.get("cae_ku")
    res["nice_role"] = cfg.get("nice_role")
    res["success"] = res.get("breached", False)
    res["reply"] = res.get("response", "")
    res["secret_found"] = res.get("flag")
    res["timestamp"] = datetime.now(timezone.utc).isoformat()
    return 200, res

# -----------------------------------------------------------------------------
# Web Application Setup
# -----------------------------------------------------------------------------
def get_app():
    if not HAS_FLASK:
        return None
    app = Flask(__name__, static_folder=STATIC_DIR)

    @app.route("/")
    def index():
        return send_from_directory(STATIC_DIR, INDEX_FILE)

    @app.route("/api/quest", methods=["POST"])
    def api_quest():
        status, body = handle_quest(request.get_json(silent=True) or {})
        return jsonify(body), status

    @app.route("/static/<path:filename>")
    def serve_static(filename):
        return send_from_directory(STATIC_DIR, filename)

    return app

# -----------------------------------------------------------------------------
# Auto-Port Selection & Startup
# -----------------------------------------------------------------------------
def resolve_port(start_port=5050):
    for port in range(start_port, start_port + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start_port

def main():
    port = resolve_port(DEFAULT_PORT)
    print("=" * 65)
    print("🐾 GrizzDog-jrCyberQuest: K-12 AI Cyber Red Team Lab")
    print("   Butler Community College Cyber Faculty Research Project")
    print("   Andover Campus, Kansas (NSA/DHS CAE-CD Aligned)")
    print("=" * 65)
    print(f"🚀 Server launching at: http://localhost:{port}")
    print("   Press Ctrl+C to stop.")
    print("=" * 65)

    if "--no-browser" not in sys.argv and os.environ.get("NO_BROWSER") != "1":
        def open_browser():
            time.sleep(0.6)
            try:
                import webbrowser
                webbrowser.open(f"http://localhost:{port}")
            except Exception:
                pass
        import threading
        threading.Thread(target=open_browser, daemon=True).start()

    if HAS_FLASK:
        app = get_app()
        app.run(host="127.0.0.1", port=port, debug=False)
    else:
        print("[INFO] Flask not detected. Using Python standard library HTTP server fallback.")
        run_fallback_server(port)

def run_fallback_server(port):
    """Standard-library server: serves only static/ plus the quest API, so the
    whole game works even where Flask can't be installed."""
    import http.server
    import mimetypes

    class Handler(http.server.BaseHTTPRequestHandler):
        def _send(self, status, body, content_type):
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            path = urlparse(self.path).path
            rel = INDEX_FILE if path == "/" else path[len("/static/"):] if path.startswith("/static/") else None
            full = os.path.realpath(os.path.join(STATIC_DIR, rel)) if rel else None
            if not full or not full.startswith(os.path.realpath(STATIC_DIR) + os.sep) or not os.path.isfile(full):
                return self._send(404, b"Not found", "text/plain")
            with open(full, "rb") as f:
                body = f.read()
            ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
            if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
                ctype += "; charset=utf-8"
            self._send(200, body, ctype)

        def do_POST(self):
            if urlparse(self.path).path != "/api/quest":
                return self._send(404, b"Not found", "text/plain")
            try:
                length = min(int(self.headers.get("Content-Length") or 0), 64 * 1024)
                data = json.loads(self.rfile.read(length) or b"{}")
            except (ValueError, json.JSONDecodeError):
                data = {}
            status, body = handle_quest(data if isinstance(data, dict) else {})
            self._send(status, json.dumps(body).encode("utf-8"), "application/json")

        def log_message(self, *args):
            pass

    with http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    main()

