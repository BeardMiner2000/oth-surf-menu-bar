# oth.surf Menu Bar App - Implementation Notes

## Overview
This project creates a macOS menu bar application that mirrors the oth.surf surf prediction dashboard, displaying real-time surf data for Bolinas.

## Architecture

### Frontend (Menu Bar UI)
- **Technology**: menubar-react (React Native for macOS menu bar)
- **Styling**: Custom CSS matching oth.surf aesthetic
- **Features**:
  - 5-day forecast display
  - Day navigation (prev/next)
  - Auto-refresh every 30 seconds
  - Stoke meter visualization
  - Tide and wave conditions
  - JL's surf read/thoughts

### Backend (Data Scraper)
- **Technology**: Node.js + Express
- **Data Source**: Scrapes oth.surf website
- **Implementation**: 
  - Puppeteer for full HTML rendering (local)
  - Simple parsing for serverless (Render)
- **API Endpoints**:
  - `GET /api/surf` - Full surf data
  - `GET /api/forecast` - Forecast only
  - `GET /health` - Health check

### Deployment
- **Backend**: Render.com (serverless Node.js)
- **Frontend**: Local development, packaged as DMG
- **CI/CD**: GitHub Actions for automated releases

## File Structure

```
oth-surf-menu-bar/
├── backend/
│   ├── src/
│   │   ├── server.js      # Express server
│   │   └── scraper.ts      # Data scraping logic
│   ├── package.json
│   ├── render.yaml         # Render deployment config
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── index.js        # Menubar React app
│   ├── assets/
│   │   └── icon.png        # App icon
│   ├── build-dmg.sh        # DMG creation script
│   ├── package.json
│   └── README.md
├── .github/
│   └── workflows/
│       └── release.yml     # CI/CD workflow
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

The scraper will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The menubar app will start and show in the menu bar.

### 3. Building DMG

```bash
cd frontend
npm run package
```

This creates `dist/OTH SURF-v1.0.0.dmg`

## Customization

### Colors
Edit `THEME` object in `frontend/src/index.js`:
```javascript
const THEME = {
  bg: '#1a1a2e',    // Background
  text: '#e0e0e0',  // Text
  accent: '#ff6b35', // Orange accent
  green: '#00d4aa',  // Success/green
  gray: '#4a4a68',   // Gray panels
  border: '#2d2d44'  // Border color
};
```

### Data Refresh Interval
```javascript
setInterval(() => {
  fetchSurfData(currentDay);
}, 30000); // 30 seconds
```

## Render Deployment

### Step 1: Create Service
1. Go to https://render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Use `render.yaml` for configuration
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `OTH_SURF_URL=https://oth.surf`

### Step 2: Get External URL
After deployment, Render provides a public URL like:
```
https://oth-surf-scraper.onrender.com
```

### Step 3: Configure Menubar
Set `RENDER_EXTERNAL_URL` environment variable in the menubar app:
```
https://oth-surf-scraper.onrender.com/api
```

## Troubleshooting

### Puppeteer Issues (Local)
If Puppeteer fails to launch:
1. Check Chrome is installed
2. Verify `PUPPETEER_ARGS` in `.env`
3. Try running with `DEBUG=puppeteer*` for more info

### Scraping Issues
If data isn't loading:
1. Check browser console for errors
2. Verify oth.surf is accessible
3. Try manual scraping in browser DevTools

### Render Issues
- Check service logs in Render dashboard
- Verify API_URL is correct in menubar
- Ensure CORS is enabled on backend

## Future Improvements

1. **Real Puppeteer Integration**: Replace simple parsing with full Puppeteer scraping on Render
2. **Caching**: Add Redis caching for frequent data
3. **Custom Locations**: Allow selecting different surf spots
4. **Notifications**: Push notifications for good surf
5. **Tide Charts**: Visual tide curve graphics
6. **Weather Integration**: Add wind and temperature data

## License
MIT - Free to use and modify
