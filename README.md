<h1 align="center">Movie Review Project</h1>

Modern full‑stack movie review application built with a Node.js / Express / MongoDB backend and a lightweight Vite‑bundled vanilla JS frontend. Users can register, sign in, and create or view reviews for any movie title.

## Table of Contents
1. Overview  
2. Features  
3. Tech Stack  
4. Repository Structure  
5. Backend API  
6. Data Models  
7. Frontend Pages  
8. Local Development  
9. Environment Variables  
10. Deployment (Vercel + GitHub Actions)  
11. Future Improvements  

## 1. Overview
This project provides a simple authenticated review system. The backend exposes REST endpoints for auth and reviews; the frontend consumes them and handles JWT persistence in `localStorage`.

Posters can be optionally enhanced using TMDB (via the `freekeys` package which retrieves a free key) — if unavailable, placeholder styling is shown.

## 2. Features
- User registration & login (JWT based)
- Protected review creation (Bearer token)
- Fetch and list reviews by movie name
- Simple client-side search box for movies
- Optional TMDB poster lookup (graceful fallback when missing)
- Health check endpoint for deployment verification

## 3. Tech Stack
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs
- **Frontend:** HTML, CSS, ES Modules, Vite build & dev proxy
- **Auth:** JSON Web Tokens (stored in browser `localStorage`)
- **Database:** MongoDB Atlas (or any MongoDB instance)
- **Deployment:** Vercel (serverless for API + static build for client)
- **CI/CD:** GitHub Actions workflow for automated Vercel deploys

## 4. Repository Structure
```
backend/          Express server, routes, models, middleware
client/           Frontend source (multi-page HTML + JS modules)
vercel.json       Unified Vercel build & routing config
.github/workflows/deploy.yml  CI deploy pipeline
```

## 5. Backend API
Base path in production: `https://<your-vercel-domain>/api`

Auth:
- `POST /api/auth/signup` – Create user
- `POST /api/auth/signin` – Login, returns JWT
- `POST /api/auth/signout` – Client clears stored token (endpoint optional)

Reviews:
- `GET /api/reviews/:movieName` – List reviews for a movie
- `POST /api/reviews` – Create review (requires `Authorization: Bearer <token>`)  
	Body example:
	```json
	{
		"movieName": "Inception",
		"rating": 9,
		"comment": "Mind-bending visuals!"
	}
	```

Utility:
- `GET /api/health` – `{ ok: true, db: true }` when connected

## 6. Data Models (Simplified)
### User
Fields: `fullName`, `username`, `email`, `passwordHash`

### Review
Fields: `movieName`, `rating`, `comment`, `user` (ref), `createdAt`

## 7. Frontend Pages
- `index.html` – Search & list reviews
- `login.html` – Sign in
- `register.html` – Account creation
- `add-review.html` – Submit a new review (auth required)

Scripts are bundled by Vite; production HTML references hashed assets in `/assets/`.

## 8. Local Development
### Prerequisites
- Node.js 18+
- MongoDB connection string

### Backend
```pwsh
cd backend
npm install
npm start
```
Server runs by default at `http://localhost:5000`.

### Frontend (Dev with Proxy)
```pwsh
cd client
npm install
npm run dev
```
Open `http://localhost:5173` – calls to `/api/*` are proxied to the backend.

### Frontend (Production Build)
```pwsh
cd client
npm run build
```
Artifacts in `client/dist/`.

## 9. Environment Variables
Set these in Vercel (or a local `.env` for backend):
```
MONGO_URI=<mongodb connection string>
JWT_SECRET=<strong secret>
```
Fallback variable name `MONGODB_URI` is also accepted by the connection logic.

## 11. Security & Secret Hygiene
- Never commit `.env` or secrets. `.gitignore` ignores `.env` and `node_modules/`.
- If secrets were committed, rotate immediately:
	- Change your MongoDB user password and update `MONGO_URI`.
	- Generate a new `JWT_SECRET` (invalidate existing tokens by changing it).
- Purge leaked secrets from Git history:
	- Preferred: use `git filter-repo` or BFG Repo-Cleaner to remove `backend/.env` and `node_modules/` from all commits.
	- Force-push after rewriting history and ask collaborators to re-clone.
- Verify GitHub doesn’t track `node_modules/`: run `git rm -r --cached node_modules backend/node_modules client/node_modules` and commit.
- Store deployment secrets only in:
	- GitHub Actions Secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_*`).
	- Vercel Project Environment Variables (`MONGO_URI`, `JWT_SECRET`).

No frontend build-time vars are strictly required; API base is inferred. Poster enhancement via TMDB occurs automatically if `freekeys` provides a key.

## 10. Deployment
### Vercel (Unified)
`vercel.json` builds:
- Serverless API from `backend/server.js` → `/api/*`
- Static client from `client/` → root HTML pages

### GitHub Actions
Workflow at `.github/workflows/deploy.yml` deploys backend first, then client (two Vercel projects). Ensure secrets:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID_BACKEND
VERCEL_PROJECT_ID_CLIENT
```
Plus production environment variables (`MONGO_URI`, `JWT_SECRET`) configured in each Vercel project.

## 11. Future Improvements (Not Yet Implemented)
- Centralized logging & monitoring
- Client-side form validation enhancements (password strength, etc.)
- Review edit & delete endpoints
- Rate limiting & spam protection

---
**Status:** Core auth & review functionality working in production.

Feel free to open issues or PRs for improvements.
