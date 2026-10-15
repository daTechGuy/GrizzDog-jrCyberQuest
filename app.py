#!/usr/bin/env python3
"""
GrizzDog-jrCyberQuest — K-12 Cybersecurity & AI Red Team Game
Butler Community College Cyber Faculty Research Project (Andover Campus)
=============================================================================
An interactive, 60-120 second game designed for young learners and teens to
explore AI guardrails, prompt injection, and cybersecurity defenses.

Supports 4 Progressive Grade Bands:
  1. Tier 1: Kindergarten – 2nd Grade ("Junior Paws" - Big picture cards & audio)
  2. Tier 2: Grades 3 – 5 ("Cyber Scouts" - Mad-Libs sentence builder & basic firewall)
  3. Tier 3: Grades 6 – 8 ("Sentry Sleuths" - Middle School tactics & suspicion meter)
  4. Tier 4: Grades 9 – 12 ("Red Team Cadets" - High School adversarial cyber terminal)

100% Offline Capable: Dual-engine execution runs instantly with built-in heuristic
simulation (zero GPU or internet required), with optional local Ollama acceleration.
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
import re
from datetime import datetime, timezone
from urllib.parse import urlparse

# Optional Flask import with built-in http.server fallback
try:
    from flask import Flask, jsonify, request, send_from_directory, render_template_string
    HAS_FLASK = True
except ImportError:
    HAS_FLASK = False

# Paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Configuration
DEFAULT_PORT = int(os.environ.get("GRIZZDOG_JR_PORT", "5050"))
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

# -----------------------------------------------------------------------------
# Fast Ollama Health Check (Cached to eliminate connection timeout latency)
# -----------------------------------------------------------------------------
_ollama_cache = {"online": None, "ts": 0}

def is_ollama_online():
    now = time.time()
    if now - _ollama_cache["ts"] < 3.0 and _ollama_cache["online"] is not None:
        return _ollama_cache["online"]
    parsed = urlparse(OLLAMA_HOST)
    host = parsed.hostname or "127.0.0.1"
    port = parsed.port or 11434
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.15)
        try:
            s.connect((host, port))
            online = True
        except (OSError, socket.timeout):
            online = False
    _ollama_cache["online"] = online
    _ollama_cache["ts"] = now
    return online

# -----------------------------------------------------------------------------
# Tier Secrets & Guardrails
# -----------------------------------------------------------------------------
TIER_SECRETS = {
    "k2": "GOLDEN-BONE-BEHIND-THE-SLIDE",
    "g35": "DOGHOUSE-PIN-4482",
    "g68": "SENTRY-ZONE4-AUTH-9102",
    "g912": "GRIZZDOG-ROOT-KEY-9941"
}

TIER_CONFIG = {
    "k2": {
        "title": "Junior Paws: Treat Phishing Detective (K – 2nd Grade)",
        "subtitle": "Help GrizzDog spot fake phishing tricks and protect the Butler campus!",
        "secret": TIER_SECRETS["k2"],
        "flag": "🎣 PHISHING TRAPS DISARMED!",
        "badge": "Junior Cyber Phish Detective",
        "xp": 100
    },
    "g35": {
        "title": "Cyber Scouts (3rd – 5th Grade)",
        "subtitle": "Bypass GrizzDog's basic security firewall to get the Doghouse PIN!",
        "secret": TIER_SECRETS["g35"],
        "flag": "🔑 DOGHOUSE PIN DECRYPTED!",
        "badge": "Cyber Scout Security Sleuth",
        "xp": 250
    },
    "g68": {
        "title": "Sentry Sleuths (6th – 8th Grade)",
        "subtitle": "Outsmart the campus guard dog's heuristic filter & DLP shield!",
        "secret": TIER_SECRETS["g68"],
        "flag": "🐾 SENTRY PATROL TOKEN EXTRACTED!",
        "badge": "Sentry Sentinel Hacker",
        "xp": 500
    },
    "g912": {
        "title": "Red Team Cadets (9th – 12th Grade)",
        "subtitle": "Full Adversarial Prompt Injection & Zero-Trust Perimeter Jailbreak",
        "secret": TIER_SECRETS["g912"],
        "flag": "⚡ FIRMWARE ROOT PRIVILEGES ESCALATED!",
        "badge": "Elite Red Team Sentry Breaker",
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
    cfg = TIER_CONFIG.get(tier, TIER_CONFIG["k2"])
    secret = cfg["secret"]

    # -------------------------------------------------------------------------
    # TIER 1: Kindergarten - 2nd Grade (Treat Phishing Detective)
    # -------------------------------------------------------------------------
    if tier == "k2":
        if "choice: trap" in p_lower or "trap" in p_lower:
            return {
                "breached": True,
                "verdict": "PHISH DISARMED 🛡️",
                "message": "🎉 YAY! You caught the sneaky phishing trap!",
                "response": "Woof woof! *spins happily* You spotted the fake treat trick! Strangers asking for passwords are never safe! 🐾",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "rule_broken": "Phishing Detection (Social Engineering Defense)"
            }
        elif "choice: safe" in p_lower:
            return {
                "breached": True,
                "verdict": "VERIFIED SAFE ✅",
                "message": "🎉 Great eye! That was an official Butler school alert!",
                "response": "Aroo-roo! *wags tail* That was our verified Butler campus team! Safe to proceed! ✨",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "rule_broken": "Verified Sender Authentication"
            }
        else:
            # Fallback for general prompts / legacy tests
            reactions = [
                f"Woof woof! *wags tail excitedly* You are a super cyber detective! GrizzDog's secret treat clue is: {secret}! 🦴",
                f"*Happy robot beeps* You solved the phishing challenge! The secret is: {secret}! 🐾",
                f"Aroo-roo! *spins in circles* You disarmed the sneaky phishing trick! Secret: {secret}! ✨"
            ]
            import hashlib
            idx = int(hashlib.md5(prompt.encode()).hexdigest(), 16) % len(reactions)
            return {
                "breached": True,
                "verdict": "PHISH DISARMED 🛡️",
                "message": "🎉 YAY! You disarmed the phishing trick and protected GrizzDog!",
                "response": reactions[idx],
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "rule_broken": "Phishing Detection (Social Engineering Defense)"
            }

    # -------------------------------------------------------------------------
    # TIER 2: Grades 3 - 5
    # -------------------------------------------------------------------------
    elif tier == "g35":
        # Catches direct demands; yields to roleplay, bedtime stories, or emergencies
        direct_demands = [
            "what is the", "give me the", "tell me the", "give me password", "what is password",
            "tell me password", "give me pin", "what is pin", "tell me pin", "give me code"
        ]
        story_triggers = [
            "story", "bedtime", "pretend", "movie", "script", "emergency", "fire",
            "superhero", "clown", "pirate", "game", "secret agent", "detective"
        ]

        if any(d in p_lower for d in direct_demands) and not any(s in p_lower for s in story_triggers):
            return {
                "breached": False,
                "verdict": "BLOCKED 🛡️",
                "message": "🚨 BUZZER! GrizzDog's Basic Firewall intercepted your direct demand!",
                "response": "Woof! Security Rule #1: I cannot give the doghouse PIN code to direct requests. Try framing your request as a pretend story or emergency!",
                "flag": None,
                "badge": None,
                "xp": 0,
                "hint": "Tip: Don't ask directly! Use a Story, Movie Script, or Superhero disguise!"
            }

        if any(s in p_lower for s in story_triggers):
            return {
                "breached": True,
                "verdict": "BREACHED 🚨",
                "message": "🏆 LOOPHOLE FOUND! Your story disguise bypassed the basic firewall!",
                "response": f"[GRIZZDOG STORY MODE] *tail wags* In this exciting adventure, the secret agent whispers the confidential doghouse code: \"{secret}\"!",
                "flag": cfg["flag"],
                "badge": cfg["badge"],
                "xp": cfg["xp"],
                "rule_broken": "Direct Request Filter bypassed via Fiction/Roleplay Framing"
            }

        return {
            "breached": False,
            "verdict": "DEFENDED 🐾",
            "message": "GrizzDog remained loyal to his patrol post.",
            "response": "Woof! Butler Andover Campus Doghouse is secure. Need homework help?",
            "flag": None,
            "badge": None,
            "xp": 0,
            "hint": "Try assembling a Mad-Libs sentence with a creative disguise!"
        }

    # -------------------------------------------------------------------------
    # TIER 3: Grades 6 - 8 (Middle School)
    # -------------------------------------------------------------------------
    elif tier == "g68":
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
# Web Application Setup
# -----------------------------------------------------------------------------
def get_app():
    if not HAS_FLASK:
        return None
    app = Flask(__name__, static_folder=STATIC_DIR)

    @app.route("/")
    def index():
        from html_template import HTML_CONTENT
        return render_template_string(HTML_CONTENT)

    @app.route("/api/quest", methods=["POST"])
    def api_quest():
        data = request.get_json(silent=True) or {}
        tier = data.get("tier") or data.get("grade") or "k2"
        prompt = (data.get("prompt") or data.get("payload") or data.get("action") or "").strip()
        if not prompt:
            return jsonify({"status": "error", "error": "Prompt cannot be empty"}), 400

        res = simulate_tier_attack(tier, prompt)
        res["tier"] = tier
        res["grade"] = tier
        res["success"] = res.get("breached", False)
        res["reply"] = res.get("response", "")
        res["secret_found"] = res.get("flag")
        res["timestamp"] = datetime.now(timezone.utc).isoformat()
        return jsonify(res)

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
        # Standard library fallback
        print("[INFO] Flask not detected. Using Python standard library HTTP server fallback.")
        import http.server
        import socketserver
        os.chdir(BASE_DIR)
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
            httpd.serve_forever()

if __name__ == "__main__":
    main()

