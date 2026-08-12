# BiteBook V0.4 — Google Maps build

This prototype moves BiteBook's Bristol map from Leaflet/OpenStreetMap to Google Maps + Google Places.

## What's new

- Google Maps replaces the old tiled map.
- Nearby Bristol restaurants are pulled live from Google Places.
- Search for restaurants, cuisines and areas using the main BiteBook search box.
- Google ratings, addresses and business status are shown separately from BiteBook's own ratings.
- Users can add live Google Places to their BiteBook wishlist.
- Check-ins, BiteBook ratings, useful reviews and photo toggles work against Google Place IDs and still earn XP/Bites.
- Directions open the selected Google Place in Google Maps, where the user's current location can be used for navigation.
- Existing demo BiteBook rewards/visited/wishlist states are overlaid where a live Google Place name matches the demo restaurant.

## Add your Google API key

Open `config.js` and replace:

```js
googleMapsApiKey: 'PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE'
```

with your restricted browser API key.

Do not remove the quotes.

Your key should be restricted in Google Cloud to your BiteBook GitHub Pages URL (HTTP referrer restriction) and only the APIs you intend BiteBook to use.

## Publish on GitHub Pages

Replace the files in your existing BiteBook repository with this version, including the new `config.js`, then commit the changes. GitHub Pages should redeploy automatically.

## Important prototype notes

- Google Places search results are intentionally cached in the browser session so changing BiteBook filters does not make another paid Places request unnecessarily.
- Text search is debounced to avoid triggering an API request for every keystroke.
- V0.4 stores only BiteBook user activity in localStorage. Supabase is still the planned next step for real accounts, shared groups, server-side reward redemptions and cross-device progress.
- The demo restaurant catalogue remains in the code for BiteBook rewards and sample content, but live discovery now comes from Google Places.
