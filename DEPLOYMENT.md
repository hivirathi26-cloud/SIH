# JSICP Full-Stack Platform - Cloud Deployment Guide

This guide explains how to deploy the **Jharkhand Societal Innovation Collaboration Portal (JSICP)** to production with your **Neon Cloud PostgreSQL** database.

---

## 🚀 Option 1: 1-Click Deployment on Render.com (Recommended Free Hosting)

Deploy the full-stack portal (React Frontend + Express API + PostgreSQL) as a single Web Service on [Render](https://render.com). The repository includes `render.yaml`, so Render can import these settings automatically.

### Steps:
1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** &rarr; **Web Service**.
3. Select your GitHub repository.
4. Configure the settings:
   - **Name**: `jsicp-portal`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables under **Environment**:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Your Neon pooled connection string, stored as a secret |
   | `GEMINI_API_KEY` | Optional server-side Gemini key |
   | `AI_SERVICE_URL` | Optional URL of a separately deployed AI service |
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public URL (e.g. `https://jsicp-portal.onrender.com`).

---

## ⚡ Option 2: Deploy on Railway.app

1. Go to [Railway.app](https://railway.app/) and create a **New Project** &rarr; **Deploy from GitHub repo**.
2. Under **Variables**, add:
   - `DATABASE_URL` = your Neon pooled connection string (as a secret)
   - `GEMINI_API_KEY` = optional server-side Gemini key
3. Railway will automatically detect the `Dockerfile` or `npm run build` + `npm start`.

---

## 🐳 Option 3: Docker Deployment

You can build and run the production container anywhere (AWS EC2, DigitalOcean, VPS):

```bash
# 1. Build the Docker image
docker build -t jsicp-portal .

# 2. Run container with Neon PostgreSQL
docker run -d -p 4000:4000 \
  -e DATABASE_URL="your-neon-pooled-connection-string" \
  --name jsicp-app jsicp-portal
```

Access at `http://<your-server-ip>:4000`.

---

## 🗄️ Database Initialization & Migration

When the backend starts up on any cloud provider, it **automatically runs DDL migrations and seeds all 12 tables into Neon PostgreSQL** (`schema.sql`).

You can also manually trigger migration anytime via:
```bash
npm run db:migrate
```

## Production checks

After deployment, open `https://<your-service>.onrender.com/api/health`. A successful response has `"status": "ok"` and identifies `PostgreSQL` as the storage engine.

## Secret safety

Never commit `.env` files or database URLs. The previously documented database credential should be rotated in Neon before the service is made public, then set only in the host's encrypted environment-variable settings.
