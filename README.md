# CareBridge MVP

A mobile-first Next.js 16 prototype for post-surgical recovery follow-up. It translates the CareBridge Figma prototype into a functional local-first application for hackathon testing.

## Included journeys

- Patient home, recovery plan, check-in, help request, wound photo upload
- Rule-based red/yellow/green prioritisation (support tool, not diagnosis)
- Adaptive next check-in schedule
- Nurse dashboard, patient list, review, tracing and closed-loop actions
- Surgeon escalation and decision workflow
- Live impact metrics calculated from browser data

## Data storage

All changes are stored in `localStorage` under `carebridge-mvp-v1`. Seed records provide a usable first-run demo, but dashboard counts, statuses, check-ins, photos, actions and metrics are calculated from the current browser state.

This is appropriate for MVP usability testing only. Local storage is device-specific and is not suitable for real clinical or sensitive patient data.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run lint
npm run build
npm start -- -H 127.0.0.1 -p 3000
```

## Deploy to Vercel

Import this directory into Vercel as a Next.js project, or run:

```bash
npx vercel
npx vercel --prod
```

No environment variables or database configuration are required.
