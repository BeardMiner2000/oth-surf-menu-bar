# oth.surf Menu Bar App - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      macOS Menu Bar                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │  3:49 AM    │  │  100%       │  │  1-2 FT         │  │   │
│  │  │  11:06 AM   │  │  (Stoke)    │  │  (Waves)        │  │   │
│  │  │  6:45 PM    │  │             │  │                  │  │   │
│  │  │  11:35 PM   │  │  Last Updated│  │  9AM            │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           │ Right-click menu                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Refresh] [Open Dashboard] [Quit]                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (port 3001)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Express Server                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GET /api/surf               ──► Returns full data      │   │
│  │  GET /api/forecast           ──► Returns forecast only  │   │
│  │  GET /health                 ──► Health check           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Scrapes oth.surf
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Scraper (Puppeteer)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. Navigate to https://oth.surf                        │   │
│  │  2. Wait for page to load                               │   │
│  │  3. Extract HTML content                                │   │
│  │  4. Parse data elements:                                │   │
│  │     - Current day stoke                                 │   │
│  │     - Wave height & period                              │   │
│  │     - Tide range                                        │   │
│  │     - Best slot                                         │   │
│  │     - JL's read/thoughts                                │   │
│  │     - 5-day forecast                                    │   │
│  │     - Tide high/low times                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ oth.surf website
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   oth.surf.com                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TODAY 100% APR 23 Longboarders should stop             │   │
│  │  FRIDAY 100% APR 24 Longboarders should stop            │   │
│  │  SATURDAY 66% APR 25 Looks surfable                     │   │
│  │  SUNDAY 78% APR 26 Looks surfable                       │   │
│  │  MONDAY 100% APR 27 Longboarders should stop            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│   User       │
│  (Menu Bar)  │
└──────┬───────┘
       │ Click "Next Day"
       ▼
┌──────────────┐
│  React App   │
│  (Frontend)  │
└──────┬───────┘
       │ Fetch('/api/surf')
       ▼
┌──────────────┐
│   Express    │
│  (Backend)   │
└──────┬───────┘
       │ scrapeSurfData()
       ▼
┌──────────────┐
│  Puppeteer   │
│  (Scraper)   │
└──────┬───────┘
       │ Page.goto('oth.surf')
       ▼
┌──────────────┐
│ oth.surf.com │
│  (Website)   │
└──────┬───────┘
       │ HTML Content
       ▼
┌──────────────┐
│  Parser      │
│  (Data)      │
└──────┬───────┘
       │ JSON Response
       ▼
┌──────────────┐
│   Express    │
│  (Backend)   │
└──────┬───────┘
       │ JSON Response
       ▼
┌──────────────┐
│  React App   │
│  (Frontend)  │
└──────┬───────┘
       │ Update UI
       ▼
┌──────────────┐
│   User       │
│  (Menu Bar)  │
└──────────────┘
```

## Component Breakdown

### Frontend (frontend/src/)
```
index.js (main entry)
├── Theme object (colors)
├── State management
│   ├── currentDay (string)
│   ├── surfData (object)
│   └── lastUpdated (string)
├── API functions
│   └── fetchSurfData(day)
├── Navigation
│   ├── navigateDay(direction)
│   └── days array
└── React Component (App)
    ├── Banner
    ├── Navigation Controls
    ├── Current Day Card
    │   ├── Stoke Meter
    │   ├── Conditions Grid
    │   ├── Wave Info Grid
    │   └── JL thinks section
    ├── 5-Day Forecast
    └── Footer
```

### Backend (backend/src/)
```
server.js
├── Express setup
├── CORS middleware
├── Routes
│   ├── GET /api/surf
│   ├── GET /api/forecast
│   └── GET /health
└── Server startup
```

scraper.ts
├── scrapeSurfData()
│   ├── Puppeteer setup
│   ├── Page navigation
│   └── Data extraction
└── simpleParseOthSurfHTML()
    └── Fallback parser
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    GitHub Repository                          │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Push to main branch                                 │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Build DMG on macOS                                 │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Upload artifact                                     │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Create GitHub release                               │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Render.com                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Web Service: oth-surf-scraper                       │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Node.js 18 runtime                                  │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Auto-deploy on push to main                         │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Public URL: https://oth-surf-scraper.onrender.com   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    End User                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  DMG Installer                                        │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  OTH SURF App                                         │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Menu Bar Icon                                        │   │
│  │  ────────────────────────────────────────────────►   │   │
│  │  Fetches data from Render                            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## File Organization

```
oth-surf-menu-bar/
│
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── server.js          # Express API endpoints
│   │   └── scraper.ts         # Data scraping logic
│   ├── package.json           # Dependencies
│   ├── render.yaml            # Render deployment config
│   ├── Dockerfile             # Container setup
│   ├── .env                   # Environment variables
│   └── .env.example           # Environment template
│
├── frontend/                   # React menubar app
│   ├── src/
│   │   └── index.js           # Main menubar application
│   ├── assets/
│   │   └── icon.png           # App icon (64x64 PNG)
│   ├── build-dmg.sh           # DMG creation script
│   ├── package.json           # Dependencies
│   └── tsconfig.json          # TypeScript config
│
├── .github/
│   └── workflows/
│       └── release.yml        # GitHub Actions workflow
│
├── .gitignore                 # Git ignore rules
├── README.md                   # Main documentation
├── QUICKSTART.md              # Quick setup guide
├── IMPLEMENTATION_NOTES.md    # Technical details
├── ARCHITECTURE.md            # This file
└── SUMMARY.md                 # Project summary
```

## Color Scheme (oth.surf branding)

```javascript
const THEME = {
  bg: '#1a1a2e',         // Deep blue background
  text: '#e0e0e0',       // Light text
  accent: '#ff6b35',     // Orange accent (oth.surf orange)
  green: '#00d4aa',      // Teal/green for metrics
  gray: '#4a4a68',       // Gray panels
  border: '#2d2d44'      // Border color
};
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend UI | React | Component-based UI |
| Menubar | menubar (v9) | macOS menu bar integration |
| Styling | Custom CSS | oth.surf aesthetic |
| Backend | Node.js | Runtime environment |
| API | Express | REST API server |
| Scraper | Puppeteer | Browser automation |
| Hosting | Render.com | Serverless deployment |
| Build | TypeScript | Type safety |
| Packaging | bash script | DMG creation |
| CI/CD | GitHub Actions | Automated releases |

## Key Design Decisions

1. **React over pure JS**: Easier to maintain and extend
2. **menubar package**: Official macOS solution
3. **Separate backend/frontend**: Clear separation of concerns
4. **Serverless backend**: Easy deployment and scaling
5. **TypeScript**: Type safety and better IDE support
6. **DMG packaging**: Native macOS distribution format
7. **Auto-refresh**: Keeps data current without user action
8. **CORS enabled**: Allows cross-origin requests

## Performance Considerations

- **30-second refresh**: Balances freshness with performance
- **Lightweight UI**: 400x600 window, minimal DOM
- **Serverless backend**: Scales automatically
- **No client-side data fetching**: All data from server

## Security Considerations

- **CORS configured**: Only allow specific origins
- **Environment variables**: Sensitive data in env files
- **No node integration**: Safe React in browser context
- **Input validation**: Server-side data sanitization

## Future Enhancements

1. **Real-time notifications**: Push notifications for good surf
2. **Multiple locations**: Support different surf spots
3. **Custom alerts**: User-defined conditions
4. **Tide charts**: Visual tide curve graphics
5. **Weather data**: Wind, temperature, UV index
6. **History tracking**: Past surf conditions
7. **Settings panel**: User preferences
8. **Keyboard shortcuts**: Faster navigation
