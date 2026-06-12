# lpirro.com

Personal profile landing page for Leonardo Pirro — links to TikTok, Instagram, Telegram, and email.

## Stack

Zero dependencies, zero build step. One static `index.html` with inline CSS, plus images in `assets/`. Fonts (Bricolage Grotesque + JetBrains Mono) load from Google Fonts.

## Run locally

```sh
python3 -m http.server 4173
# → http://localhost:4173
```

(Or just open `index.html` in a browser.)

## Deploy

Any static host works — drag the folder into Netlify/Vercel, or push to a GitHub repo and enable GitHub Pages. No configuration needed.

If the site ever moves off `lpirro.com`, update the `canonical`, `og:url`, and `og:image` URLs in `index.html`.

## Editing

- **Links/handles** — edit the four `.card` anchors in `index.html`.
- **Profile photo** — replace `assets/profile.avif` and `assets/profile.jpg` (512×512). The avatar is zoom-cropped toward the face via CSS (`.avatar img` → `transform` / `transform-origin`); tweak or remove if a new photo is framed differently.
- **Accent colors** — each card sets its platform color via the inline `--acc` custom property.
