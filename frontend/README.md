# oth.surf Menu Bar App

macOS menu bar application displaying the oth.surf surf prediction system.

## Features
- 5-day surf forecast for Bolinas
- Daily stoke meter (0-100%)
- Tide data with visual conditions
- Auto-refresh every 30 seconds
- Day navigation (prev/next)
- Professional oth.surf aesthetic

## Prerequisites
- Node.js 18+
- macOS (for DMG packaging)
- menubar package installed

## Setup

### Development
```bash
npm install
npm start
```

This will start the menubar app in development mode.

### Build
```bash
npm run build
```

This compiles TypeScript and copies necessary files.

### Create DMG
```bash
npm run package
```

This creates a `.dmg` file in the `dist/` directory.

## Deployment

### Local Development
1. Start the backend scraper: `cd ../backend && npm start`
2. Start the menubar app: `npm start`
3. The app will connect to `http://localhost:3001`

### Production (Render)
1. Deploy the backend to Render using `render.yaml`
2. Get your Render external URL
3. Set `RENDER_EXTERNAL_URL` environment variable
4. The menubar app will use this URL to fetch data

## Menubar Commands
- **Right-click icon**: Access menu options
  - Refresh: Manually refresh data
  - Open Dashboard: Open oth.surf website
  - Quit: Close the app

## Troubleshooting

### "Cannot connect to server"
- Ensure backend is running on port 3001
- Check `API_URL` environment variable
- Verify Render service is accessible

### Build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

## License
MIT
