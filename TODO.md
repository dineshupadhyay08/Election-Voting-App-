# TODO: Add Parties & Candidates Component to Home Page

## Server Side

- [x] Add `getParties` function in `server/controller/candidatesController.js` to fetch unique parties with symbols and candidate counts.
- [x] Add GET route for `/parties` in `server/routes/Router.js`.

## Client Side

- [x] Create new component `client/src/components/PartiesCandidates.jsx` that fetches parties and displays them in a grid.
- [x] Implement click functionality to show party details and candidates (using modal or expansion).
- [x] Add admin features for adding/removing parties and candidates.
- [x] Update `client/src/pages/Home.jsx` to import and use `<PartiesCandidates />` instead of dummy data.

## Testing

- [ ] Test the new API endpoint `/parties`.
- [ ] Test component rendering and click functionality.
- [ ] Ensure proper error handling and loading states.
