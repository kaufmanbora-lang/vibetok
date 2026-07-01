# VibeTok

TikTok-style short-video web app prototype built with React and Vite.

## Features

- Vertical video feed
- Cleaned Russian-language TikTok seed feed loaded on first launch
- Email registration and login
- Admin account with moderation, premium tags, and verified badges
- Likes, saves, comments, follows
- Consent-based personalized recommendations and interest filters
- Live stream screen
- Video upload from local files, direct video links, and bulk TikTok link import
- Messages
- Profile customization
- Desktop and mobile responsive layouts

## Run Locally

```bash
pnpm install
pnpm api
pnpm dev
```

Open:

```text
http://127.0.0.1:5173/
```

Run `pnpm api` in a second terminal and keep it open while testing shared accounts. The API stores real registered users and follows in `data/vibetok-db.json`.

## Build

```bash
pnpm build
```

The production files are generated in:

```text
../../outputs/vibetok/dist
```

## GitHub Pages

The Vite config uses `base: "./"`, so the built app can be hosted from a GitHub Pages subpath.

GitHub Pages can host the frontend, but it cannot run the account API. For public shared accounts, deploy `server.mjs` to a Node host and build the frontend with:

```bash
VITE_VIBETOK_API_URL=https://your-api.example.com/api pnpm build
```

## TikTok Seed Feed

The starter feed uses 97 cleaned TikTok post IDs from public Russian-language Telegram/RPubs pages plus a strict non-war subset of the public `networkdynamics/ukraine-tiktok` `video_ids.csv` dataset. Obvious war/news/politics sources are excluded. The app renders posts through TikTok's official iframe player and does not download or rehost TikTok video files.

## Recommendations And Consent

The "For You" feed can learn locally from in-app views, skips, likes, saves, follows, searches, and selected tags after the user accepts the recommendations agreement. The app does not silently read browser history, other apps, or other websites. External interests are used only when the user explicitly enables that option and enters the topics manually.
