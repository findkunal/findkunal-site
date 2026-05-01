# findkunal.com

Personal brand site for Kunal — homepage, apps, and "now" page. Long-form
writing lives separately at [thoughts.findkunal.com](https://thoughts.findkunal.com).

## Stack

- [Astro](https://astro.build) (minimal, static)
- TypeScript (strict)
- Hosted on Vercel

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Structure

```
src/
  components/      # Header, Footer, AppCard, RecentPosts
  content/
    apps/          # one markdown file per app
    config.ts      # apps collection schema
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    about.astro
    apps/
      index.astro
      [...slug].astro
    now.astro
    uses.astro
    contact.astro
    privacy.astro
    404.astro
  styles/
    global.css
```

## Adding an app

Create a new markdown file in `src/content/apps/`:

```md
---
name: My App
tagline: One-line pitch.
status: dev   # dev | beta | live
order: 2
url: https://...        # optional
repo: https://github... # optional
stack: [Astro, TypeScript]
started: 2026-05
---

## Problem
...
```

## Recent posts

The homepage pulls the latest 3 posts from
`https://thoughts.findkunal.com/en/rss.xml` at build time. If the feed
isn't reachable during development, the section degrades gracefully.

## Deployment

Push to GitHub, import as a new Vercel project, add `findkunal.com` and
`www.findkunal.com` as domains.
