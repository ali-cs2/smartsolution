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
- `src/scene.js`: interactive Three.js sculpture; CSS fallback when WebGL is unavailable.
- `src/config.js`: add verified company email or WhatsApp number. Empty channels stay hidden.
- `public/brand/smart-solution-original.jpg`: supplied company logo, preserved unchanged.

Arabic is the default; use `?lang=en` or the language switch. The choice persists locally. Fonts are self-hosted. The project brief form creates a local text file; it does not submit or store visitor data on a server. Contact details were not supplied and are not invented.

## Motion and accessibility

Keyboard navigation, native dialogs, clear focus states, RTL/LTR support, pause control, reduced-motion support, and WebGL fallback. The 3D renderer pauses offscreen and when the tab is hidden.

## Ownership

Company name, supplied logo, and brand content belong to their respective owner. Third-party dependency and font licenses remain with their authors.
