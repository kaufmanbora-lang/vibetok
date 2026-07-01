# VibeTok

TikTok-style short-video web app prototype built with React and Vite.

## Features

- Vertical video feed
- Login/logout demo accounts
- Likes, saves, comments, follows
- Recommendations and interest filters
- Live stream screen
- Video upload from local files
- Messages
- Profile customization
- Desktop and mobile responsive layouts

## Run Locally

```bash
pnpm install
pnpm dev
```

Open:

```text
http://127.0.0.1:5173/
```

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
