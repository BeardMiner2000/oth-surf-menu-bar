# 🚀 Deploy oth.surf Menu Bar NOW

## Quick 3-Step Deployment

### Step 1: Deploy Backend to Render

**Option A: Using Dashboard (Easiest)**

1. Open: https://dashboard.render.com
2. Sign in (or create account at https://render.com)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo: `jlzoeckler/oth-surf-menu-bar`
5. Click **"Connect"**
6. Review configuration (already set up!)
7. Click **"Create Web Service"**
8. Copy the URL: `https://oth-surf-scraper.onrender.com`

**Option B: Using CLI**

```bash
cd ~/projects/oth-surf-menu-bar/backend
render login
render up
```

### Step 2: Update Frontend

Edit `frontend/src/index.js`:

```javascript
// Line 10 - Replace with your Render URL
const API_URL = 'https://oth-surf-scraper.onrender.com/api';
```

### Step 3: Build & Install

```bash
cd ~/projects/oth-surf-menu-bar/frontend
npm install
npm run build
npm run package
```

Your DMG is ready at:
```
~/projects/oth-surf-menu-bar/frontend/dist/OTH SURF-v1.0.0.dmg
```

---

## ✅ Verify Deployment

### Test Backend

```bash
curl https://oth-surf-scraper.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Test API

```bash
curl https://oth-surf-scraper.onrender.com/api/surf
```

Should return surf data with current, forecast, and tide info.

---

## 📦 Distribution

### Create Release

```bash
cd ~/projects/oth-surf-menu-bar
git tag v1.0.0
git push origin v1.0.0
```

This triggers GitHub Actions to:
1. Build DMG on macOS
2. Upload as GitHub release
3. Create downloadable package

### Download DMG

1. Go to: https://github.com/your-repo/releases
2. Download: `OTH SURF-v1.0.0.dmg`
3. Install and enjoy!

---

## 🎯 That's It!

Your oth.surf menubar app is now live!

Users can:
- Install from GitHub Releases
- Launch from menu bar
- See real-time surf predictions
- Navigate 5-day forecast
- Check tide info

---

## 📞 Need Help?

- **Render Dashboard**: https://dashboard.render.com
- **Documentation**: See `START_HERE.md`
- **Troubleshooting**: See `TESTING.md`

---

**Ready to deploy?** Open https://dashboard.render.com and follow Step 1! 🚀
