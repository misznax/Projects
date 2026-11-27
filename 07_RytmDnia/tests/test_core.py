# -*- coding: utf-8 -*-
"""Testy logiki Rytmu Dnia (bez GUI). Uruchom: python -m unittest discover -s tests -v"""
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
import rytm_core as c  # noqa: E402


def dt(s):
    return datetime.strptime(s, "%Y-%m-%d %H:%M:%S")


class TimeParsing(unittest.TestCase):
    def test_parse_hm(self):
        ok = {"7:30": (7, 30), "07.30": (7, 30), "730": (7, 30), "2330": (23, 30), "19": (19, 0),
              "7h30": (7, 30), " 7,05 ": (7, 5), "0:00": (0, 0)}
        for s, v in ok.items():
            self.assertEqual(c.parse_hm(s), v, s)
        for s in ["", "abc", "25:00", "12:60", "123456", "7:3x", "-1"]:
            self.assertIsNone(c.parse_hm(s), s)

    def test_resolve_sleep_across_midnight(self):
        now = dt("2026-11-27 07:40:00")
        bed, wake = c.resolve_sleep((23, 30), (7, 5), now)
        self.assertEqual(bed, dt("2026-11-26 23:30:00"))
        self.assertEqual(wake, dt("2026-11-27 07:05:00"))

    def test_resolve_sleep_after_midnight_bed(self):
        now = dt("2026-11-27 09:00:00")
        bed, wake = c.resolve_sleep((1, 30), (8, 0), now)
        self.assertEqual(bed, dt("2026-11-27 01:30:00"))
        self.assertEqual(wake, dt("2026-11-27 08:00:00"))

    def test_future_time_means_yesterday(self):
        now = dt("2026-11-27 00:10:00")
        self.assertEqual(c.resolve_recent((23, 30), now), dt("2026-11-26 23:30:00"))
        self.assertEqual(c.resolve_recent((0, 15), now), dt("2026-11-27 00:15:00"))  # w zapasie 10 min

    def test_logical_day(self):
        self.assertEqual(c.logical_day(dt("2026-11-27 03:59:00")), "2026-11-26")
        self.assertEqual(c.logical_day(dt("2026-11-27 04:00:00")), "2026-11-27")
        a, b = c.day_bounds("2026-11-27")
        self.assertEqual((a, b), ("2026-11-27 04:00:00", "2026-11-28 04:00:00"))

    def test_formats(self):
        self.assertEqual(c.fmt_hm(3 * 3600 + 12 * 60 + 5), "3:12")
        self.assertEqual(c.fmt_dur(45), "45 s")
        self.assertEqual(c.fmt_dur(12 * 60), "12 min")
        self.assertEqual(c.fmt_dur(2 * 3600 + 5 * 60), "2 h 05 min")


class Classify(unittest.TestCase):
    def test_chrome_tab(self):
        a = c.classify("chrome.exe", "(3) YouTube - Google Chrome")
        self.assertEqual((a.app, a.title, a.is_browser, a.private), ("Chrome", "YouTube", True, False))

    def test_edge_zero_width_and_more_pages(self):
        a = c.classify("msedge.exe", "Dokument​ and 12 more pages - Personal - Microsoft​ Edge")
        self.assertEqual((a.app, a.title), ("Edge", "Dokument"))

    def test_firefox_emdash(self):
        a = c.classify("firefox.exe", "Trening hybrydowy — Mozilla Firefox")
        self.assertEqual((a.app, a.title, a.is_browser), ("Firefox", "Trening hybrydowy", True))

    def test_title_containing_browser_name_keeps_text(self):
        a = c.classify("chrome.exe", "Czy Brave jest lepsza od Chrome - Test - Google Chrome")
        self.assertEqual(a.title, "Czy Brave jest lepsza od Chrome - Test")

    def test_private_windows_hide_title(self):
        for t in ["Tajne - Google Chrome (Incognito)", "Foo - Microsoft Edge InPrivate", "X — Mozilla Firefox Private Browsing"]:
            proc = "chrome.exe" if "Chrome" in t else ("msedge.exe" if "Edge" in t else "firefox.exe")
            a = c.classify(proc, t)
            self.assertTrue(a.private, t)
            self.assertEqual(a.title, "Okno prywatne")

    def test_apps(self):
        a = c.classify("EXCEL.EXE", "Budżet.xlsx - Excel")
        self.assertEqual((a.app, a.is_browser), ("Excel", False))
        self.assertEqual(c.classify("explorer.exe", "Program Manager").title, "Pulpit")
        self.assertEqual(c.classify("foo.exe", "").title, "(bez tytułu)")
        self.assertEqual(c.classify("", "x").app, "Nieznana aplikacja")

    def test_long_title_is_cut(self):
        a = c.classify("chrome.exe", "A" * 300 + " - Google Chrome")
        self.assertLessEqual(len(a.title), 90)


class StoreAndTracker(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = c.Store(Path(self.tmp.name) / "t.db")
        self.now = dt("2026-11-27 10:00:00")

    def tearDown(self):
        self.store.close()
        self.tmp.cleanup()

    def test_settings_defaults(self):
        self.assertEqual(self.store.get_int("glass_ml"), 300)
        self.store.set("glass_ml", 250)
        self.assertEqual(self.store.get_int("glass_ml"), 250)

    def test_tracker_counts_active_only(self):
        tr = c.Tracker(self.store, self.now, 0.0)
        chrome = ("chrome.exe", "YouTube - Google Chrome")
        excel = ("EXCEL.EXE", "Budżet.xlsx - Excel")
        t = 0.0
        for i in range(30):  # 30 próbek po 2 s = 60 s w Chrome
            t += 2
            tr.tick(self.now + timedelta(seconds=t), t, chrome, 0.0, 300)
        for i in range(15):  # 30 s w Excelu
            t += 2
            tr.tick(self.now + timedelta(seconds=t), t, excel, 0.0, 300)
        for i in range(10):  # bezczynność - nie liczymy
            t += 2
            tr.tick(self.now + timedelta(seconds=t), t, chrome, 400.0, 300)
        self.assertTrue(tr.idle)
        self.assertAlmostEqual(tr.pc, 90, delta=0.01)
        self.assertAlmostEqual(tr.web, 60, delta=0.01)
        t += 3600  # uśpienie komputera: duża luka nie jest czasem pracy
        tr.tick(self.now + timedelta(seconds=t), t, chrome, 0.0, 300)
        self.assertAlmostEqual(tr.pc, 90, delta=0.01)
        t += 2
        tr.tick(self.now + timedelta(seconds=t), t, chrome, 0.0, 300)
        self.assertAlmostEqual(tr.current_seconds(), 62, delta=0.01)

    def test_tracker_persists_and_reloads(self):
        tr = c.Tracker(self.store, self.now, 0.0)
        t = 0.0
        for i in range(10):
            t += 2
            tr.tick(self.now + timedelta(seconds=t), t, ("chrome.exe", "A - Google Chrome"), 0, 300)
        tr.flush()
        tr2 = c.Tracker(self.store, self.now, 0.0)
        self.assertAlmostEqual(tr2.pc, 20, delta=0.01)
        self.assertAlmostEqual(tr2.web, 20, delta=0.01)
        self.assertEqual(tr2.first_ts, tr.first_ts)

    def test_flush_every_minute(self):
        tr = c.Tracker(self.store, self.now, 0.0)
        t = 0.0
        for i in range(31):  # 62 s
            t += 2
            tr.tick(self.now + timedelta(seconds=t), t, ("chrome.exe", "A - Google Chrome"), 0, 300)
        self.assertEqual(len(self.store.usage_rows("2026-11-27")), 1)

    def test_day_rollover_at_4am(self):
        now = dt("2026-11-27 03:59:57")
        tr = c.Tracker(self.store, now, 0.0)
        tr.tick(now + timedelta(seconds=2), 2.0, ("chrome.exe", "A - Google Chrome"), 0, 300)  # 03:59:59
        self.assertEqual(tr.day, "2026-11-26")
        tr.tick(now + timedelta(seconds=4), 4.0, ("chrome.exe", "A - Google Chrome"), 0, 300)  # 04:00:01
        self.assertEqual(tr.day, "2026-11-27")
        self.assertAlmostEqual(tr.pc, 2, delta=0.01)  # nowy dzień liczy od zera
        rows = self.store.usage_rows("2026-11-26")
        self.assertEqual(len(rows), 1)  # poprzedni dzień zapisany przy zmianie
        self.assertAlmostEqual(rows[0][2], 2, delta=0.01)

    def test_item_cap(self):
        old = c.MAX_ITEMS_PER_DAY
        c.MAX_ITEMS_PER_DAY = 3
        try:
            tr = c.Tracker(self.store, self.now, 0.0)
            t = 0.0
            for i in range(10):
                t += 2
                tr.tick(self.now + timedelta(seconds=t), t, ("foo.exe", f"okno {i}"), 0, 300)
            self.assertLessEqual(len(tr.items), 4)
            self.assertAlmostEqual(tr.pc, 20, delta=0.01)
        finally:
            c.MAX_ITEMS_PER_DAY = old

    def test_drinks_meals_checkins(self):
        n = self.now
        self.store.add_drink(n, "Woda", 300)
        self.store.add_drink(n + timedelta(minutes=5), "Kawa", 300)
        self.store.add_drink(n + timedelta(minutes=9), "Woda", 300)
        self.assertEqual(self.store.drink_totals("2026-11-27"), {"Woda": 600, "Kawa": 300})
        last = self.store.undo_last_drink("2026-11-27")
        self.assertEqual(last[2:], ("Woda", 300))
        self.assertEqual(self.store.drink_totals("2026-11-27"), {"Woda": 300, "Kawa": 300})
        self.assertEqual(self.store.drink_totals("2026-11-28"), {})
        self.store.add_meal(n, "Owsianka")
        self.store.add_meal(n + timedelta(hours=3), "Obiad")
        self.store.add_meal(n + timedelta(hours=6), "Owsianka")
        self.assertEqual(self.store.recent_meals(), ["Owsianka", "Obiad"])
        self.assertEqual(self.store.last_meal()[1], "Owsianka")
        self.store.add_checkin(n, 4, "ok")
        self.assertEqual(self.store.last_checkin()[1], 4)
        # zdarzenie o 03:30 należy do poprzedniego dnia logicznego
        self.store.add_drink(dt("2026-11-28 03:30:00"), "Herbata", 300)
        self.assertEqual(self.store.drink_totals("2026-11-27").get("Herbata"), 300)

    def test_sleep_and_summary_and_export(self):
        now = dt("2026-11-27 07:40:00")
        bed, wake = c.resolve_sleep((23, 30), (7, 5), now)
        self.assertTrue(c.need_sleep_question(self.store, now))
        self.store.set_sleep("2026-11-27", bed, wake, "ok")
        self.assertFalse(c.need_sleep_question(self.store, now))
        self.assertFalse(c.need_sleep_question(self.store, dt("2026-11-27 02:00:00") + timedelta(days=1)))
        tr = c.Tracker(self.store, now, 0.0)
        t = 0.0
        for i in range(30):
            t += 2
            tr.tick(now + timedelta(seconds=t), t, ("chrome.exe", "Trening - Google Chrome"), 0, 300)
        self.store.add_drink(now, "Woda", 300)
        self.store.add_meal(now, "Jajka")
        s = c.day_summary(self.store, "2026-11-27", tr)
        self.assertAlmostEqual(s["sleep"][2], 7.58 * 3600, delta=60)
        self.assertAlmostEqual(s["pc"], 60, delta=0.01)
        self.assertEqual(s["tabs"][0][:2], ("Chrome", "Trening"))
        self.assertEqual(s["total_ml"], 300)
        files = c.export_csv(self.store, Path(self.tmp.name) / "exp", "2026-11-27")
        self.assertEqual(len(files), 2)
        for f in files:
            self.assertIn(c.APP_VERSION, f.name)
            self.assertTrue(f.read_text("utf-8-sig").startswith(("data;", "dzień;")))
        self.assertIn("sen;7,58", files[0].read_text("utf-8-sig"))

    def test_skipped_sleep_is_not_asked_again(self):
        now = dt("2026-11-27 09:00:00")
        self.store.set_sleep("2026-11-27", None, None, "skip")
        self.assertFalse(c.need_sleep_question(self.store, now))
        self.assertIsNone(c.day_summary(self.store, "2026-11-27")["sleep"])

    def test_backup_rotation(self):
        folder = Path(self.tmp.name) / "kopie"
        for i in range(10):
            self.store.daily_backup(folder, f"2026-11-{10 + i:02d}", keep=7)
        self.assertEqual(len(list(folder.glob("*.db"))), 7)
        self.assertIsNone(self.store.daily_backup(folder, "2026-11-19", keep=7))  # już jest


class Prompts(unittest.TestCase):
    def test_normalize(self):
        now = dt("2026-11-27 10:00:00")
        self.assertEqual(c.normalize_next_prompt(now, "", 120), "2026-11-27 12:00:00")
        self.assertEqual(c.normalize_next_prompt(now, "2026-11-27 11:00:00", 120), "2026-11-27 11:00:00")
        self.assertEqual(c.normalize_next_prompt(now, "2026-11-27 09:50:00", 60), "2026-11-27 09:50:00")
        self.assertEqual(c.normalize_next_prompt(now, "2026-11-26 20:00:00", 60), "2026-11-27 11:00:00")
        self.assertEqual(c.normalize_next_prompt(now, "2026-11-27 11:00:00", 0), "")

    def test_due(self):
        now = dt("2026-11-27 10:00:00")
        self.assertTrue(c.prompt_due(now, "2026-11-27 09:59:00", 60, 5))
        self.assertFalse(c.prompt_due(now, "2026-11-27 10:01:00", 60, 5))
        self.assertFalse(c.prompt_due(now, "2026-11-27 09:59:00", 60, 600))  # nikogo przy PC
        self.assertFalse(c.prompt_due(now, "2026-11-27 09:59:00", 0, 5))  # wyłączone
        self.assertFalse(c.prompt_due(now, "", 60, 5))


class Probes(unittest.TestCase):
    def test_make_probe_never_raises(self):
        p = c.make_probe()
        self.assertTrue(p.foreground() is None or len(p.foreground()) == 2)
        self.assertIsInstance(p.idle_seconds(), float)

    def test_single_instance_first_call_ok(self):
        self.assertTrue(c.acquire_single_instance())


if __name__ == "__main__":
    unittest.main()
