<h1 align="center">🎬 Movie Review Project</h1>

<p align="center">
  A modern full-stack movie review application built with <strong>Angular 17</strong> frontend and <strong>Node.js/Express/MongoDB</strong> backend. Users can register, sign in, and create or view reviews for any movie title with beautiful TMDB poster integration.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-17-dd0031?style=flat&logo=angular" alt="Angular 17">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178c6?style=flat&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel" alt="Vercel">
</p>

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Backend API](#backend-api)
6. [Data Models](#data-models)
7. [Frontend Pages](#frontend-pages)
8. [Local Development](#local-development)
9. [Environment Variables](#environment-variables)
10. [Security & Secret Hygiene](#security--secret-hygiene)
11. [Deployment (Vercel + GitHub Actions)](#deployment-vercel--github-actions)
12. [Future Improvements](#future-improvements)  

## 1. Overview
This project provides a complete authenticated movie review system with a modern Angular 17 frontend and Node.js backend. The application features:

- **Backend**: REST API endpoints for authentication and reviews with JWT security
- **Frontend**: Angular 17 SPA with TypeScript, standalone components, premium UI design, and server-side rendering (SSR) support
- **Authentication**: JWT-based auth with secure token handling via HTTP interceptors
- **Movie Posters**: TMDB API integration with graceful fallback for missing posters
- **Deployment**: Automated CI/CD pipeline via GitHub Actions to Vercel

## 2. Features
- 🔐 User registration & login (JWT-based authentication with secure interceptors)
- 🎬 Protected review creation (Bearer token authentication)
- 🔍 Fetch and list reviews by movie name with debounced search
- 🖼️ TMDB movie poster integration with browser-only API calls (SSR-safe)
- 🎨 Premium UI with rich gradient buttons, cards, and smooth animations
- 📱 Fully responsive design optimized for mobile and desktop
- ✅ Health check endpoint for deployment verification
- 🚀 Server-side rendering ready (Angular Universal)

## 3. Tech Stack
**Backend:**
- Node.js 20+
- Express.js
- Mongoose (MongoDB ODM)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)

**Frontend:**
- Angular 17.3 with standalone components
- TypeScript 5.4
- RxJS 7.8 (reactive programming)
- SCSS (styling)
- Angular SSR (server-side rendering)

**Database:**
- MongoDB Atlas (or any MongoDB instance)

**Deployment:**
- Vercel (serverless functions for backend + static hosting for client)
- GitHub Actions (automated CI/CD pipeline)

**Development Tools:**
- Angular CLI
- Proxy configuration for local API routing

## 4. Repository Structure
```
Movie_Review_Project/
├── backend/                    # Express API server
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   └── Review.js
│   ├── routes/                # API routes
│   │   ├── auth.js            # Auth endpoints
│   │   └── reviews.js         # Review endpoints
│   ├── server.js              # Entry point
│   ├── package.json
│   └── vercel.json            # Backend Vercel config
│
├── client/                     # Angular 17 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/         # Page components
│   │   │   │   ├── home/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── add-review/
│   │   │   ├── services/      # Angular services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── review.service.ts
│   │   │   │   └── tmdb.service.ts
│   │   │   ├── guards/        # Route guards
│   │   │   └── interceptors/  # HTTP interceptors
│   │   ├── environments/      # Environment configs
│   │   │   ├── environment.ts
│   │   │   ├── environment.prod.ts
│   │   │   └── environment.local.example.ts
│   │   └── styles.scss        # Global premium styles
│   ├── angular.json           # Angular configuration
│   ├── proxy.conf.json        # Dev proxy config
│   ├── package.json
│   └── vercel.json            # Client Vercel config
│
├── .github/workflows/
│   └── deploy.yml             # CI/CD pipeline
│
├── .gitignore                 # Git ignore rules
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

## 5. Backend API
Base path in production: `https://<your-vercel-domain>/api`

**Auth:**
- `POST /api/auth/signup` – Create user
  ```json
  {
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- `POST /api/auth/signin` – Login, returns JWT
  ```json
  {
    "username": "johndoe",
    "password": "securepassword"
  }
  ```
  Response: `{ token: "jwt-token-here", user: {...} }`
- `POST /api/auth/signout` – Client clears stored token (endpoint optional)

**Reviews:**
- `GET /api/reviews/:movieName` – List reviews for a movie
  ```
  GET /api/reviews/Inception
  ```
- `POST /api/reviews` – Create review (requires `Authorization: Bearer <token>`)  
  ```json
  {
    "movieName": "Inception",
    "rating": 9,
    "reviewText": "Mind-bending visuals!"
  }
  ```

**Utility:**
- `GET /api/health` – `{ ok: true, db: true }` when connected

## 6. Data Models (Simplified)
### User
Fields: `fullName`, `username`, `email`, `passwordHash`

### Review
Fields: `movieName`, `rating`, `reviewText`, `reviewer` (ref to User), `createdAt`

## 7. Frontend Pages
- **`/`** (Home) – Search movies & view reviews with TMDB poster integration
- **`/login`** – Sign in page
- **`/register`** – Account creation page
- **`/add-review`** – Submit a new review (authentication required)

**Key Features:**
- Standalone Angular components
- Functional route guards for auth protection
- HTTP interceptors for automatic JWT token injection
- Debounced search for better UX
- Premium UI with gradient buttons and smooth animations

## 8. Local Development
### Prerequisites
- Node.js 20+
- npm
- MongoDB connection string
- TMDB API key (optional, for movie posters - get free at https://www.themoviedb.org/settings/api)

### Backend
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env
# Edit .env and add your MONGODB_URI and JWT_SECRET

npm start
```
Server runs by default at `http://localhost:5000`.

### Frontend (Dev with Proxy)
```bash
cd client
npm install

# Optional: For TMDB poster support
# Copy environment.local.example.ts to environment.local.ts
cp src/environments/environment.local.example.ts src/environments/environment.local.ts
# Edit environment.local.ts and add your TMDB API key

npm start
```
Open `http://localhost:4200` – calls to `/api/*` are automatically proxied to the backend at port 5000.

### Frontend (Production Build)
```bash
cd client
npm run build
```
Build artifacts will be in `client/dist/client/browser/`.

## 9. Environment Variables

### Backend (Required)
Create `backend/.env` from `backend/.env.example`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moviereviews
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5000
```

### Client (Optional - for local development with TMDB posters)
Create `client/src/environments/environment.local.ts` from `environment.local.example.ts`:
```typescript
export const environment = {
  production: false,
  apiBase: '',
  fallbackApiBase: 'http://localhost:5000',
  tmdbApiKey: 'your-tmdb-api-key-here'
};
```

**Note:** `environment.local.ts` is gitignored and will not be committed.

### Production (Vercel Environment Variables)
Set these in Vercel Dashboard → Project Settings → Environment Variables:

**Backend Project:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret for JWT signing
- `NODE_ENV=production`

**Client Project:**
- `TMDB_API_KEY` - Your TMDB API key (optional but recommended)

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

## 11. Deployment

### Vercel Setup 🚀

The project uses **two separate Vercel projects** for deployment:

1. **Backend Project** (Serverless Functions)
   - Located in `backend/`
   - Deploys Express.js API as serverless functions
   - Routes available at `/api/*`
   - Configuration: `backend/vercel.json`

2. **Client Project** (Angular Static Site)
   - Located in `client/`
   - Builds Angular 17 app with SSR support
   - Serves pre-rendered HTML and client-side Angular
   - Configuration: `client/vercel.json`

### GitHub Actions CI/CD

Automated deployment workflow at `.github/workflows/deploy.yml`:

**Required GitHub Secrets:**
```bash
VERCEL_TOKEN              # Vercel authentication token
VERCEL_ORG_ID             # Vercel organization ID
VERCEL_PROJECT_ID_BACKEND # Backend project ID
VERCEL_PROJECT_ID_CLIENT  # Client project ID
```

**Deployment Flow:**
1. Backend deploys first (Express API)
2. Client builds Angular with `ng build` (Node 20)
3. Client deploys to Vercel

### Manual Deployment

**Backend:**
```bash
cd backend
vercel --prod
```

**Client:**
```bash
cd client
npm run build
vercel --prod
```

### Environment Variables

Configure in Vercel Dashboard → Project Settings → Environment Variables:

**Backend Project:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret for JWT signing
- `NODE_ENV=production`

**Client Project:**
- `TMDB_API_KEY` - TMDB API key for movie posters (optional)

### Post-Deployment

After successful deployment:
- Backend API: `https://your-backend.vercel.app/api/*`
- Client App: `https://your-client.vercel.app/`
- Update API base URL in `client/src/app/services/api.service.ts` if needed

## 12. Future Improvements

### Planned Features 🔮

**Backend:**
- [ ] Review edit & delete endpoints with ownership validation
- [ ] Rate limiting & spam protection using `express-rate-limit`
- [ ] Centralized logging & monitoring (Winston + Sentry)
- [ ] Refresh token implementation for extended sessions
- [ ] User profile management (avatar, bio)
- [ ] Review pagination & filtering

**Frontend:**
- [ ] Advanced form validation (password strength indicator)
- [ ] User profile page with review history
- [ ] Search & filter functionality for movie reviews
- [ ] Responsive image optimization
- [ ] PWA support for offline functionality
- [ ] Dark mode toggle
- [ ] Lazy loading for improved performance

**DevOps:**
- [ ] End-to-end testing with Cypress
- [ ] Unit test coverage increase (>80%)
- [ ] Automated dependency updates (Dependabot)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Database backup automation

---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Status:** ✅ Core auth & review functionality working in production with Angular 17 SSR.

Built with ❤️ using Angular 17, Express.js, and MongoDB.
