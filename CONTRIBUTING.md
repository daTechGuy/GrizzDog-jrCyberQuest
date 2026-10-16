# Contributing to GrizzDog-jrCyberQuest

Thanks for helping kids learn cyber safety! Teachers, parents, students, and developers are all welcome.

## Easy ways to help (no coding)

- **Suggest a K–2 message.** Open a "New K–2 message" issue with the message, who it's from, whether it's safe or a trick, and which level (1–3) it fits.
- **Improve a translation.** Spanish lives right next to the English in [static/js/k2-messages.js](static/js/k2-messages.js). Native speakers' fixes are very welcome.
- **Report a bug.** Tell us the grade band, the browser, and what happened.
- **Share how you used it.** Classroom or booth stories help us decide what to build next.

## Making changes

1. Fork the repo and create a branch.
2. Run it locally: `pip install -r requirements.txt` then `python start.py`.
3. Make your change. Most content lives in plain files:
   - `static/js/k2-messages.js`: K–2 messages (keep them short: 12 words or fewer, everyday words)
   - `static/js/g35.js`: 3–5 message choices, tricks, and fix-it rules
   - `static/js/config.js`: branding and booth settings
4. Run the tests:
   ```sh
   python -m unittest discover -s tests
   node --test "tests/*.test.mjs"
   ```
5. Open a pull request describing what changed and why.

## Guidelines

- **Age-appropriate first.** K–2 content should be gentle and never scary. Wrong answers get hints, not buzzers.
- **Teach the defense.** Every "trick" a student finds should come with why it worked and how to fix it.
- **Stay offline.** No CDNs, web fonts, or online services; the game must run on a laptop with no internet.
- **Credit media.** New sounds or images must be freely licensed (CC0, public domain, or CC BY/BY-SA) and listed in `static/audio/CREDITS.md` (or a matching credits file).
- **Accessibility matters.** Keep buttons large, text readable, and new interactive elements keyboard-friendly.

By contributing, you agree your contributions are released under the project's [MIT License](LICENSE) (media keeps its own credited license).
