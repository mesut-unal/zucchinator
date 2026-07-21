# 🥒 Zucchinator

A tiny, install-to-home-screen web app for **data science interview prep** — 5–10
minutes, one question, every day. Terminator, but with a zucchini.

Topics you pick manually:

- 🐍 **Python** — coding practices & idioms
- 🗃️ **SQL** — queries & window functions
- 📊 **Data Science** — stats & ML concepts
- 🤖 **AI Coding** — DNN, ML & agentic code

Questions are sized for ≤10 minutes. Harder concepts are broken into a **series**
(Part 1/4, 2/4, …) so they build across days. Optional **AI tutor** help (Gemini /
OpenAI / Anthropic) with your own API key — the key lives only on your phone.

No accounts, no backend, no build step. Just static files + `localStorage`.

---

## Run it locally

```bash
cd zucchinator
python3 -m http.server 8731
# open http://localhost:8731
```

## Put it on your iPhone (GitHub Pages)

GitHub Pages hosts the static files for free and gives you a URL you can "Add to
Home Screen" so it behaves like a native app (icon, full-screen, works offline).

1. **Create an empty repo** on GitHub named `zucchinator` (Settings → keep it public
   for free Pages).
2. **Push this folder:**
   ```bash
   cd zucchinator
   git init            # already done if you cloned this
   git add -A
   git commit -m "Zucchinator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/zucchinator.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `root` →
   Save.** Wait ~1 minute.
4. Open `https://<your-username>.github.io/zucchinator/` in **Safari on your iPhone**.
5. Tap the **Share** icon → **Add to Home Screen**. Done — tap the 🥒 icon each day.

> The AI tutor calls the provider's API directly from the page, which only works on a
> real `https://` page (like Pages) — not inside a Claude Artifact, whose sandbox
> blocks external calls.

## Turn on AI help

Tap ⚙️ → pick a provider → paste an API key → Save.

- **Gemini** (free tier): https://aistudio.google.com/apikey
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/settings/keys

Your key is stored in this device's `localStorage` and sent only to the provider you
choose. Clearing site data / browser storage removes it.

---

## Add your own questions

Everything lives in [`js/questions.js`](js/questions.js) — a plain array. Copy an
object, change the fields, done. Questions are served in **array order** within each
topic, so to add a new part to a series just place it after the previous part.

```js
{
  id: "py-new-1",          // unique, never reuse an old id
  topic: "python",          // python | sql | ds | ai
  series: "My Series",      // optional chip
  part: [1, 3],             // optional -> "Part 1/3"
  title: "Short title",
  difficulty: "easy",       // easy | medium | hard
  minutes: 7,
  prompt: `Markdown supported: **bold**, \`code\`, fenced \`\`\` blocks, - and 1. lists`,
  hint: `One nudge.`,
  solution: `Worked answer in markdown.`,
}
```

After editing files, bump `CACHE` in [`sw.js`](sw.js) (e.g. `zucchinator-v2`) so
installed copies pick up the change, then push again.

## Files

| File | What |
|---|---|
| `index.html` | App shell + PWA meta tags |
| `js/questions.js` | **The question bank — edit this** |
| `js/app.js` | App logic, markdown renderer, AI provider calls |
| `css/styles.css` | Styling (dark, mobile-first) |
| `manifest.webmanifest` | PWA manifest (name, icons) |
| `sw.js` | Service worker (offline cache) |
| `icons/` | App icons (regenerate with `tools/make_icons.py`) |

Your progress and streak are stored per-device in `localStorage`; there's no server,
so they don't sync across devices.
