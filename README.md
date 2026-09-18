# HADARA Hospitality — website

Code-built site for hadarahospitality.com. Built with [Astro](https://astro.build)
and TypeScript — static output, no backend, no client-side framework runtime.

## Design colors

Use this palette for every new page and component:

| Role | Color |
| --- | --- |
| Dark navy | `#1E2A38` |
| Muted gold | `#C5A059` |
| Pure white | `#FFFFFF` |
| Warm ivory | `#F1EBE4` |

The shared CSS variables in `src/styles/global.css` define these colors. Use navy
for primary text and dark surfaces, white for main content, ivory for
alternating sections, and gold for accents and calls to action.

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build   # runs the generators, then `astro build` into dist/
npm run preview # serve the built dist/ locally
```

## Publish on Vercel

Vercel auto-detects Astro and runs `npm run build` (output directory `dist`).
No manual configuration needed. See `CLAUDE.md` for the full project context,
architecture and conventions.

Some collection photos currently reference the existing site's Wix media URLs
— see the "Pending / deferred" section of `CLAUDE.md`.
