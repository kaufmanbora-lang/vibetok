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

## Run As One Shared TikTok-Style Server

For accounts to be visible to everyone, all users must open the same deployed Node server. This mode serves both the frontend and `/api` from one address, so registrations, profiles, follows, admin badges, and follower counters are shared.

```bash
pnpm install
pnpm build:hosted
pnpm start
```

Open:

```text
http://127.0.0.1:8787/
```

The shared database is stored in `data/vibetok-db.json` by default. On a host, set `VIBETOK_DB_PATH` to a persistent disk path.

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

GitHub Pages is static. It cannot run the shared account API by itself. If you deploy only to GitHub Pages, visitors can see the frontend, but real shared accounts need a separate hosted API or the full-stack server below.

If you use GitHub Pages with "Deploy from a branch", upload the built files from `../../outputs/vibetok/dist` to the repository root:

```text
index.html
favicon.svg
assets/
```

Do not upload the source `index.html` from this project root to Pages directly. That file is only for Vite development and can show a blank page when served by GitHub Pages without a build step.

For public shared accounts with a separate API, deploy `server.mjs` to a Node host and build the frontend with:

```bash
VITE_VIBETOK_API_URL=https://your-api.example.com/api pnpm build
```

## Deploy Full Shared App

The repo includes `render.yaml` for a single shared web service. Deploy the source project to Render as a Blueprint. This is the mode to use when the app must keep working while your computer is off.

This configuration uses a persistent disk, so the web service uses the `starter` instance type instead of `free`. Free Render web services do not keep local JSON databases or uploaded files after restarts/spin-downs.

Render will run:

```text
pnpm build:hosted
pnpm start
```

After that, give users the Render URL, not a GitHub Pages URL. Everyone on that URL will use the same `/api` and the same shared account database.

Quick deploy steps:

```text
1. Upload VIBETOK_SHARED_FULLSTACK_SOURCE.zip to a GitHub repository.
2. Open Render Dashboard.
3. Create a new Blueprint from that repository.
4. Render reads render.yaml automatically.
5. After deploy, open the onrender.com URL.
```

## TikTok Seed Feed

The starter feed uses 97 cleaned TikTok post IDs from public Russian-language Telegram/RPubs pages plus a strict non-war subset of the public `networkdynamics/ukraine-tiktok` `video_ids.csv` dataset. Obvious war/news/politics sources are excluded. The app renders posts through TikTok's official iframe player and does not download or rehost TikTok video files.

## Recommendations And Consent

The "For You" feed can learn locally from in-app views, skips, likes, saves, follows, searches, and selected tags after the user accepts the recommendations agreement. The app does not silently read browser history, other apps, or other websites. External interests are used only when the user explicitly enables that option and enters the topics manually.
