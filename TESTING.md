# Testing Guide - oth.surf Menu Bar App

## Quick Test Checklist

- [ ] Backend starts without errors
- [ ] API endpoints respond correctly
- [ ] Frontend menubar launches
- [ ] Data displays correctly
- [ ] Day navigation works
- [ ] Auto-refresh functions
- [ ] Menu bar actions work
- [ ] DMG builds successfully

## Testing Steps

### 1. Test Backend (Scraper)

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
oth.surf scraper server running on port 3001
API: http://localhost:3001/api/surf
```

### 2. Test API Endpoints

Open a browser or use curl:

```bash
# Test main endpoint
curl http://localhost:3001/api/surf

# Test forecast only
curl http://localhost:3001/api/forecast

# Test health check
curl http://localhost:3001/health
```

**Expected Response:**
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
  "tide": {...}
}
```

### 3. Test Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

**Expected Behavior:**
1. Menubar app launches
2. 400x600 window appears
3. Oth.surf branding displays
4. Today's data shows
5. Menu bar icon visible

### 4. Test UI Interactions

**In the app window:**
- Click "PREV" → Should navigate to previous day
- Click "NEXT ▶" → Should navigate to next day
- "TODAY" should be disabled (can't go back further)

**Right-click menu bar icon:**
- "Refresh" → Should update current day data
- "Open Dashboard" → Should open https://oth.surf
- "Quit" → Should close the app

### 5. Test Data Updates

**Observe:**
- "Last Updated" timestamp should change every 30 seconds
- Data should refresh automatically
- No console errors

### 6. Test DMG Build

```bash
cd frontend
npm run package
```

**Expected Output:**
```
🔨 Building OTH SURF v1.0.0...
📦 Building TypeScript...
📀 Creating DMG...
✅ DMG created: dist/OTH SURF-v1.0.0.dmg
📁 Size: 15MB
```

**Verify:**
- DMG file exists in `dist/` folder
- File size is reasonable (10-50MB)
- Can open DMG in Finder

### 7. Test DMG Installation

1. Open the DMG file
2. Drag app to Applications
3. Try launching
4. Check menu bar icon

## Common Issues & Solutions

### Issue: Backend won't start
**Symptoms:**
```
Error: Port 3001 is already in use
```

**Solution:**
```bash
# Kill process on port 3001
lsof -i :3001 | grep PID
kill PID

# Or use a different port
PORT=3002 npm start
```

### Issue: Puppeteer fails
**Symptoms:**
```
Failed to launch browser
```

**Solution:**
```bash
# Update Puppeteer
npm install puppeteer@latest

# Clear cache
rm -rf node_modules/.cache
npm install

# Check Chrome version
google-chrome --version
```

### Issue: Frontend won't launch
**Symptoms:**
```
module not found menubar
```

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Check menubar is installed
npm list menubar
```

### Issue: Data not loading
**Symptoms:**
- UI shows "Loading..." forever
- No errors in console

**Solution:**
1. Check backend is running
2. Verify API_URL is correct
3. Test API endpoint with curl
4. Check browser console for errors

### Issue: DMG build fails
**Symptoms:**
```
Error: Cannot find module
```

**Solution:**
```bash
# Ensure all dependencies installed
cd frontend
npm install

# Check build script
cat build-dmg.sh

# Try manual build
bash build-dmg.sh
```

## Browser Console Testing

### Check for errors
Open browser DevTools (Cmd+Option+I) and check Console tab for:
- No red errors
- Successful API calls
- Data updates

### Network tab
Verify:
- GET /api/surf returns 200
- Response body contains data
- No CORS errors

## Production Testing

### 1. Deploy to Render
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Render auto-deploys
```

### 2. Verify Render Service
- Check logs in Render dashboard
- Verify service is "Healthy"
- Get external URL

### 3. Update Frontend
```javascript
// In frontend/src/index.js
let API_URL = 'https://your-app.onrender.com/api';
```

### 4. Test Live App
- Launch app locally
- Verify it connects to Render URL
- Check data loads correctly

## Performance Testing

### Load Testing
```bash
# Test API response time
for i in {1..10}; do
  curl -o /dev/null -w "%{time_total}\n" http://localhost:3001/api/surf
done
```

**Expected:** Response time < 2 seconds

### Memory Usage
```bash
# Monitor Node.js memory
watch -n 1 'ps aux | grep node'
```

**Expected:** Memory stable, no leaks

## Accessibility Testing

### Verify
- App title is correct
- Icons display properly
- Text is readable
- Colors have good contrast
- No flashing animations

## Security Testing

### Check
- No sensitive data in responses
- API_URL not hardcoded
- CORS properly configured
- No SQL injection vulnerabilities

## Documentation Verification

### Ensure
- README.md is complete
- QUICKSTART.md is clear
- All links work
- Code examples are accurate

## Final Checklist

Before releasing:
- [ ] All tests pass
- [ ] No console errors
- [ ] DMG builds successfully
- [ ] Documentation complete
- [ ] Code is committed
- [ ] Version number updated
- [ ] Icon is appropriate

## Support

If issues persist:
1. Check all documentation files
2. Review IMPLEMENTATION_NOTES.md
3. Inspect browser console
4. Check backend logs
5. Verify environment variables

## Version History

### v1.0.0 (Current)
- Initial release
- Basic surf data display
- Day navigation
- Auto-refresh
- DMG packaging

### Planned Features
- Multiple locations
- User preferences
- Offline mode
- Push notifications
