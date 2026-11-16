# Smart Solution — الحلول الذكية

Bilingual Arabic/English company website with interactive 3D branding, seven solution areas, and a responsive layout.

## Run locally

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

## Deploy to Vercel

Import `ali-cs2/smartsolution`, keep framework **Vite**, build command `npm run build`, and output directory `dist`. No environment variables or backend are required. Deployment configuration is included in `vercel.json`.

## Edit content

- `src/main.js`: Arabic and English copy, service descriptions, and interface.
- `src/style.css`: brand palette, responsive layout, animation, reduced-motion support.
- `src/workshop.js`, `src/models.js`, `src/webgl.js`: physical interactive scenes with a shared SVG fallback.
- `src/config.js`: add verified company email or WhatsApp number. Empty channels stay hidden.
- `public/brand/smart-solution-original.jpg`: supplied company logo, preserved unchanged.

Arabic is the default; use `?lang=en` or the language switch. The choice persists locally. Fonts are self-hosted. The project brief form creates a local text file; it does not submit or store visitor data on a server. Contact details were not supplied and are not invented.

## Motion and accessibility

Keyboard navigation, native dialogs, clear focus states, RTL/LTR support, pause control, reduced-motion support, and WebGL fallback. The 3D renderer pauses offscreen and when the tab is hidden.

## V2 workshop and review

The hero contains a robotic arm, an access-control gate, and a connected greenhouse. Drag horizontally, use arrow keys, or use the labeled action controls. The concepts are illustrative; they are not claims of completed client projects. The same geometry powers the WebGL and no-GPU SVG views. Use `?renderer=svg` to verify the fallback explicitly.

The supplied JPEG remains unchanged. The visible header uses a transparent SVG web adaptation at `public/brand/smart-solution-web.svg`, avoiding a white image rectangle.

See [source review](docs/REVIEW.md) for findings, fixes, and verification limits.

Run pure model tests:

```sh
node --test scripts/models.test.mjs
```

The GitHub Actions workflow builds the site and runs responsive browser checks on Chromium, Firefox, and WebKit. It attaches screenshots and test reports. To run the same browser suite locally after `npm ci`, run:

```sh
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium firefox webkit
npm run build
npx playwright test
```

## Ownership

Company name, supplied logo, and brand content belong to their respective owner. Third-party dependency and font licenses remain with their authors.
