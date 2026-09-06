# Metabolic trials

Live: [https://metabolic-trials.vercel.app](https://metabolic-trials.vercel.app)

Public comparison table for a short, curated set of cardiometabolic trials.

Facts come from [ClinicalTrials.gov](https://clinicaltrials.gov) study pages. Primary endpoints are copied from those records. The layout follows Dr Samuel B Hume’s [Lp(a) outcomes table](https://x.com/drsamuelbhume/status/2096225931517952462).

No login. No PHI. No X API. No auto-updating pipeline. The seed lives in `src/lib/trials.ts`.

## Local

```bash
npm install
npm test
npm run dev
```

Open http://127.0.0.1:4522
