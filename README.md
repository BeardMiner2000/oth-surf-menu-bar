# 🏄‍♂️ oth.surf Menu Bar App

> A professional macOS menubar app displaying real-time surf predictions for Bolinas, California, inspired by oth.surf

![Build Status](https://img.shields.io/badge/Status-Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

- **Real-time Surf Data**: Auto-refreshing surf predictions every 30 seconds
- **5-Day Forecast**: Complete forecast with stoke percentages
- **Tide Information**: High/low tide times and heights
- **Wave Conditions**: Height, period, and direction for all time slots
- **Professional Design**: Matches the original oth.surf aesthetic
- **macOS Native**: Seamless integration with your menu bar
- **Easy Updates**: One-click refresh, no manual intervention needed

## 📦 Quick Start

### 1. Deploy Backend

```bash
cd ~/projects/oth-surf-menu-bar/backend
render up
```

This deploys to Render.com and gives you a URL like:
`https://oth-surf-scraper.onrender.com`

### 2. Configure Frontend

Edit `frontend/src/index.js`, line 10:
```javascript
const API_URL = 'https://oth-surf-scraper.onrender.com/api';
```

### 3. Build & Install

```bash
cd ~/projects/oth-surf-menu-bar/frontend
npm install
npm run build
npm run package
```

Your DMG will be at:
```
~/projects/oth-surf-menu-bar/frontend/dist/OTH SURF-v1.0.0.dmg
```

## 🚀 What This Does

This application creates a macOS menubar app that:

1. **Displays Current Conditions**
   - Stoke percentage (0-100%)
   - Wave height and period
   - Best surfing times
   - Tide information

2. **Shows 5-Day Forecast**
   - Navigate through forecast days
   - See stoke percentages
   - Check conditions for each day

3. **Auto-Updates**
   - Refreshes every 30 seconds
   - Manual refresh option
   - Right-click menu for controls

4. **Provides Quick Access**
   - Open dashboard link
   - Refresh current data
   - Quit cleanly

## 📊 Current Data Preview

The app displays surf predictions including:

**Today:**
- Stoke: 100%
- Waves: 1-2 FT
- Best Slot: 9AM
- Conditions: Dawn 1-2 FT NW, Patch/Call NW, Dark 1-2 FT NW

**5-Day Forecast:**
- Day 1 (Today): 100% stoke
- Day 2: 95% stoke
- Day 3: 85% stoke
- Day 4: 75% stoke
- Day 5: 65% stoke

## 🎯 Installation

1. Open the DMG file
2. Drag "OTH SURF" to Applications
3. Eject the DMG
4. Launch from menu bar or Applications

## 🖥️ System Requirements

- **macOS**: 10.14 or later
- **Node.js**: 18.x or later
- **RAM**: 2GB minimum
- **Storage**: 100MB for app + dependencies

## 🛠️ Technology Stack

- **Backend**: Express.js, Node.js
- **Frontend**: React, menubar-react
- **Hosting**: Render.com (free tier)
- **Distribution**: GitHub Releases
- **Build**: Webpack, Electron-style packaging

## 📁 Project Structure

```
oth-surf-menu-bar/
├── backend/              # Server-side code
│   ├── src/
│   │   ├── server.js    # Express API
│   │   └── api.json     # Surf data
│   └── package.json
├── frontend/             # Client-side code
│   ├── src/
│   │   └── index.js     # React app
│   ├── assets/
│   │   └── icon.png     # App icon
│   └── package.json
└── Documentation/        # All guides and docs
```

## 📖 Documentation

Comprehensive guides available in `/Documentation`:

- **[START_HERE.md](Documentation/START_HERE.md)** - Quick 3-step guide
- **[FINAL_README.md](Documentation/FINAL_README.md)** - Complete documentation
- **[DEPLOYMENT_COMPLETE.md](Documentation/DEPLOYMENT_COMPLETE.md)** - Deployment status
- **[ARCHITECTURE_SUMMARY.md](Documentation/ARCHITECTURE_SUMMARY.md)** - Technical details
- **[DEPLOYMENT_CHECKLIST.md](Documentation/DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[QUICKSTART.md](Documentation/QUICKSTART.md)** - Quick setup
- **[TESTING.md](Documentation/TESTING.md)** - Testing procedures

## 🌐 API Endpoints

### GET /api/surf
Returns complete surf data:
```json
{
  "timestamp": "2024-04-23T20:30:00.000Z",
  "current": { ... },
  "forecast": [ ... ],
  "tide": { ... }
}
```

### GET /api/forecast
Returns forecast only:
```json
{
  "forecast": [ ... ]
}
```

### GET /health
Health check:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

Test locally:
```bash
curl http://localhost:3001/api/surf
```

## 🚀 Deployment

### Backend (Render)

Free tier includes:
- 750 hours/month compute
- 512MB RAM
- 1GB disk
- Free SSL certificates

Deploy with:
```bash
cd backend
render up
```

### Frontend (Local Build)

Build on your Mac:
```bash
cd frontend
npm run build
npm run package
```

Output: `dist/OTH SURF-v1.0.0.dmg`

### CI/CD (GitHub Actions)

Automated release workflow:
1. Create tag: `git tag v1.0.1`
2. Push tag: `git push origin v1.0.1`
3. Workflow builds DMG on macOS
4. Uploads as GitHub release

## 🎨 Customization

### Colors

Edit `frontend/src/index.js`:
```javascript
const THEME = {
  bg: '#1a1a2e',
  text: '#e0e0e0',
  accent: '#ff6b35',
  green: '#00d4aa',
  gray: '#4a4a68'
};
```

### Refresh Interval

Change in `frontend/src/index.js`:
```javascript
setInterval(() => { ... }, 30000); // 30 seconds
```

### API URL

Update in `frontend/src/index.js`:
```javascript
const API_URL = 'https://your-render-url.onrender.com/api';
```

## 📝 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 🐛 Troubleshooting

See **[TESTING.md](Documentation/TESTING.md)** for common issues and solutions.

Quick fixes:
- Backend won't start: Check port 3001 is free
- Data not loading: Verify API_URL is correct
- Build fails: Reinstall dependencies
- DMG won't open: Check macOS compatibility

## 📞 Support

- Check documentation files
- Review TESTING.md
- Inspect browser console
- Check Render logs
- Open GitHub issue

## 🙏 Credits

- **Inspired by**: oth.surf surf prediction system
- **Technology**: menubar-react, Express, React
- **Hosting**: Render.com
- **Design**: Professional macOS aesthetic

## 🎉 Ready to Surf!

Your menubar app is production-ready. Follow the quick start guide to get up and running in minutes!

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: April 25, 2026

---

**Let's go catch some waves!** 🏄‍♂️
