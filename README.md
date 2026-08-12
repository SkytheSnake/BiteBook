# BiteBook — GitHub MVP v0.1

This is a **zero-build prototype**. You do not need npm, React, Vite or a server to test it.

## Put it online with GitHub Pages

1. Create a new GitHub repository, e.g. `bitebook`.
2. Upload `index.html`, `styles.css`, `app.js`, `supabase-schema.sql` and this README to the repository root.
3. In GitHub go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose your main branch and `/ (root)`, then Save.
6. GitHub will give you the public Pages address once deployed.

## Included in v0.1

- Bristol restaurant discovery
- Restaurant/area/cuisine search
- Cuisine filters
- Wishlist saving
- Five-star ratings
- Personal BiteBook of visited restaurants
- BiteBook points
- Friend-group leaderboard
- Monthly-style challenge and badges
- Restaurant deals section
- Restaurant partner/dashboard concept
- Mobile layout
- Browser persistence via `localStorage`
- Starter Supabase SQL schema for the next version

## Data

The restaurants are prototype seed data. **Deals are labelled as demo deals and are not claims about current real-world offers.** Before launch, restaurant records should be confirmed and restaurant owners should be able to claim/manage their own profiles.

## Next build: v0.2

The sensible next step is connecting Supabase so BiteBook has real user accounts and shared data. I would add, in this order:

1. Email/social sign-up and user profiles
2. Real restaurant table populated from an admin account
3. Visit/rating/wishlist syncing
4. Create/join groups using invite codes
5. Real group leaderboards generated from activity
6. Restaurant claiming and restaurant-admin accounts
7. Deals created by restaurants
8. Booking links/requests

`supabase-schema.sql` contains the initial database tables for that work.
