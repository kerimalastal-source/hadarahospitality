# HADARA Hospitality — new homepage prototype

## Design colors

Use this palette for every new page and component:

| Role | Color |
| --- | --- |
| Dark navy | `#1E2A38` |
| Muted gold | `#C5A059` |
| Pure white | `#FFFFFF` |
| Warm ivory | `#F1EBE4` |

The shared CSS variables in `styles.css` define these colors. Use navy for primary text and dark surfaces, white for main content, ivory for alternating sections, and gold for accents and calls to action. Keep small body text navy on light backgrounds for readability.

Responsive, static homepage inspired by the existing HADARA Hospitality site. It includes collections, supply benefits, process and a quotation request that opens the visitor's email app. It does not yet send or store submissions server-side.

## Run

```sh
npm install
npm run dev
```

## Publish on Vercel

Push this folder to a GitHub repository, import the repository in Vercel, and use the default Vite build (`npm run build`, output directory `dist`). Keep the existing live domain unchanged until the new site has been reviewed and all needed pages and integrations have been migrated.

Some collection photos currently reference the existing site's Wix media URLs. Replace those with locally hosted licensed/owned optimized images before final launch. The H monogram is a temporary text mark pending the original logo asset.
