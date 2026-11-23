# TypeFlow

TypeFlow is a local-first typing school built with React and Vite. It pairs guided lessons and drills with live WPM/accuracy analytics, a virtual keyboard with finger guidance, typing games, daily challenges and per-account progress.

Everything runs in the browser. Accounts, settings and progress are stored in `localStorage`, so the app works offline and needs no backend.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## What is inside

- **30 guided lessons** across home row, top/bottom rows, capitals, punctuation, numbers, speed and endurance tracks.
- **Typing engine** with strict/soft error modes, backspace, timed and fixed-length tests, per-key stats and live WPM samples.
- **Virtual keyboard** for QWERTY, Dvorak and Colemak layouts, with next-key and hand guidance.
- **Practice room** with passages, random words, punctuation and numbers.
- **Analytics** with speed trends, activity heatmap, weak keys, personal bests, filters and session history.
- **28 achievements** with tiers, progress bars and unlock tracking.
- **Games and challenges**, including Word Rain and date-seeded daily challenges.
- **Local accounts** with separate progress per profile, guest mode, profile editing and a read-only local admin dashboard.
- **Settings** for theme, caret, font size, layout, sound, keyboard visibility, daily goal and test defaults.
- **Light/dark design system** driven by CSS tokens, with responsive layouts and reduced-motion support.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/lessons` | Lesson library |
| `/lessons/:id` | Lesson runner |
| `/practice` | Practice room |
| `/test` | Typing test |
| `/games` | Word Rain |
| `/challenges` | Daily and timed challenges |
| `/progress` | Analytics dashboard |
| `/achievements` | Achievement gallery |
| `/profile` | Profile and local auth |
| `/settings` | Preferences |
| `/admin` | Local account overview |
| `*` | Not found |

## Stack

- React 19 + Vite 8
- React Router
- Lucide icons
- Oxlint
- Plain CSS with custom properties (`src/styles/`)

## Project layout

```text
src/
  components/   shared UI, keyboard and typing components
  context/      settings, auth and progress providers
  data/         lessons, passages, exercises and achievements
  hooks/        typing engine, timer, stats, sound and session recording
  pages/        route-level pages (lazy loaded except Home)
  services/     localStorage adapter, auth, lessons and progress APIs
  styles/       design tokens and page styles
  utils/        formatting, calculations, keyboard/finger mappings
```

## Notes

- Passwords for local accounts are encoded for demo purposes only. This is not production authentication.
- Data belongs to the browser origin. Clearing site data removes accounts and progress.
- The admin page is intentionally read-only and only sees accounts stored in the same browser.
