# oth.surf Backend Deployment Guide

This guide covers deploying the oth.surf backend to Render.com

## Prerequisites

- Render.com account (free tier available)
- GitHub repository connected to Render
- Node.js 18+ installed

## Option 1: Deploy via Render Dashboard (Recommended)

### Step 1: Connect GitHub

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select the `oth-surf-menu-bar` repository

### Step 2: Configure Service

Use the pre-configured `render.yaml` file:

```yaml
services:
  - type: web
    name: oth-surf-scraper
    env: node
    region: oregon
    branch: main
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: OTH_SURF_URL
        sync: false
        value: https://oth.surf
      - key: PUPPETEER_ARGS
        sync: false
        value: --no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage
```

### Step 3: Create Service

1. Click "Create Web Service"
2. Render will automatically:
   - Install dependencies
   - Build the application
   - Deploy to production

### Step 4: Get Your URL

After deployment, you'll see a URL like:
```
https://oth-surf-scraper.onrender.com
```

Copy this URL for use in the frontend.

## Option 2: Deploy via CLI

### Install Render CLI

```bash
npm install -g @rendercloud/cli
```

### Login to Render

```bash
render login
```

Or use API key:
```bash
render login --api-key <your-api-key>
```

### Deploy

```bash
cd ~/projects/oth-surf-menu-bar/backend
bash ../deploy-render.sh
```

This script will:
1. Check for Render CLI
2. Ensure you're logged in
3. Create the service using render.yaml
4. Deploy the application
5. Display your live URL

## Option 3: Deploy via Render API

### Get API Key

1. Go to https://render.com/dashboard
2. Click your account icon → "Settings"
3. Go to "API Keys"
4. Create a new API key

### Deploy via API

```bash
# Create service
render create web \
  --name oth-surf-scraper \
  --repo-url https://github.com/YOUR_USERNAME/oth-surf-menu-bar.git \
  --env node \
  --branch main \
  --region oregon

# Add environment variables
render env set NODE_ENV=production
render env set PORT=10000
render env set OTH_SURF_URL=https://oth.surf
render env set PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"
```

## Environment Variables

Your service needs these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `10000` | Yes |
| `OTH_SURF_URL` | `https://oth.surf` | Yes |
| `PUPPETEER_ARGS` | `--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage` | No (for local only) |

## After Deployment

### 1. Update Frontend

Edit `frontend/src/index.js`:

```javascript
let API_URL = 'https://oth-surf-scraper.onrender.com/api';
```

### 2. Test the Connection

Open the menubar app and check:
- Data loads from the Render URL
- Last updated timestamp works
- Refresh button works

### 3. Monitor Logs

Check logs in Render dashboard:
- Go to your service
- Click "Logs" tab
- Monitor for errors and data fetching

### 4. Set Up Domain (Optional)

1. Go to Render dashboard
2. Click your service → "Domains"
3. Add your custom domain
4. Update `API_URL` to use your domain

## Troubleshooting

### Deployment Fails

**Error: "Build failed"**
```bash
# Check logs
render logs oth-surf-scraper

# View build output
render logs oth-surf-scraper --tail 100
```

**Solutions:**
- Ensure `package.json` is correct
- Check Node version compatibility
- Verify all dependencies are listed

### Service Won't Start

**Error: "Port 3001 is already in use"**
```bash
# Update PORT in render.yaml
render env set PORT=10001
```

**Error: "Module not found"**
```bash
# Rebuild service
render rollback oth-surf-scraper main
```

### Data Not Loading

**Check API response:**
```bash
curl https://your-service.onrender.com/api/surf
```

**Common issues:**
- CORS errors (should be fixed in server.js)
- API_URL incorrect in frontend
- Network connectivity issues

## Scaling

### Free Tier Limits
- 750 hours/month compute
- 512MB RAM
- 1GB disk

### Upgrade if Needed
1. Go to your service
2. Click "Settings" → "Pricing"
3. Choose "Pro" or "Team" plan
4. Adjust resources as needed

## Cost

**Free Tier:**
- Completely free for personal projects
- Limited to 750 hours/month (can sleep when not in use)
- Perfect for oth.surf (only needs to fetch fresh data every 30s)

**Estimated Cost:**
- If service sleeps 23.5 hours/day: ~$0/month
- If service runs 24/7: ~$5-7/month (Pro plan)

## Security

### Best Practices

1. **Never commit .env files**
   - Already configured in `.gitignore`

2. **Use environment variables for secrets**
   - API keys, tokens, etc.

3. **Enable HTTPS**
   - Render provides free SSL certificates

4. **Monitor for abuse**
   - Set rate limits in Express if needed

5. **Regular updates**
   - Keep dependencies updated
   - Monitor for vulnerabilities

## Monitoring

### Render Dashboard
- View live logs
- Monitor CPU/memory usage
- Check deployment history

### Add Health Checks (Optional)

Edit `src/server.js`:
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Rollback

If deployment has issues:

```bash
# View deployment history
render list

# Rollback to previous version
render rollback oth-surf-scraper <commit-hash>
```

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get your service URL
3. ✅ Update frontend API_URL
4. ✅ Test the menubar app
5. ✅ Create DMG: `npm run package`
6. ✅ Distribute to users

## Support

For issues:
1. Check Render logs
2. Review TESTING.md
3. Inspect frontend browser console
4. Verify environment variables

---

**Ready to deploy?**

```bash
cd ~/projects/oth-surf-menu-bar
bash deploy-render.sh
```
