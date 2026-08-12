# BiteBook V2.1 — GitHub Pages prototype

BiteBook turns eating out into a city-wide collecting game. This V2.1 prototype separates permanent **XP** from spendable **Bites** and adds a working local rewards loop.

## What V2.1 adds

- Permanent XP for levels and leaderboards
- Spendable Bites wallet
- Check-ins, ratings, written reviews and food-photo actions with different rewards
- Quality-review threshold: useful reviews earn more, regardless of star rating
- Restaurant reward marketplace with simulated redemption codes
- Bite spending that does not reduce XP
- Auto-calculated challenge and badge progress
- Updated restaurant partner proposition focused on anonymous, rating-independent rewards
- Automatic migration of old BiteBook V1 browser data where possible

## Run locally

Double-click `index.html`.

## Put it on GitHub Pages

Upload/replace these files in the root of your existing repository:

- `index.html`
- `styles.css`
- `app.js`
- `supabase-schema.sql`
- `README.md`

Commit the changes. If GitHub Pages is already configured to deploy from `main` / `(root)`, the live site should update automatically after the Pages build completes.

## Prototype limitations

V2.1 still stores state in `localStorage`, so users are not genuinely shared across devices yet. Photo upload is represented by a toggle and reward redemption codes are generated locally. The next backend phase should connect Supabase Auth and persist profiles, visits/reviews, groups, wallets, transactions, rewards and redemptions on the server.


## V2.1 map update

Discover now includes an interactive Bristol map powered by Leaflet + OpenStreetMap. Pins distinguish visited, wishlist and unvisited restaurants, reward partners carry a reward badge, and the map responds to search, cuisine and map-status filters.
