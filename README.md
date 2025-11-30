# Movie_review_project

### Deployment

This project is deployed on Vercel with automatic CI/CD via GitHub Actions.

**🚀 For detailed deployment setup instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

# Project Description
The Movie Review Website is a platform designed for users to browse movies and read or submit reviews. It features user authentication for signup, login, and logout functionalities. Users can add reviews for movies, view existing reviews, and interact with the website efficiently. A standout feature of our project is we are fetching the movie data directly from IMDb through an API call. This ensures our users always have access to the most current and comprehensive list of films.
# Features
- User Authentication: Secure signup, login, and logout functionalities.
- Automatic Movie Integration: Movies are automatically added from the IMDb API, ensuring a comprehensive and up-to-date database.
- Add and View Reviews: Users can submit their own reviews and read reviews from other users.
- Detailed Movie Information: Each movie entry includes titles, release dates, cast, crew, plot summaries, genres, and ratings from IMDb.



## Client (Frontend)

A minimal, framework-free client has been added under `client/` to work with the existing backend without changing any server logic. It supports:

- Login, register, logout
- Search reviews for a movie
- Add a new review (requires login)

Pages:

- `client/index.html` — Search and list reviews
- `client/login.html` — Sign in
- `client/register.html` — Create account
- `client/add-review.html` — Create a review

### Run the client locally

Option A — Vite dev server with proxy (recommended):

```pwsh
cd client
npm install
npm run dev
```

Open http://localhost:5173. All requests to `/api/*` are proxied to `http://localhost:5000` (no CORS hassles).

Option B — Serve static files:

```pwsh
# Python (if installed)
python -m http.server 5173 -d client

# Or npx serve
npx serve client -l 5173
```

When serving statically, the client defaults to `http://localhost:5000`. To target a different backend:

```js
localStorage.setItem('API_BASE_URL','https://your-backend-host');
```

### Optional: Real movie posters (TMDB)

The home page can show real posters via TMDB. Set an API key in the browser:

```js
// In DevTools Console on http://localhost:5173
localStorage.setItem('TMDB_API_KEY','<your_tmdb_api_key>')
location.reload()
```

If no key is set, the client falls back to placeholder images.

### Backend

Start the API server as usual (defaults to `http://localhost:5000`). The client calls:

- `POST /api/auth/signup` — register
- `POST /api/auth/signin` — login (stores returned JWT)
- `POST /api/auth/signout` — logout
- `GET /api/reviews/:movieName` — list reviews for movie
- `POST /api/reviews` — create review (Authorization: `Bearer <token>`)

No backend changes were made for the client.
