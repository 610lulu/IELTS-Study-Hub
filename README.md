# BandUp IELTS Study Hub

BandUp IELTS Study Hub is a lightweight IELTS learning dashboard for students working from Band 5.5 toward Band 6.5. It combines a study dashboard, vocabulary tracker, writing archive, speaking practice lab, and study plan board in one local-first web app.

Live site: https://610lulu.github.io/IELTS-Study-Hub/

## Features

- Dashboard with Band journey, daily tasks, streak, and four-skill progress
- Vocabulary page with topics, search, filters, review mode, and mastery status
- Writing studio for saving Task 1 and Task 2 essay drafts
- Speaking lab with Part 1, Part 2, and Part 3 question bank plus Part 2 timers
- Study plan page for exam date, target band, daily minutes, and task check-ins
- LocalStorage persistence, so data stays in the browser without a database
- Responsive dashboard-style UI for desktop and mobile

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Lucide React icons
- LocalStorage
- GitHub Pages static export

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

## Project Structure

```text
app/
  page.tsx
  vocabulary/page.tsx
  writing/page.tsx
  speaking/page.tsx
  plan/page.tsx
components/
  NavBar.tsx
  ProgressCard.tsx
  TaskList.tsx
  Timer.tsx
  WordCard.tsx
  WritingEditor.tsx
lib/
  storage.ts
  sampleQuestions.ts
types/
  index.ts
```

## Deployment

The app is configured for GitHub Pages through static export. The workflow in `.github/workflows/pages.yml` builds the site with:

```bash
GITHUB_PAGES=true npm run build
```

The deployed site is served under the repository path:

```text
/IELTS-Study-Hub/
```

## Roadmap

- Add OpenAI-powered IELTS Writing feedback
- Add speaking recording and transcript review
- Add Supabase login and cloud sync
- Add richer progress analytics across weeks

## License

MIT
