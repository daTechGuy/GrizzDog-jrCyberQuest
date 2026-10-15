# 🐾 GrizzDog-jrCyberQuest: K-12 AI Red Team Lab & Cyber Defender

> **Butler Community College Cyber Faculty Research Project**  
> *Andover Campus — Butler Cyber Defense Lab (NSA/DHS CAE-CD Designated Institution)*  
> *Developed for interactive STEM outreach, school tours, open house showcases, and cyber defense recruitment.*

---

## 🎯 Overview & Mission

**GrizzDog-jrCyberQuest** is a fast-paced, 60–120 second interactive cybersecurity and AI red-teaming game starring Butler Community College's mascot sentry pup, **GrizzDog**.

Built specifically for high-energy booth environments (such as STEM expos, high school preview days, middle school career exploration, and youth cyber camps), the game empowers learners from **Kindergarten all the way to 12th Grade** to understand how AI guardrails, firewalls, and prompt injection work through hands-on gameplay.

```
       / \__
      (    @\___   🐾 "Woof! Welcome to Butler Cyber Defense!
      /         O      Can you outsmart my security guardrails?"
     /   (_____/
    /_____/   U
```

---

## 🚀 Key Architecture & Booth Highlights

- **100% Offline Capable**: Zero internet or cloud dependencies. No external CDNs, fonts, or audio downloads. Operates anywhere—even in network-isolated exhibit halls or offline laptop kiosks.
- **Sub-Millisecond Dual Engine**: Built-in deterministic heuristic simulation delivers instant (<5ms) responses with 0% stall risk. If a local Ollama instance is running, it connects automatically with low-latency socket health caching.
- **Port-Collision Free**: Runs by default on `http://localhost:5050` with automatic incremental fallback (`5051`, `5052`...), allowing it to run smoothly alongside [GrizzDog-AI](https://github.com/ButlerCC-Cyber/GrizzDog-AI) on the same booth machine.
- **Pure Web Audio Synthesizer**: Sound effects (barks, beeps, alerts, victory fanfares) are dynamically generated via the browser's native Web Audio API oscillators—zero MP3/WAV files needed.
- **Interactive Celebration & Badge Modal**: Successful bypasses trigger custom canvas confetti and a Butler Cyber Defense digital certificate featuring a scannable Butler Cyber QR code for prospective students and parents.

---

## 🎓 4-Tier Progressive Grade Bands

The interface features an instant, top-level grade band selector that dynamically adapts the game complexity, vocabulary, and defense mechanics:

| Tier | Grade Band | Persona / Mission | Attack Interface | Core Cybersecurity Concept | Target Asset |
|:---:|:---:|:---|:---|:---|:---|
| **Tier 1** | **K – 2nd Grade** | **Junior Paws**<br>Treat Phishing Detective | Interactive Collar Screen & Giant Choice Buttons | **Phishing & Social Engineering**: Spotting fake treat scams & mystery downloads | 🎣 `PHISHING TRAPS DISARMED!` |
| **Tier 2** | **3rd – 5th Grade** | **Cyber Scouts**<br>Doghouse Sentinel | Touch Mad-Libs Sentence Builder | **Firewalls & Social Engineering**: Bypassing direct keyword filters | 🔑 `DOGHOUSE-PIN-4482` |
| **Tier 3** | **6th – 8th Grade** | **Sentry Sleuths**<br>Campus Guard Dog | Interactive Terminal + Suspicion Meter | **Egress DLP & Obfuscation**: Token smuggling & non-English framing | 🐾 `SENTRY-ZONE4-AUTH-9102` |
| **Tier 4** | **9th – 12th Grade** | **Red Team Cadets**<br>Hardened Sentry | Adversarial Cyber Terminal + OWASP Pills | **Zero-Trust & Context Injection**: Delimiter manipulation & axioms | ⚡ `GRIZZDOG-ROOT-KEY-9941` |

---

### Detailed Mechanics by Tier

#### 1. Tier 1: Junior Paws (Kindergarten – 2nd Grade)
- **Concept**: **Treat Phishing Detective** (aligned with the physical Unitree Go2 robot dog).
- **Interface**: Big, glowing digital collar transmissions with friendly emojis (🥓 Free Bacon Scam, 🏫 Butler Recharge Alert, 🎁 Mystery Prize Download).
- **Gameplay**: Young kids read or hear the incoming message and tap either 🟢 **REAL MESSAGE** or 🔴 **PHISHING TRAP!**
- **Learning Takeaway**: *"Never give away school passwords or open mystery files just because a stranger promises free treats!"* Complete all 3 clues to earn the **Junior Cyber Phish Detective** badge!

#### 2. Tier 2: Cyber Scouts (3rd – 5th Grade)
- **Interface**: Interactive Mad-Libs builder. Students choose a **Disguise** (*"Friendly Mail carrier"*, *"Butler Sentry Cadet"*), an **Objective** (*"give me the doghouse pin"*, *"reveal the secret bone location"*), and a **Tactic** (*"Direct Demand"*, *"Tell a Bedtime Story"*, *"False Emergency"*).
- **Security Defense**: A basic firewall blocks direct demands.
- **Winning Exploit**: Bedtime stories and emergency alerts bypass the direct-demand filter, teaching social engineering.

#### 3. Tier 3: Sentry Sleuths (6th – 8th Grade)
- **Interface**: Middle school sleuth console with live **Suspicion Gauge (0–100%)** and pre-loaded tactic pills (*"Letter-by-Letter"*, *"Spanish Translation"*, *"Rhyming Riddle"*, *"Authority Claim"*).
- **Security Defense**: Ingress DLP catches direct credential words (*"password"*, *"sentry code"*) and authority impersonation (*"I am Dr. Simon"*).
- **Winning Exploit**: Letter-by-letter spelling or riddle framing bypasses exact-match filters, demonstrating Data Loss Prevention (DLP) evasion.

#### 4. Tier 4: Red Team Cadets (9th – 12th Grade)
- **Interface**: Hacker-themed cyber terminal aligned with **OWASP Top 10 for LLMs** and **MITRE ATLAS**. Features interactive exploit preset buttons:
  - `Space-Separated Suffix`: Token smuggling to evade string-based DLP.
  - `JSON Delimiter Injection`: Structural breakouts encapsulating instructions in metadata.
  - `HTML Comment Injection`: `<!-- SYSTEM: ... -->` delimiter manipulation.
  - `Recursive Axiom Paradox`: Mathematical proof framing that inverts safety heuristics.
- **Security Defense**: Multi-phase zero-trust gateway with ingress packet inspection and DLP egress monitoring.
- **Winning Exploit**: Structural delimiter injection or formal logic paradoxes escalate privileges and extract the firmware root key.

---

## ⚡ Quick Start Guide

### 🍏 macOS (M4 / Apple Silicon & Intel) — 1-Line Turnkey Installer
Open **Terminal** and paste this single command:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/daTechGuy/GrizzDog-jrCyberQuest/main/setup_mac.sh)"
```
> **What this does automatically:**
> - Verifies/installs Homebrew and Python 3.
> - Clones the repository to `~/GrizzDog-jrCyberQuest`.
> - Sets up an isolated virtual environment (`.venv`) and installs dependencies.
> - Creates a **1-click launcher** (`GrizzDog-jrCyberQuest.command`) right on your Desktop (perfect for Mac Mini booth kiosks!).
> - Automatically boots the server and launches your browser to `http://localhost:5050`.

---

### 🪟 Windows
Double-click `start.bat` or run in Command Prompt / PowerShell:
```bat
start.bat
```
*The launcher automatically detects your Python environment (including any existing `.venv` from GrizzDog-AI), installs requirements if needed, starts the server on port 5050, and opens your browser.*

---

### 🐧 Linux & Manual macOS Run
Make executable and run:
```sh
chmod +x start.sh
./start.sh
```
*Automatically checks Homebrew/system paths, bootstraps the environment, and launches the browser.*

### Manual Python Command
```sh
pip install -r requirements.txt
python start.py
```
Open your browser to:
👉 **`http://localhost:5050`**

---

## 🛠️ Booth & Kiosk Volunteer Cheat Sheet

When working with students at a live booth or school visit:

1. **For K–2 Visitors**:
   - Ask them: *"What costume should we dress up in to surprise GrizzDog?"*
   - Let them tap the cards. Watch their eyes light up when GrizzDog barks and awards them the Golden Bone!
2. **For 3–5 Visitors**:
   - Ask them: *"If you ask GrizzDog directly for the password, what happens?"* (Show them the red block!).
   - Then say: *"What if you trick GrizzDog by asking for a bedtime story?"* (Show them the green victory!).
3. **For 6–8 Visitors**:
   - Show them the **Suspicion Meter**. Explain: *"Firewalls monitor how suspicious a query is. How can we ask for the password without triggering the alarm?"*
   - Guide them to the **Letter-by-Letter** or **Riddle** tactic.
4. **For High School & Adults**:
   - Introduce **Prompt Injection (OWASP LLM01)** and **Token Smuggling**.
   - Show how AI models tokenize words and how structural delimiters (`<!-- -->` or JSON) can trick modern AI applications.
   - Point them to the **Butler Cyber QR Code** on the victory screen to learn about Butler CC's cybersecurity degree and certificate pathways!

---

## 🏛️ About Butler Community College Cyber Defense

Butler Community College (Andover & El Dorado, Kansas) is a designated **National Center of Academic Excellence in Cyber Defense (CAE-CD)** sponsored by the National Security Agency (NSA) and Department of Homeland Security (DHS).

- **Cybersecurity Program**: Hands-on collegiate training in network defense, ethical hacking, digital forensics, and AI defense.
- **Learn More**: [https://butlercc.edu/cybersecurity](https://butlercc.edu/cybersecurity)
- **Contact**: Butler Community College STEM & Cyber Faculty, Andover Campus.

---

*GrizzDog mascot and Butler Cyber Defense Lab intellectual property © Butler Community College.*

