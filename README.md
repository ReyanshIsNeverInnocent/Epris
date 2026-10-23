<h1 align="center">Épris</h1>

<p align="center">
  <img src="https://i.ibb.co/7dQkH5MH/download-9.jpg" alt="stupidity" width="1000" />
</p>

<p align="center">
  <strong>A tiny, warm little web project for soft vibes, simple design, and a little bit of magic.</strong>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick%20Start-Start%20Here-ff8fab?style=for-the-badge&logo=rocket" alt="Quick Start" /></a>
  <a href="#scripts"><img src="https://img.shields.io/badge/Scripts-View-ffd6e7?style=for-the-badge&logo=terminal" alt="Scripts" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-fff1d6?style=for-the-badge&logo=github" alt="License" /></a>
</p>

> “A little corner for the curious heart.”

<sub><i>Note: This README was written with help from Gemini.</i></sub>

<h2 id="about">🌸 About</h2>

Épris is a small romantic web experience shaped around a minimalist, cozy mood. It’s simple, honest, and easy to explore.

<h2 id="highlights">✨ Highlights</h2>

- Cozy, minimal aesthetic
- Zodiac sign dates, elements, and the vibe-check conversation prompts are maintained in `src/data/zodiac.js`. The element lore is traditional astrology, not scientifically validated compatibility.
- The LOVES paper-game calculation is in `src/utils/loves.js` and displays each pyramid row.
- Lightweight Vite setup
- Quick local development
- Soft, romantic visual direction

<h2 id="quick-start">🚀 Quick start</h2>

```bash
npm install
npm run dev
```

For local configuration, create a root-level `.env` file in this format:

```dotenv
FLAMES_WEBHOOK_URL=
LOVE_WEBHOOK_URL=
LOVES_WEBHOOK_URL=
DEVELOPER_NAME=YourName
DEVELOPERS_CRUSH_NAME=YourCrushName
```

Set a webhook URL to enable comparison notifications for that game. FLAMES, Love Match, and LOVES Pyramid each use their matching variable above. Example submissions do not send notifications.

The `DEVELOPER_NAME` and `DEVELOPERS_CRUSH_NAME` pair gets `Infinity %` in Love
Match and a crossed-out pyramid with `Infinity %` in LOVES. The names are read
by the server and are not bundled into frontend assets. Keep `.env` private and
do not commit it.

<h2 id="scripts">📜 Scripts</h2>

- `npm run dev`: start the dev server
- `npm run build`: build the app
- `npm run preview`: preview the production build
- `npm run start`: run the server

<h2 id="license">📝 License</h2>

MIT © Épris
