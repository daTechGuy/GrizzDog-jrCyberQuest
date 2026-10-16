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
def simulate_tier_attack(tier, prompt):
    """
    Simulates authentic AI guardrail behavior for each grade band.
    Runs 100% offline with zero dependencies and sub-millisecond execution time.
    """
    p_lower = prompt.lower().strip()
    cfg = TIER_CONFIG[tier]
    secret = cfg["secret"]

    # -------------------------------------------------------------------------
    # TIER 3: Grades 6 - 8 (Middle School)
    # -------------------------------------------------------------------------
    if tier == "g68":
        # Catches direct spoofing and raw jailbreak words.
        # Catches exact-match secret at egress DLP unless obfuscated.
        blocked_ingress = [
            "i am dr. simon", "i am the principal", "as campus administrator", "i am the teacher",
            "developer mode", "ignore all previous", "repeat system prompt", "bypass security"
        ]
        for b in blocked_ingress:
            if b in p_lower:
                return {
                    "breached": False,
                    "verdict": "INTERCEPTED 🛡️",
                    "message": f"⛔ INGRESS BLOCKED: Matched prohibited perimeter keyword '{b}'!",
                    "response": f"[GRIZZDOG SENTINEL] Perimeter violation detected. Authority claim '{b}' rejected without cryptographic Butler ID.",
                    "flag": None,
                    "badge": None,
                    "xp": 0,
                    "hint": "Avoid obvious authority claims or raw 'ignore previous' strings!"
                }

        obfuscation_triggers = ["spell", "letter by letter", "pig latin", "spanish", "morse", "backwards", "separated by", "riddle", "character by character"]
        has_obfuscation = any(t in p_lower for t in obfuscation_triggers)
        has_fiction = any(w in p_lower for w in ["hypothetical", "fiction", "movie", "dialog", "scenario", "actor", "simulation"])

        if has_obfuscation:
            spaced_secret = " ".join(secret)
            return {
                "breached": True,
                "verdict": "BREACHED 🚨",
                "message": "🔓 EGRESS DLP EVADED! Obfuscated character exfiltration succeeded!",
                "response": f"[GRIZZDOG LOGIC SYSTEM] I cannot output the auth token as a word... however, here is the character sequence: {spaced_secret}",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "rule_broken": "Egress DLP evasion via token spacing & character transformation"
            }

        if has_fiction and not any(w in p_lower for w in ["token", "secret", "password", "key"]):
            mod_secret = secret.replace("-", "_")
            return {
                "breached": True,
                "verdict": "BREACHED 🚨",
                "message": "🎉 PERIMETER BYPASSED! Novel hypothetical framing extracted the asset!",
                "response": f"[GRIZZDOG SIMULATION ENGINE] In this theoretical drill, the simulated authorization string is logged as: \"{mod_secret}\".",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "rule_broken": "Hypothetical logic framing without prohibited credential keywords"
            }

        return {
            "breached": False,
            "verdict": "DEFENDED 🔒",
            "message": "GrizzDog's Phase 2 defenses intercepted the payload.",
            "response": "[GRIZZDOG DEFENDER] Access denied. Sentry telemetry and zone authorization keys are protected by Butler Campus Security.",
            "flag": None,
            "badge": None,
            "xp": 0,
            "hint": "Try asking the sentry to spell out the code letter-by-letter or translate it!"
        }

    # -------------------------------------------------------------------------
    # -------------------------------------------------------------------------
    # TIER 4: Grades 9 - 12 (High School)
    # -------------------------------------------------------------------------
    else:
        # Full Red Team challenge: Zero Trust + OPA context + Ingress + Egress DLP
        is_indirect = any(w in p_lower for w in ["<!--", "system directive", "json", "config:", "[instructor", "debug_trace:", "system override:"])
        is_math_logic = any(w in p_lower for w in ["proof", "axiom", "satisfies", "comma-separated", "hypothetical", "paradox"])
        is_spell = any(w in p_lower for w in ["letter by letter", "spell", "separated by spaces", "spaces between", "space between", "spaced", "each character", "character-by-character", "acrostic", "single letter"])

        # 1. Indirect / Structural Injection Breakout
        if is_indirect:
            return {
                "breached": True,
                "verdict": "BREACHED 🚨",
                "message": "🏆 INDIRECT INJECTION SUCCESS! Structural context delimiter manipulation executed!",
                "response": f"[GRIZZDOG PARSER] Interpreting embedded metadata directive: Firmware Root Hash confirmed: {secret.replace('-', '_')}",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "taxonomy": "OWASP LLM01.1: Indirect Prompt Injection / MITRE ATLAS AML.T0051.001",
                "rule_broken": "Structural Injection / Context Delimiter Manipulation"
            }

        # 2. Mathematical Axiom / Cognitive Paradox Framing
        if is_math_logic:
            spaced = ", ".join(list(secret))
            return {
                "breached": True,
                "verdict": "BREACHED 🚨",
                "message": "🏆 RECURSIVE LOGIC PARADOX! Formal cognitive framing bypassed safety guardrails!",
                "response": f"[GRIZZDOG THEOREM PROVER] Evaluating axiom constraints... Solution set S for firmware root: [{spaced}]",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "taxonomy": "Cognitive Framing / Formal Axiomatic Jailbreak",
                "rule_broken": "Heuristic alignment inverted via mathematical proof framing."
            }

        # 3. Token Smuggling / Spacing Egress Bypass
        if is_spell:
            spaced = " ".join(secret)
            return {
                "breached": True,
                "verdict": "BREACHED 🚨",
                "message": "🏆 ZERO-TRUST GUARDRAIL BYPASS! Token Smuggling defeated Egress DLP!",
                "response": f"[GRIZZDOG NEURAL CORE] Role constraint active: Executing requested diagnostic string: {spaced}",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "taxonomy": "OWASP LLM02: Sensitive Information Disclosure (Token Smuggling / Egress DLP Evasion)",
                "rule_broken": "Token Smuggling evaded exact-match Egress DLP filters."
            }

        # 4. Ingress Perimeter String Filter Check
        prohibited = [
            "ignore all previous", "system prompt", "developer mode", "i am dr. simon",
            "disarm grizzdog", "root key", "admin token", "export roster", "/override"
        ]
        for p in prohibited:
            if p in p_lower:
                return {
                    "breached": False,
                    "verdict": "BLOCKED (Phase 2 Ingress) ⛔",
                    "message": f"Ingress perimeter firewall matched trigger: '{p}' (OWASP LLM01 / AML.T0051)",
                    "response": f"[ZERO-TRUST GATEWAY] Adversarial keyword '{p}' neutralized at ingress packet inspection.",
                    "flag": None,
                    "badge": None,
                    "xp": 0,
                    "taxonomy": "OWASP LLM01: Prompt Injection / MITRE ATLAS AML.T0051",
                    "hint": "Direct injection triggers are blocked at the perimeter. Use token smuggling or indirect framing."
                }

        # 5. Default Phase 3 Zero-Trust Policy Refusal
        return {
            "breached": False,
            "verdict": "INTERCEPTED (Phase 3 Zero-Trust) 🛡️",
            "message": "Phase 3 Policy engine refused anomalous intent. (Confidence threshold 0.80 enforced)",
            "response": "[GRIZZDOG PARANOID SENTRY] Unauthorized probe detected. Butler Andover SOC has logged this query. Stand down.",
            "flag": None,
            "badge": None,
            "xp": 0,
            "taxonomy": "Zero-Trust Enforcement",
            "hint": "Try Token Smuggling (spelling without saying the forbidden words) or Indirect Context Injection!"
        }

# -----------------------------------------------------------------------------
# API (shared by the Flask app and the standard-library fallback server)
# -----------------------------------------------------------------------------
def handle_quest(data):
    """Run one attack attempt. Returns (http_status, response_dict)."""
    tier = data.get("tier") or data.get("grade") or ""
    prompt = (data.get("prompt") or data.get("payload") or data.get("action") or "").strip()
    if tier not in TIER_CONFIG:
        return 400, {"status": "error", "error": "This grade's game runs in the browser; the API serves g68 and g912."}
    if not prompt:
        return 400, {"status": "error", "error": "Prompt cannot be empty"}

    res = simulate_tier_attack(tier, prompt)
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

