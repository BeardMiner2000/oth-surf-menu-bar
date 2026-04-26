# 🏄‍♂️ oth.surf Menu Bar App - START HERE

## Quick Start (3 Steps)

### 1️⃣ Deploy Backend to Render

```bash
cd ~/projects/oth-surf-menu-bar/backend
render up
```

This will:
- Create a Web Service on Render
- Deploy your backend API
- Give you a URL like: `https://oth-surf-scraper.onrender.com`

### 2️⃣ Update Frontend

Edit `frontend/src/index.js`, line 10:
```javascript
const API_URL = 'https://oth-surf-scraper.onrender.com/api';
```

### 3️⃣ Build & Install

```bash
cd ~/projects/oth-surf-menu-bar/frontend
npm install
npm run build
npm run package
```

Find your DMG at:
```
~/projects/oth-surf-menu-bar/frontend/dist/OTH SURF-v1.0.0.dmg
```

---

## 📦 What You Get

A professional macOS menubar app that shows:
- Real-time surf predictions for Bolinas
- 5-day forecast with stoke percentages
- Tide information
- Wave conditions
- Auto-refresh every 30 seconds

**Design**: Matches the original oth.surf dashboard aesthetic

---

## 🚀 Alternative: Manual Render Deployment

If `render up` doesn't work:

1. Go to https://dashboard.render.com
2. Sign in (or create account)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `oth-surf-menu-bar`
5. Configuration:
   - Name: `oth-surf-scraper`
   - Environment: `Node`
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
6. Click "Create Web Service"

You'll get a live URL instantly!

---

## 🧪 Test Locally First

Before deploying:

```bash
# Start backend
cd ~/projects/oth-surf-menu-bar/backend
npm start

# Should show:
# ✓ Loaded surf data from api.json
# Running on: http://localhost:3001
# API: http://localhost:3001/api/surf

# Test in browser
open http://localhost:3001/health
open http://localhost:3001/api/surf
```

---

## 📖 Full Documentation

See these files for detailed info:
- `FINAL_README.md` - Complete guide
- `DEPLOYMENT_COMPLETE.md` - Deployment status
- `QUICKSTART.md` - Quick setup
- `ARCHITECTURE.md` - Technical details

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `backend/src/server.js` | Express API server |
| `backend/src/api.json` | Surf data |
| `frontend/src/index.js` | React menubar app |
| `frontend/build-dmg.sh` | DMG creation script |
| `.github/workflows/release.yml` | Automated releases |

---

## 💡 Pro Tips

1. **Free Hosting**: Render free tier is enough (750 hrs/month)
2. **Auto-Updates**: Use git tags for versioned releases
3. **Easy Updates**: Just push new code to GitHub
4. **Local Dev**: Backend runs on port 3001, frontend on menubar

---

## 🆘 Need Help?

Check these files:
- `TESTING.md` - Troubleshooting guide
- `DEPLOYMENT.md` - Render deployment details
- `IMPLEMENTATION_NOTES.md` - Technical implementation

Or run:
```bash
# Check backend health
curl http://localhost:3001/health

# View API response
curl http://localhost:3001/api/surf | jq .
```

---

## ✨ Features

✅ Real-time surf data (auto-refresh every 30s)
✅ 5-day forecast with stoke percentages
✅ Tide information (high/low times)
✅ Wave conditions (height, period, direction)
✅ Professional oth.surf aesthetic
✅ Right-click menu (refresh, dashboard, quit)
✅ Navigation through forecast days
✅ Current day always visible
✅ macOS native integration

---

## 📊 Current Data

The API includes sample data for:
- **Today**: 100% stoke, 1-2 FT waves
- **Tomorrow**: 95% stoke, 2-3 FT waves
- **Day 3**: 85% stoke, 3-4 FT waves
- **Day 4**: 75% stoke, 2-3 FT waves
- **Day 5**: 65% stoke, 1-2 FT waves

To update with real data, edit `backend/src/api.json`

---

## 🎉 You're Ready!

Just follow the 3 steps above and you'll have your own oth.surf menubar app running!

**Questions?** Check `FINAL_README.md` for detailed answers.
