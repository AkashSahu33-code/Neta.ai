# NētāAI — AI Co-Pilot for Public Leaders

> A multi-agent AI platform for hyperlocal governance intelligence

![Mock Mode](https://img.shields.io/badge/Mode-Mock%20%2B%20Live%20AI-blue)
![Gemini](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## What is NētāAI?

NētāAI is an AI-powered co-pilot dashboard designed for public leaders, MLAs, and administrators. It uses a **4-agent agentic AI architecture** to process governance data and generate actionable insights in real time.

### 4 Specialized AI Agents

| Agent | Role |
|---|---|
| 🔵 Document Intelligence | Summarizes documents, drafts speeches, extracts action items |
| 🟢 Community Intelligence | Voter segmentation, booth analytics, demographic mapping |
| 🟡 Governance Tracking | Project monitoring, before/after verification, citizen alerts |
| 🔴 Sentiment & Workers | Sentiment analysis, party worker management, trend detection |

---

## Live Demo

Works in two modes:

- **Mock Mode** (default) — No API key needed. Pre-built intelligent responses for all agents.
- **Live AI Mode** — Connect your free Gemini API key for real AI-generated responses.

---

## Getting Started

### Option 1 — Run Locally (No setup needed)

```bash
git clone https://github.com/YOUR_USERNAME/netaai.git
cd netaai
# Open index.html in any browser
```

That's it. No npm, no build step, no server required.

### Option 2 — Deploy on GitHub Pages (Free)

1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your app is live at `https://YOUR_USERNAME.github.io/netaai`

---

## Connecting Real AI (Optional)

1. Get a **free** Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Open the dashboard → click the **⚙️ Settings** icon (top right)
3. Select **Google Gemini**, paste your API key → Save
4. Dashboard switches to **Live AI Mode** automatically

> Supports both **Google Gemini** (free) and **OpenAI / compatible APIs**

---

## Project Structure

```
netaai/
├── index.html          # Main dashboard
├── pitch.html          # Pitch deck (presentation mode)
├── css/
│   └── styles.css      # All styles
└── js/
    ├── api.js           # LLM API integration (Gemini + OpenAI)
    └── app.js           # Dashboard logic, charts, agent demos
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| AI Integration | Google Gemini API / OpenAI API |
| Charts | Chart.js |
| Icons | Font Awesome 6 |
| Deployment | GitHub Pages (static) |

---

## Key Features

- **Zero backend required** — fully client-side, deployable on GitHub Pages
- **Mock → Live fallback** — works without API key, upgrades automatically when key is added
- **4 parallel agents** — multi-agent orchestration using `Promise.allSettled()`
- **3 demo scenarios** — Smart City, Water Crisis, Election Prep (pre-loaded with real data)
- **Responsive design** — works on desktop and mobile

---

## Screenshots

> Dashboard overview, agent demos, and live multi-agent orchestration

*(Add screenshots here after deployment)*

---

## Built By

**Akash Sahu** — B.Tech Biomedical Engineering, NIT Raipur  
[LinkedIn](#) · [GitHub](#)

---

## License

MIT License — free to use and modify
