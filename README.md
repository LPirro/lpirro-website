# lpirro.com

Personal profile landing page for Leonardo Pirro — icon links to YouTube, TikTok, Instagram, Telegram and email, the latest YouTube uploads, and the products from the videos.

## Stack

Zero dependencies, zero build step. Static `index.html` + `assets/site.css` + `assets/picks.js`, plus images in `assets/`. Fonts (Bricolage Grotesque + JetBrains Mono) load from Google Fonts.

The only server-side piece is `api/videos.js`, a Vercel Function that reads the channel's public RSS feed (`youtube.com/feeds/videos.xml`, no API key) and returns the latest long-form uploads as JSON, cached at the edge for an hour. Shorts are left out by reading the channel's auto-generated "Videos" playlist (`UULF…`) instead of the channel feed. If it fails, the home page simply hides the "Ultimi video" section.

## Run locally

```sh
vercel dev --listen 4174
# → http://localhost:4174 (page + /api/videos)
```

Without the Vercel CLI, `python3 -m http.server 4173` serves the page alone (the videos section stays hidden).

## Deploy

Hosted on Vercel (`vercel.json` only holds the www → apex redirect). Pushes to `main` do **not** deploy on their own: after merging, run `vercel deploy --prod` from this checkout.

If the site ever moves off `lpirro.com`, update the `canonical`, `og:url`, and `og:image` URLs in `index.html`.

## Editing

- **Links/handles** — edit the five `.social` anchors in `index.html` (the `aria-label` is also the name sent to Analytics).
- **Latest videos** — `CHANNEL_ID` in `api/videos.js`; `MAX` (cards shown) and the 5 s autoplay interval in the inline script of `index.html`.
- **Profile photo** — replace `assets/profile.avif` and `assets/profile.jpg` (512×512). The avatar is zoom-cropped toward the face via CSS (`.avatar img` → `transform` / `transform-origin`); tweak or remove if a new photo is framed differently.
- **Accent colors** — each card sets its platform color via the inline `--acc` custom property.
