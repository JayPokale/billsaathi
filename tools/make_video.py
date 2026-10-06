"""Demo video: real recordings of the live app in a phone viewport, captions on the left, Piper narration.

Run with the Podium venv (Playwright + Piper):  python tools/make_video.py  ->  build/billsaathi_demo.mp4
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "build"
VOICE = Path.home() / "Desktop/hacktoberfest/work/podium/data/voices/en_US-lessac-medium.onnx"
BROWSER = "/opt/brave-bin/brave"
URL = "https://jaypokale.github.io/billsaathi/"
W, H = 1280, 720
CSS = """<style>html,body{margin:0;width:1280px;height:720px;background:#f7f3ec;font-family:system-ui,'Segoe UI',sans-serif;color:#1c2421}
.s{box-sizing:border-box;width:1280px;height:720px;padding:70px 80px;display:flex;flex-direction:column;justify-content:center}
.l{box-sizing:border-box;width:760px;height:720px;padding:70px 40px 70px 80px;display:flex;flex-direction:column;justify-content:center}
h1{font-size:58px;margin:0 0 14px;line-height:1.1} h2{font-size:40px;margin:0 0 22px;line-height:1.15} p,li{font-size:27px;line-height:1.45;margin:6px 0}
.m{color:#55605b} .b{color:#0f5c55} .tag{display:inline-block;background:#e3f0ed;color:#0f5c55;border-radius:99px;padding:6px 16px;font-size:20px;font-weight:700;margin-bottom:18px}
</style>"""


def run(cmd, **kw):
    subprocess.run(cmd, check=True, **kw)


def shot(name, body, left=False):
    html = OUT / f"{name}.html"
    html.write_text(f"<!doctype html><meta charset=utf-8>{CSS}<div class='{'l' if left else 's'}'>{body}</div>")
    png = OUT / f"{name}.png"
    run([BROWSER, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={W},{H}", f"--screenshot={png}", f"file://{html}"],
        capture_output=True)
    return png


def tts(name, text):
    wav = OUT / f"{name}.wav"
    run([sys.executable, "-m", "piper", "-m", str(VOICE), "--length-scale", "1.05", "-f", str(wav)], input=text.encode(), capture_output=True)
    return wav


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                                capture_output=True, text=True).stdout)


def still(name, png, wav):
    mp4 = OUT / f"seg_{name}.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(png), "-i", str(wav), "-t", f"{dur(wav) + 0.8:.2f}",
         "-vf", "format=yuv420p", "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-ar", "44100", "-ac", "2", "-af", "apad", str(mp4)])
    return mp4


def phone(name, caption_png, video, wav):
    """Caption slide on the left, the phone recording on the right."""
    mp4 = OUT / f"seg_{name}.mp4"
    t = max(dur(video), dur(wav) + 0.8)
    run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(caption_png), "-i", str(video), "-i", str(wav), "-t", f"{t:.2f}",
         "-filter_complex",
         "[1:v]scale=-2:640,tpad=stop_mode=clone:stop_duration=60,pad=iw+12:ih+12:6:6:color=#1c2421[ph];"
         "[0:v][ph]overlay=x=W-w-150:y=(H-h)/2,format=yuv420p[v]",
         "-map", "[v]", "-map", "2:a", "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-ar", "44100", "-ac", "2", "-af", "apad", str(mp4)])
    return mp4


def record(name, steps):
    from playwright.sync_api import sync_playwright
    vdir = OUT / f"rec_{name}"
    vdir.mkdir(exist_ok=True)
    for f in vdir.glob("*.webm"):
        f.unlink()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=BROWSER)
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True, has_touch=True,
                            record_video_dir=str(vdir), record_video_size={"width": 390, "height": 844})
        pg = ctx.new_page()
        steps(pg)
        ctx.close()
        b.close()
    return next(vdir.glob("*.webm"))


def scroll(pg, sel, block="start"):
    pg.evaluate(f"document.querySelector('{sel}').scrollIntoView({{behavior:'smooth',block:'{block}'}})")


def main():
    OUT.mkdir(exist_ok=True)
    segs = []
    segs.append(still("intro", shot("s_intro", "<span class='tag'>Hyperbloom · UI/UX</span><h1>Bill Saathi · बिल साथी</h1>"
        "<p class='b' style='font-size:32px'>A calm companion for a hospital bill you can't pay alone</p>"
        "<p class='m'>English · हिंदी · मराठी · works offline · nothing leaves your phone</p>"),
        tts("n_intro", "This is Bill Saathi, a calm companion for a hospital bill you can't pay alone. It works in English, Hindi and Marathi, offline, and nothing leaves your phone.")))

    segs.append(still("problem", shot("s_problem", "<h2>The moment we designed for</h2><ul>"
        "<li>A relative at the billing counter, on a budget phone, stressed</li><li>Most hospital costs in India are paid out of pocket</li>"
        "<li>The help is real but scattered: PM-JAY, charity-hospital free beds, relief funds, insurance, negotiable bills</li>"
        "<li>People find out <b>after</b> paying, if at all</li></ul>"),
        tts("n_problem", "We designed for one moment: a relative standing at a hospital billing counter, stressed, on a budget phone, and often more comfortable in Hindi or Marathi than English. "
            "Most hospital costs in India are paid out of pocket. Help does exist: government cover, a legal duty on charity hospitals to keep free beds, relief funds, insurance people forget they have. "
            "But it is scattered, and families usually find out after they have paid.")))

    def q_steps(pg):
        pg.goto(URL); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(2500)
        pg.click("text=Find help for this bill"); pg.wait_for_timeout(1200)
        for txt in ["Maharashtra", "I don't know", "No", "Up to ₹1.8 lakh", "Orange / saffron", "Yes", "The patient is a student"]:
            pg.click(f'#qbox label:has-text("{txt}")'); pg.wait_for_timeout(1500)
        pg.wait_for_timeout(2500)
    segs.append(phone("questions", shot("c_q", "<span class='tag'>1 · Find help</span><h2>Seven tap-only questions</h2>"
        "<p>One question per screen, big targets, auto-advance</p><p>“Not sure” is always an answer</p><p class='m'>About one minute, no typing</p>", left=True),
        record("q", q_steps),
        tts("n_q", "Find help asks seven questions, one per screen, with big tap targets and no typing. Each choice moves on by itself, and not sure is always an allowed answer. It takes about a minute.")))

    def r_steps(pg):
        pg.goto(URL + "#results"); pg.reload(); pg.wait_for_timeout(2500)
        pg.click("#card-ipf details:nth-of-type(3) summary") if pg.query_selector("#card-ipf") else None
        for sel in ["#card-jay", "#card-ipf", "#card-hospital", "#checklistPanel"]:
            if pg.query_selector(sel):
                scroll(pg, sel); pg.wait_for_timeout(3500)
    def prep(pg):
        pg.goto(URL); pg.evaluate("""localStorage.setItem('bs_answers', JSON.stringify({state:'mh',hospital:'unknown',age70:false,income:'lt18',ration:'orange',illness:true,insured:'student'}))""")
    def r_all(pg):
        prep(pg); r_steps(pg)
    segs.append(phone("results", shot("c_r", "<span class='tag'>2 · Ranked options</span><h2>What fits, where to go, what to say</h2>"
        "<p>Good fit · Worth applying · Check this · Always ask</p><p>The exact sentence for the desk, with read-aloud and copy</p>"
        "<p>Helplines and official sites one tap away</p><p>A printable document checklist</p>", left=True),
        record("r", r_all),
        tts("n_r", "The results are ranked: good fit, worth applying, check this, and always ask. Every card says why it may fit, which desk to go to inside the hospital, what to carry, "
            "and the exact sentence to say at the desk, with read aloud and copy buttons. Here, a low income family at an unknown private hospital learns that if the hospital is a charity trust, "
            "it must keep free beds for them. All the documents end up in one printable checklist.")))

    def b_steps(pg):
        pg.goto(URL + "#bill"); pg.wait_for_timeout(2000)
        pg.click("#sample"); pg.wait_for_timeout(1500)
        scroll(pg, ".total"); pg.wait_for_timeout(3500)
        scroll(pg, ".flags", "center"); pg.wait_for_timeout(5000)
    segs.append(phone("bill", shot("c_b", "<span class='tag'>3 · Understand my bill</span><h2>From a wall of numbers to questions you can ask</h2>"
        "<p>Groups every line and shows its share</p><p>Explains each part in plain words</p><p>Flags duplicates, extra consumables, service charges</p>", left=True),
        record("b", b_steps),
        tts("n_b", "Understand my bill turns a wall of numbers into questions you can ask. It groups every line, shows each group's share, explains it in plain words, "
            "and flags things worth asking about: here, a lab charge that appears twice, consumables billed outside a package, and a service charge on top of the room rent.")))

    def l_steps(pg):
        pg.goto(URL + "#letter"); pg.wait_for_timeout(1800)
        pg.select_option("#lang", "hi"); pg.wait_for_timeout(1200)
        pg.check("input[value=instalment]"); pg.wait_for_timeout(600)
        for k, v in dict(patient="Sunita Patil", hospital="City Care Hospital, Nagpur", ip="IP-24817", amount="2,12,350", writer="Rahul Patil", phone="98XXXXXX10").items():
            pg.fill(f"[name={k}]", v); pg.wait_for_timeout(250)
        pg.click("#letterForm button[type=submit]"); pg.wait_for_timeout(1000)
        scroll(pg, "#letterText"); pg.wait_for_timeout(4500)
        pg.select_option("#lang", "mr"); pg.wait_for_timeout(3500)
    segs.append(phone("letter", shot("c_l", "<span class='tag'>4 · Write a request</span><h2>A polite letter, in your language</h2>"
        "<p>Itemised bill · instalments or concession · charity reserved bed</p><p>English, Hindi or Marathi from one short form</p><p>Copy, print or share on WhatsApp</p>", left=True),
        record("l", l_steps),
        tts("n_l", "Write a request turns a short form into a polite letter: for an itemised bill, for paying in instalments or asking for a concession, or for a charity reserved bed. "
            "Switch the language and the same letter is rewritten in Hindi or Marathi, ready to print or share on WhatsApp.")))

    def a_steps(pg):
        pg.goto(URL); pg.wait_for_timeout(2000)
        pg.click("#size"); pg.wait_for_timeout(2500)
        pg.emulate_media(color_scheme="dark"); pg.wait_for_timeout(2500)
        pg.select_option("#lang", "hi"); pg.wait_for_timeout(2500)
    segs.append(phone("a11y", shot("c_a", "<span class='tag'>Design &amp; accessibility</span><h2>Built for a hard moment</h2>"
        "<p><b>0</b> axe-core WCAG 2.1 AA violations on every screen</p><p>Text-size toggle · dark mode · reduced motion · read-aloud</p>"
        "<p>No backend, no account, no tracking · works offline</p><p>Every option links to its official source</p>", left=True),
        record("a", a_steps),
        tts("n_a", "Accessibility is not a feature added at the end. An automated W C A G audit finds zero violations on every screen, in light and dark mode. "
            "There's a text size toggle, dark mode, reduced motion and read aloud in the phone's own voice. There is no backend and no account; it works offline in a hospital basement. "
            "And it is honest: every option links to its official source, says when it was checked, and never tells you that you are eligible. It tells you what to ask.")))

    segs.append(still("end", shot("s_end", "<h1>Bill Saathi · बिल साथी</h1><p class='b' style='font-size:34px'>jaypokale.github.io/billsaathi</p>"
        "<p class='m'>Open source (MIT) · github.com/JayPokale/billsaathi</p>"),
        tts("n_end", "Bill Saathi is live and open source. Try it on your phone, and maybe share it with someone standing at a billing counter today.")))

    lst = OUT / "segments.txt"
    lst.write_text("".join(f"file '{s}'\n" for s in segs))
    final = OUT / "billsaathi_demo.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-vf", "fps=30,format=yuv420p",
         "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-c:a", "aac", "-b:a", "160k", "-ar", "44100", str(final)])
    print(final, f"{dur(final):.1f} s")


if __name__ == "__main__":
    main()
