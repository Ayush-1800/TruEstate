# Deployment Guide — TruEstate

This document explains how to deploy the backend to Render and the frontend to Vercel from this monorepo.

Repository layout (important):
- `backend/` — Node / Express backend
- `frontend/` — Vite/React frontend

This guide provides two options:
- Manual setup using Render & Vercel dashboards
- Automatic deploy via GitHub Actions (workflows included in `.github/workflows/`)

---

## Prerequisites
- A GitHub repository containing this project (push your local repo to GitHub).
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- GitHub account and the ability to add GitHub Secrets in the repo settings

---

## Environment variables you must set

Backend (Render service environment):
- `NODE_ENV=production`
- `CORS_ORIGIN` - comma-separated allowed origins (e.g. `https://your-app.vercel.app`). If unset, CORS will allow all origins (not recommended in production).

Frontend (Vercel environment variables):
- `VITE_BACKEND_URL` - the full backend URL (e.g. `https://your-backend.onrender.com`) OR configure a `vercel.json` rewrite to proxy `/api/*` to the backend.

GitHub Secrets (for automatic workflows):
- `RENDER_API_KEY` — Render API key (for the Render GitHub Action). Create in Render Dashboard -> Account -> API Keys.
- `RENDER_SERVICE_ID` — the Render service ID for your backend service (visible in Render service settings).
- `VERCEL_TOKEN` — Vercel personal token (https://vercel.com/account/tokens).
- `VERCEL_ORG_ID` — Vercel organization ID (from project settings).
- `VERCEL_PROJECT_ID` — Vercel project ID for your frontend (from project settings).

> You do not need to add these secrets if you plan to use manual deploy via the dashboards. The workflows provided will use them if present.

---

## Option A — Manual (recommended first-time, GUI)

### Backend (Render)
1. Create a new Web Service on Render.
2. Set "Root Directory" to `backend` (important for monorepo).
3. Build/Start settings:
   - Start Command: `npm run start`
   - Render will detect Node from `backend/package.json`.
4. Add environment variables under the Render service settings:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-app.vercel.app` (change to your Vercel URL)
5. Health check: set to `/health`.
6. Deploy — Render will build and start your backend. Make sure `/health` responds.

### Frontend (Vercel)
1. Create a new project on Vercel and import your GitHub repo.
2. Set the Root Directory to `frontend`.
3. Vercel will auto-detect Vite.
4. Environment variables (Project Settings -> Environment Variables):
   - `VITE_BACKEND_URL=https://your-backend.onrender.com` (your Render service URL)
5. Deploy. After deploy, visit the Vercel URL and confirm the app loads and calls the backend.

> Alternatively you can use `vercel.json` rewrites to proxy `/api/*` to Render (example in this repo as `vercel.json.example`).

---

## Option B — Automatic via GitHub Actions (provided workflows)

We included two workflows in `.github/workflows/`:
- `deploy-render.yml` — triggers a Render deploy by calling Render's API when you push to `main`.
- `deploy-vercel.yml` — triggers a Vercel CLI deploy for the `frontend` directory when you push to `main`.

### Steps to enable automatic deploys
1. Push your code to GitHub `main`.
2. Add the GitHub Secrets listed above in your repository settings.
3. Enable GitHub Actions for your repository.
4. The workflows will run on pushes to `main` and deploy to Render and Vercel.

---

## Local production-like testing

1. Build frontend with a production backend URL (optional):

```bash
# set backend URL and build
cd frontend
export VITE_BACKEND_URL="http://localhost:4000"
npm ci
npm run build
# serve the build locally
npx serve -s dist -l 3000
# open http://localhost:3000
```

2. Run backend locally:
```bash
cd backend
npm ci
export CORS_ORIGIN="http://localhost:3000"
npm run start
```

---

## Notes & Troubleshooting
- CORS errors: ensure `CORS_ORIGIN` exactly matches the origin of the request (including protocol `https://`). Use comma-separated values for multiple origins.
- If you prefer to proxy `/api/*` via Vercel rewrites (so frontend calls `/api/...`), add `vercel.json` with the rewrite pointing to your backend URL.
- Large dataset: if your dataset is huge and loading at startup is slow, consider moving the dataset to object storage (S3) and loading a sample/summary on boot.

---

If you want I can add the GitHub Action workflows and example `vercel.json` to the repo now (they are included in `.github/workflows/` and `vercel.json.example`). After that, you only need to add GitHub Secrets and push to `main`.

If you want me to proceed and create the workflow files in this repo, reply `Yes` and I'll add them now.