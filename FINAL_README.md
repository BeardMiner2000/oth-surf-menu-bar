# oth.surf Menu Bar App

A macOS menu bar application that displays real-time surf predictions from oth.surf for Bolinas, California.

## 🌊 What This App Does

- **Real-time surf forecasts** for Bolinas (Patch and Channel)
- **5-day glide report** with stoke percentages
- **Tide data** with high/low times
- **Wave conditions** (height, period, swell direction)
- **Auto-refresh** every 30 seconds
- **Professional oth.surf aesthetic** matching the original dashboard

## 📦 Quick Start

```bash
# 1. Clone the repository
git clone <YOUR_GITHUB_URL> ~/projects/oth-surf-menu-bar
cd ~/projects/oth-surf-menu-bar

# 2. Setup backend
cd backend
npm install
npm run dev

# 3. Setup frontend
cd ../frontend
npm install
npm start
```

The app will launch in your menu bar and start fetching surf data automatically.

## 🚀 Deploy to Render (Production)

### Option 1: Automated Deployment

```bash
bash deploy-render.sh
```

This will:
- Check for Render CLI
- Login if needed
- Deploy your backend service
- Display your live URL

### Option 2: Manual Deployment

1. Go to https://render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Use the `render.yaml` configuration
5. Click "Create Web Service"

### Get Your API URL

After deployment, you'll get a URL like:
```
https://oth-surf-scraper.onrender.com
```

### Update Frontend

Edit `frontend/src/index.js`:
```javascript
let API_URL = 'https://oth-surf-scraper.onrender.com/api';
```

## 📱 Menubar Features

### Displayed Information

**Header Banner:**
- "OVER THE HILL // BOLINAS BEARD PATROL"
- Current day longboard report

**Navigation:**
- ◀ PREV / NEXT ▶ buttons to browse forecasts
- "TODAY" is always visible
- Disabled when at current day

**Main Card:**
- Stoke meter (0-100%)
- Last updated timestamp
- Conditions grid (6 items)
- Wave info (3 items):
  - Waves: Height and period
  - Tide range
  - Best slot
- JL thinks section with surf read

**5-Day Forecast:**
- Today + next 4 days
- Stoke percentage for each day
- Key conditions
- Highlighted current day

**Footer:**
- Coordinates: 37.9091° N, 122.6830° W
- Location: Bolinas
- Dashboard link button

### Menu Bar Actions

Right-click the OTH SURF icon:
- **Refresh**: Manually refresh current day data
- **Open Dashboard**: Open https://oth.surf in browser
- **Quit**: Close the application

## 🛠️ Building DMG

```bash
cd frontend
npm run package
```

This creates:
```
dist/OTH SURF-v1.0.0.dmg
```

### Install

1. Open the DMG file
2. Drag "OTH SURF" to Applications
3. Eject the DMG
4. Launch from menu bar or Applications

## 📁 Project Structure

```
oth-surf-menu-bar/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express API server
│   │   └── scraper.ts         # Data scraping logic
│   ├── package.json           # Dependencies
│   ├── render.yaml            # Render deployment config
│   └── Dockerfile             # Container setup
├── frontend/
│   ├── src/
│   │   └── index.js           # React menubar app
│   ├── assets/
│   │   └── icon.png           # App icon (64x64 PNG)
│   ├── build-dmg.sh           # DMG creation script
│   ├── package.json           # Dependencies
│   └── tsconfig.json          # TypeScript config
├── .github/
│   └── workflows/
│       └── release.yml        # CI/CD for DMG releases
├── deploy-render.sh           # Automated Render deployment
└── Documentation/
    ├── README.md              # Main documentation
    ├── QUICKSTART.md          # Quick setup
    ├── DEPLOYMENT.md          # Render deployment guide
    ├── ARCHITECTURE.md        # Technical architecture
    ├── IMPLEMENTATION_NOTES.md
    ├── SUMMARY.md
    └── TESTING.md
```

## 🎨 Customization

### Colors

Edit `frontend/src/index.js`:
```javascript
const THEME = {
  bg: '#1a1a2e',         // Background
  text: '#e0e0e0',       // Text
  accent: '#ff6b35',     // Orange accent
  green: '#00d4aa',      // Success/green
  gray: '#4a4a68',       // Gray panels
  border: '#2d2d44'      // Border color
};
```

### Refresh Interval

Find this line in `frontend/src/index.js`:
```javascript
setInterval(() => {
  fetchSurfData(currentDay);
}, 30000); // Change 30000 to desired ms (e.g., 60000 = 1 minute)
```

### API URL

Update in `frontend/src/index.js`:
```javascript
let API_URL = 'https://your-render-url.onrender.com/api';
```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev
```

Runs on `http://localhost:3001`

### Frontend Development

```bash
cd frontend
npm start
```

Opens menubar app in development mode.

### Testing

See `TESTING.md` for complete testing guide.

## 📊 API Endpoints

### GET /api/surf

Returns full surf data:
```json
{
  "timestamp": "2024-04-23T20:30:00.000Z",
  "current": {
    "day": "TODAY",
    "stoke": 100,
    "date": "APR 23",
    "description": "Longboarders should stop texting...",
    "waveHeight": "1-2 FT",
    "tideRange": "0.5-4.2 FT",
    "bestSlot": "9AM",
    "conditions": ["DAWN 1-2 FT", "PATCH/CALL", ...]
  },
  "forecast": [...],
  "tide": {
    "high": {"time": "3:49 AM", "height": "5.3 FT"},
    "low": {"time": "11:06 AM", "height": "-0.6 FT"},
    ...
  }
}
```

### GET /api/forecast

Returns forecast only:
```json
{
  "forecast": [...]
}
```

### GET /health

Health check:
```json
{
  "status": "ok",
  "timestamp": "2024-04-23T20:30:00.000Z",
  "uptime": 3600
}
```

## 🌐 Deployment

### Render.com (Recommended)

**Free Tier:**
- 750 hours/month compute
- 512MB RAM
- 1GB disk
- Free SSL certificates

**Setup:**
1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repository
4. Use `render.yaml` configuration
5. Deploy!

**Cost:** ~$0/month (sleeps when not needed)

### Environment Variables

Required:
- `NODE_ENV=production`
- `PORT=10000`
- `OTH_SURF_URL=https://oth.surf`

Optional:
- `PUPPETEER_ARGS` (for local development only)

## 🐳 Docker (Optional)

```bash
cd backend
docker build -t oth-surf-scraper .
docker run -p 3001:3001 oth-surf-scraper
```

## 📱 Distribution

### Create DMG

```bash
cd frontend
npm run package
```

Output: `dist/OTH SURF-v1.0.0.dmg`

### GitHub Release (Automated)

The `release.yml` workflow will:
1. Build DMG on macOS
2. Upload as artifact
3. Create GitHub release on tag

**Usage:**
```bash
git tag v1.0.1
git push origin v1.0.1
```

This triggers automated build and release.

## 🔒 Security

- No sensitive data in frontend
- CORS properly configured
- HTTPS only (Render provides free SSL)
- Environment variables for secrets
- Regular dependency updates

## 📈 Monitoring

### Render Dashboard
- View logs: https://render.com/dashboard
- Monitor resources
- Check deployment history

### Add Logging (Optional)

Edit `src/server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -i :3001
kill <PID>
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

### Frontend Issues

**App won't launch:**
- Check menubar is installed: `npm list menubar`
- Reinstall: `npm install menubar axios`

**Data not loading:**
- Check API_URL is correct
- Test with curl: `curl your-api-url/api/surf`
- Check browser console for errors

### Deployment Issues

**Build failed:**
```bash
# Check logs
render logs oth-surf-scraper

# View build output
render logs oth-surf-scraper --tail 100
```

**Service won't start:**
- Check PORT is not conflicting
- Verify environment variables
- Rebuild: `render rollback oth-surf-scraper main`

## 🎯 Future Enhancements

Planned features:
- [ ] Multiple surf locations
- [ ] User preferences/settings
- [ ] Push notifications for good surf
- [ ] Tide chart visualization
- [ ] Weather data integration
- [ ] Historical data tracking
- [ ] Keyboard shortcuts
- [ ] Offline mode

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review TESTING.md
3. Inspect browser console
4. Check Render logs
5. Open an issue on GitHub

## 🙏 Credits

- **Inspired by**: oth.surf surf prediction system
- **Technology**: menubar-react, Express, Puppeteer
- **Hosting**: Render.com
- **Design**: Professional macOS aesthetic

---

**Ready to surf?** 🏄‍♂️

```bash
# Deploy and start using
bash deploy-render.sh
cd frontend && npm install && npm start
```
