# eduard-dev.io

Personal portfolio website for Eduard Proca, built with React + Vite and deployed as a static frontend with a serverless chat endpoint.

## Project overview

This repository contains Eduard's public portfolio:

- Hero, Projects, Skills, About, and Contact sections
- Dynamic project loading from Supabase with a local fallback dataset
- Embedded "Ask My AI" assistant (inline section + floating widget)
- Server-side Gemini chat route with validation and rate limiting
- Mobile-first responsive behavior and touch-friendly UI adjustments

## Stack

- Frontend: React 19, Vite 5, CSS
- Motion/UI: Framer Motion, Lucide React
- Data: Supabase JS client
- Analytics: react-ga4 (Google Analytics)
- AI runtime: Gemini (`gemini-2.5-flash`) via `api/chat.js`

## Repo structure

- `src/` — frontend app
- `src/components/` — UI components (projects, chat, cards)
- `src/context/` — chat state management
- `src/lib/` — Supabase client, fallback project data, fallback chat answers
- `api/chat.js` — serverless chat endpoint
- `dev/viteChatApiPlugin.js` — mounts `/api/chat` in Vite dev/preview
- `public/projects/` — project preview images
- `public/cv/` — CV file

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Production build:
   ```bash
   npm run build
   npm run preview
   ```

## Environment variables

Create a local env file (for example `.env.local`) and set:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
GOOGLE_API_KEY=... # optional alias
GEMINI_MODEL=gemini-2.5-flash
```

Notes:

- API keys must stay server-side only.
- `.env*` files are ignored by git via `.gitignore`.

## Git and push workflow

This local project is intended to push to:

`https://github.com/EduardP19/eduard-dev.io---public`

Typical commands:

```bash
# set remote once
git remote add origin https://github.com/EduardP19/eduard-dev.io---public.git

# stage + commit
git add -A
git commit -m "Update portfolio content and chat features"

# push main
git push -u origin main
```

For later pushes:

```bash
git add -A
git commit -m "Your message"
git push
```

## Internal planning docs

The following files are retained for project context and AI-assisted development workflow:

- `PROMPT.md`
- `SKILL.md`
- `CHATBOT-SYSTEM-PROMPT.md`
