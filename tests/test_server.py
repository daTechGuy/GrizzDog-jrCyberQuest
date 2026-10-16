"""Server tests: page and assets, the quest API, and the no-Flask fallback server.

Run from the project folder:  python -m unittest discover -s tests
"""
import json
import os
import re
import sys
import threading
import time
import unittest
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import app  # noqa: E402
from api_cases import API_CASES  # noqa: E402


class PageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.get_app().test_client()

    def test_index_page(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        html = res.get_data(as_text=True)
        for text in ["Junior Paws", "Cyber Scouts", "Sentry Sleuths", "Red Team Cadets", "mascotCaeKu", "modalKuTag"]:
            self.assertIn(text, html)

    def test_every_linked_file_exists(self):
        html = self.client.get("/").get_data(as_text=True)
        paths = set(re.findall(r'(?:src|href)="(/static/[^"?]+)', html))
        self.assertGreater(len(paths), 8)
        for path in sorted(paths):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)

    def test_sound_effects_and_credits(self):
        for name in ["bark.mp3", "whine.mp3", "woof.mp3", "cheer.mp3", "lock.mp3"]:
            with self.subTest(name=name):
                res = self.client.get(f"/static/audio/{name}")
                self.assertEqual(res.status_code, 200)
                self.assertEqual(res.mimetype, "audio/mpeg")
        credits = open(os.path.join(ROOT, "static", "audio", "CREDITS.md"), encoding="utf-8").read()
        for name in os.listdir(os.path.join(ROOT, "static", "audio")):
            if name.endswith(".mp3"):
                self.assertIn(f"`{name}`", credits, f"{name} needs a line in static/audio/CREDITS.md")


class QuestApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.get_app().test_client()

    def post(self, body):
        return self.client.post("/api/quest", json=body)

    def test_guardrail_cases(self):
        for grade, payload, expect in API_CASES:
            with self.subTest(grade=grade, payload=payload[:40]):
                res = self.post({"grade": grade, "payload": payload})
                self.assertEqual(res.status_code, 200)
                data = res.get_json()
                self.assertEqual(data["success"], expect)
                self.assertTrue(data["cae_ku"])
                self.assertTrue(data["nice_role"])

    def test_browser_only_grades_are_refused(self):
        for grade in ["k2", "g35", "", "nope"]:
            with self.subTest(grade=grade):
                self.assertEqual(self.post({"grade": grade, "payload": "hello"}).status_code, 400)

    def test_empty_prompt_is_refused(self):
        self.assertEqual(self.post({"grade": "g912", "payload": "   "}).status_code, 400)


class FallbackServerTests(unittest.TestCase):
    PORT = 5099

    @classmethod
    def setUpClass(cls):
        threading.Thread(target=app.run_fallback_server, args=(cls.PORT,), daemon=True).start()
        time.sleep(0.5)

    def status(self, path):
        try:
            return urllib.request.urlopen(f"http://127.0.0.1:{self.PORT}{path}").status
        except urllib.error.HTTPError as e:
            return e.code

    def test_serves_game_files(self):
        for path in ["/", "/static/js/app.js", "/static/css/app.css", "/static/audio/bark.mp3"]:
            with self.subTest(path=path):
                self.assertEqual(self.status(path), 200)

    def test_only_static_folder_is_reachable(self):
        for path in ["/app.py", "/static/../app.py", "/static/%2e%2e/app.py", "/static/..%5capp.py", "/.venv/pyvenv.cfg", "/tests/test_server.py"]:
            with self.subTest(path=path):
                self.assertEqual(self.status(path), 404)

    def test_quest_api(self):
        grade, payload, expect = API_CASES[-1]
        req = urllib.request.Request(f"http://127.0.0.1:{self.PORT}/api/quest",
                                     data=json.dumps({"grade": grade, "payload": payload}).encode(),
                                     headers={"Content-Type": "application/json"})
        self.assertEqual(json.loads(urllib.request.urlopen(req).read())["success"], expect)


if __name__ == "__main__":
    unittest.main()
