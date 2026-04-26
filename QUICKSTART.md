# Quick Start Guide - oth.surf Menu Bar App

## Prerequisites
- macOS
- Node.js 18+ installed
- npm or yarn installed

## Step 1: Clone the Project

```bash
git clone <your-repo-url> ~/projects/oth-surf-menu-bar
cd ~/projects/oth-surf-menu-bar
```

## Step 2: Setup Backend (Scraper)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

You should see:
```
oth.surf scraper server running on port 3001
API: http://localhost:3001/api/surf
```

## Step 3: Setup Frontend (Menu Bar App)

```bash
cd ../frontend
npm install
npm start
```

The app will:
1. Launch a 400x600 window
2. Show in the macOS menu bar
3. Auto-refresh data every 30 seconds
4. Display oth.surf surf data

## Step 4: Build DMG for Distribution

```bash
cd frontend
npm run package
```

The DMG will be created at:
```
frontend/dist/OTH SURF-v1.0.0.dmg
```

## Step 5: Install on Your Mac

1. Open the DMG file
2. Drag "OTH SURF" app to Applications
3. Eject the DMG
4. Open the app from menu bar or Applications folder

## Production Deployment (Render)

### Deploy Backend
1. Go to https://render.com
2. Sign in with GitHub
3. Create new "Web Service"
4. Connect your repository
5. Use `render.yaml` (already configured)
6. Click "Create Web Service"

### Get Your API URL
After deployment, you'll get a URL like:
```
https://oth-surf-scraper.onrender.com
```

### Configure the Menubar App
Edit `frontend/src/index.js` and change:
```javascript
let API_URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3001';
```

To use your Render URL (with /api suffix):
```javascript
let API_URL = 'https://oth-surf-scraper.onrender.com/api';
```

## Menu Bar Controls

**Right-click the OTH SURF icon** to access:
- **Refresh** - Manually refresh surf data
- **Open Dashboard** - Open https://oth.surf in browser
- **Quit** - Close the app

## Keyboard Shortcuts

None yet (can be added with menubar event listeners)

## Troubleshooting

### "Cannot connect to server"
- Ensure backend is running: `cd backend && npm run dev`
- Check port 3001 is not blocked
- Verify `API_URL` is correct

### "module not found"
```bash
rm -rf node_modules
npm install
```

### App won't start
- Check menubar is installed: `npm list menubar`
- Reinstall: `npm install menubar axios`

## Next Steps

1. Customize colors in `frontend/src/index.js`
2. Add your own icon to `frontend/assets/icon.png`
3. Build and distribute the DMG
4. Deploy to Render for production

## Support

For issues or questions:
- Check `IMPLEMENTATION_NOTES.md`
- Review the source code in `frontend/src/`
- See `backend/src/` for scraper logic
