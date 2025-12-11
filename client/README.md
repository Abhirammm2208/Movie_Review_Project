# Movie Review Platform - Frontend (Angular 17)

> Modern Angular single-page application with server-side rendering for the Movie Review Platform.

[![Angular](https://img.shields.io/badge/Angular-17.3.0-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8.0-B7178C?logo=reactivex)](https://rxjs.dev/)
[![SSR](https://img.shields.io/badge/SSR-Enabled-00897B?logo=angular)](https://angular.io/guide/ssr)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Development](#development)
- [Building](#building)
- [Components & Services](#components--services)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)

---

## 🎯 Overview

This Angular 17 application provides a rich user interface for browsing and reviewing movies. It features:

- **Standalone Components** - No NgModules required
- **Server-Side Rendering** - Improved SEO and initial load performance
- **Reactive Architecture** - RxJS for state management
- **TMDB Integration** - Fetch movie posters and metadata
- **JWT Authentication** - Secure user sessions
- **Premium UI/UX** - Modern gradients, animations, and responsive design

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 17.3.0 | Core framework with standalone components |
| **TypeScript** | 5.4.2 | Type-safe JavaScript |
| **RxJS** | 7.8.0 | Reactive programming |
| **@angular/ssr** | 17.3.17 | Server-side rendering |
| **Zone.js** | 0.14.3 | Change detection |
| **TMDB API** | v3 | Movie metadata and posters |

---

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── components/          # UI components
│   │   │   ├── home/           # Homepage with movie grid
│   │   │   ├── login/          # Login form
│   │   │   ├── register/       # Registration form
│   │   │   └── add-review/     # Review submission form
│   │   ├── models/             # TypeScript interfaces
│   │   │   └── review.model.ts # Review data model
│   │   ├── services/           # Angular services
│   │   │   ├── api.service.ts  # HTTP client for backend
│   │   │   ├── auth.service.ts # Authentication logic
│   │   │   └── tmdb.service.ts # TMDB API integration
│   │   ├── app.component.*     # Root component
│   │   ├── app.config.ts       # Application configuration
│   │   └── app.routes.ts       # Route definitions
│   ├── environments/           # Environment configs
│   │   ├── environment.ts      # Development (empty keys)
│   │   ├── environment.prod.ts # Production (empty keys)
│   │   ├── environment.local.example.ts # Template
│   │   └── environment.local.ts # Local secrets (gitignored)
│   ├── styles.scss             # Global styles
│   ├── index.html              # HTML entry point
│   └── main.ts                 # Bootstrap application
├── angular.json                # Angular CLI config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── vercel.json                 # Vercel deployment config
```

---

## ✨ Key Features

### 🏠 Home Component
- Displays all movie reviews in a responsive grid
- Fetches movie posters from TMDB API
- SSR-safe with `isPlatformBrowser()` checks
- Premium card design with hover effects

### 🔐 Authentication
- JWT-based login/register
- Token stored in localStorage (browser only)
- Route guards for protected pages
- Auto-logout on token expiration

### 📝 Add Review
- Submit movie reviews with ratings (1-5 stars)
- Form validation with Angular Reactive Forms
- Authenticated users only
- Automatic TMDB poster fetching

### 🎨 Premium UI
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Responsive design (mobile-first)
- Dark-themed color palette

---

## 🚀 Development

### Prerequisites
- Node.js 20+ and npm
- Angular CLI 17+ (`npm install -g @angular/cli`)

### Setup

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy example to create local environment
   cp src/environments/environment.local.example.ts src/environments/environment.local.ts
   
   # Edit and add your keys
   code src/environments/environment.local.ts
   ```

3. **Start dev server:**
   ```bash
   ng serve
   ```

4. **Open browser:**
   Navigate to `http://localhost:4200/`
   - Auto-reload on file changes
   - No SSR in dev mode (faster HMR)

---

## 🏗️ Building

### Development Build
```bash
ng build
```

### Production Build (with SSR)
```bash
ng build --configuration production
npm run serve:ssr:client
```

Build artifacts are stored in `dist/client/`.

---

## 🧩 Components & Services

### Components

**HomeComponent** (`home.component.ts`)
- Fetches reviews from backend API
- Integrates TMDB for movie posters
- Handles SSR with platform checks
- Displays responsive movie grid

**LoginComponent** (`login.component.ts`)
- Reactive form with validation
- Calls AuthService for JWT token
- Redirects to home on success

**RegisterComponent** (`register.component.ts`)
- User registration form
- Password confirmation validation
- Error handling for duplicate users

**AddReviewComponent** (`add-review.component.ts`)
- Protected route (requires auth)
- Rating input (1-5 stars)
- Submits to backend API

### Services

**ApiService** (`api.service.ts`)
- HttpClient wrapper for backend API
- Base URL: `http://localhost:3000/api`
- Handles all HTTP requests
- Error handling with RxJS

**AuthService** (`auth.service.ts`)
- Login/register methods
- Token management (localStorage)
- `getToken()` and `logout()` helpers
- Observable-based auth state

**TmdbService** (`tmdb.service.ts`)
- Fetches movie posters from TMDB
- API key from environment variables
- SSR-safe with browser platform checks
- Returns poster URLs or defaults

---

## 🔧 Environment Configuration

### Files Structure
- `environment.ts` - Development (committed, empty keys)
- `environment.prod.ts` - Production (committed, empty keys)
- `environment.local.ts` - Local secrets (gitignored)
- `environment.local.example.ts` - Template for local setup

### Configuration Example

**`environment.local.ts`** (not committed):
```typescript
export const environment = {
  production: false,
  tmdbApiKey: 'your-tmdb-api-key-here',
  apiUrl: 'http://localhost:3000/api'
};
```

**Production (Vercel):**
Set `TMDB_API_KEY` in Vercel Dashboard → Environment Variables.

---

## 🚢 Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment with SSR support.

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client/browser",
  "framework": "angular"
}
```

**Deploy:**
```bash
cd client
vercel --prod
```

**Environment Variables:**
Set in Vercel Dashboard:
- `TMDB_API_KEY` - Your TMDB API key

### Manual Build
```bash
npm run build
npm run serve:ssr:client
```

Server runs on `http://localhost:4000` with SSR enabled.

---

## 🧪 Testing

### Unit Tests (Karma + Jasmine)
```bash
ng test
```

### End-to-End Tests
```bash
# Install Cypress or Playwright first
ng e2e
```

---

## 📚 Further Help

- **Angular CLI:** `ng help` or [Angular CLI Docs](https://angular.io/cli)
- **Angular Docs:** [https://angular.io/docs](https://angular.io/docs)
- **TMDB API:** [https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api)

---

**Built with ❤️ using Angular 17**
