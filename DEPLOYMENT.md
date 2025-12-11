# CI/CD Setup Guide for Vercel Deployment

This guide will help you set up continuous deployment to Vercel using GitHub Actions.

## Overview

Your project has two parts that deploy separately:
- **Backend** (Express API) → Vercel Serverless Functions
- **Client** (Frontend) → Vercel Static Site

## Step 1: Get Vercel Credentials

### 1.1 Get Vercel Access Token
1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it: `GitHub Actions CI/CD`
4. Set scope: **Full Account**
5. Click **Create** and copy the token (you won't see it again!)
6. Save it as: `VERCEL_TOKEN`

### 1.2 Get Organization ID
1. Go to [Vercel Settings](https://vercel.com/account)
2. Scroll to **"Your ID"** section
3. Copy the ID shown there
4. Save it as: `VERCEL_ORG_ID`

### 1.3 Get Backend Project ID
1. Go to your existing backend project on Vercel
2. Click **Settings** → **General**
3. Scroll to **"Project ID"**
4. Copy the ID
5. Save it as: `VERCEL_PROJECT_ID_BACKEND`

### 1.4 Get Client Project ID
1. If you already have a client project on Vercel, go to it
2. Click **Settings** → **General**
3. Copy the **Project ID**
4. Save it as: `VERCEL_PROJECT_ID_CLIENT`

**If you DON'T have a client project yet:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **Import Git Repository**
4. Choose your GitHub repo: `Movie_Review_Project`
5. Set **Root Directory** to: `client`
6. Framework Preset: `Vite`
7. Build Command: `npm run build`
8. Output Directory: `dist`
9. Click **Deploy**
10. After deployment, go to Settings and copy the Project ID

## Step 2: Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/Abhirammm2208/Movie_Review_Project`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each of these:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VERCEL_TOKEN` | (from step 1.1) | Authentication token |
| `VERCEL_ORG_ID` | (from step 1.2) | Your Vercel organization ID |
| `VERCEL_PROJECT_ID_BACKEND` | (from step 1.3) | Backend project ID |
| `VERCEL_PROJECT_ID_CLIENT` | (from step 1.4) | Client project ID |

## Step 3: Configure Vercel Projects

### Backend Configuration (if needed)
1. Go to your backend project on Vercel
2. **Settings** → **Environment Variables**
3. Add these variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `NODE_ENV` - Set to `production`

### Client Configuration
1. Go to your client project on Vercel
2. **Settings** → **Environment Variables**
3. Add these variables:
   - `TMDB_API_KEY` - Your TMDB API key (get free at https://www.themoviedb.org/settings/api)

## Step 4: Update Client API Configuration

The client needs to know your backend URL. Update the `vercel.json` in the client folder:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-BACKEND-URL.vercel.app/api/$1"
    }
  ]
}
```

Replace `YOUR-BACKEND-URL` with your actual backend Vercel URL.

## Step 5: How It Works

### Automatic Deployment
Every time you push to the `main` branch:
1. GitHub Actions workflow triggers
2. Backend deploys first to Vercel
3. Client deploys next (after backend is ready)
4. Both go live automatically

### Preview Deployments
When you create a Pull Request:
- Both backend and client get preview URLs
- Test changes before merging to main

## Step 6: Testing the Setup

1. Commit and push the GitHub Actions workflow:
   ```bash
   git add .github/workflows/deploy.yml
   git add client/vercel.json
   git commit -m "Add CI/CD workflow for Vercel deployment"
   git push origin main
   ```

2. Go to your GitHub repo → **Actions** tab
3. Watch the workflow run
4. If it fails, check the logs to see which secret is missing

## Step 7: Verify Deployment

After successful deployment:
1. Backend should be live at: `https://your-backend.vercel.app`
2. Client should be live at: `https://your-client.vercel.app`
3. Test the login and review features

## Troubleshooting

### Error: "Missing Vercel credentials"
- Make sure all 4 secrets are added to GitHub

### Error: "Project not found"
- Check that Project IDs are correct
- Make sure the Vercel CLI can access your projects

### Backend 404 errors
- Verify `vercel.json` routes in backend
- Check that `server.js` exports correctly

### CORS errors
- Add your client domain to backend CORS config
- Update `backend/server.js` corsOptions

### Client can't reach backend
- Update `client/vercel.json` with correct backend URL
- Check that API routes are proxied correctly

## Monitoring

- **GitHub Actions**: Monitor builds at `https://github.com/Abhirammm2208/Movie_Review_Project/actions`
- **Vercel Dashboard**: Check deployments at `https://vercel.com/dashboard`
- **Logs**: View runtime logs in Vercel project → Functions tab

## Custom Domains (Optional)

To use custom domains:
1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain
3. Configure DNS as instructed
4. Update CORS settings to include your custom domain

---

## Quick Reference

### Deploy manually (if needed)
```bash
# Deploy backend
cd backend
vercel --prod

# Deploy client
cd ../client
vercel --prod
```

### Check deployment status
```bash
vercel ls
```

### View logs
```bash
vercel logs [deployment-url]
```
