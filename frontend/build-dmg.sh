#!/bin/bash

# Build oth.surf DMG for macOS
# This script creates a proper DMG file with the app

set -e

APP_NAME="OTH SURF"
APP_VERSION="1.0.0"
OUTPUT_DIR="dist"
DMG_NAME="${APP_NAME}-v${APP_VERSION}.dmg"

echo "🔨 Building $APP_NAME v$APP_VERSION..."

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Build the TypeScript
echo "📦 Building TypeScript..."
npm run build

# Create app directory
APP_DIR="$OUTPUT_DIR/$APP_NAME.app"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Copy built files
cp -r dist/* "$APP_DIR/Contents/Resources/"
cp package.json "$APP_DIR/Contents/Resources/"
cp package-lock.json "$APP_DIR/Contents/Resources/" 2>/dev/null || true

# Create app bundle structure
cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>OTH SURF</string>
    <key>CFBundleIdentifier</key>
    <string>com.othsurf.app</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>OTH SURF</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${APP_VERSION}</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.14</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSMainNibFile</key>
    <string></string>
</dict>
</plist>
EOF

# Create the menubar JavaScript
cat > "$APP_DIR/Contents/MacOS/OTH SURF" << 'JSEOF'
#!/bin/bash
cd "$(dirname "$0")/Resources"
node menubar.js
JSEOF

chmod +x "$APP_DIR/Contents/MacOS/OTH\ SURF"

# Create the menubar.js file
cat > "$APP_DIR/Contents/Resources/menubar.js" << 'EOF'
const menubar = require('menubar');
const axios = require('axios');

const THEME = {
  bg: '#1a1a2e',
  text: '#e0e0e0',
  accent: '#ff6b35',
  green: '#00d4aa',
  gray: '#4a4a68',
  border: '#2d2d44'
};

const mb = menubar({
  icon: './icon.png',
  browserWidth: 400,
  browserHeight: 600
});

let currentDay = 'TODAY';
let API_URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3001';

async function fetchSurfData(day) {
  try {
    const response = await axios.get(`${API_URL}/api/surf`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

const days = ['TODAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY'];

function navigateDay(direction) {
  const currentIndex = days.indexOf(currentDay);
  let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
  
  if (newIndex < 0) newIndex = days.length - 1;
  if (newIndex >= days.length) newIndex = 0;
  
  currentDay = days[newIndex];
  fetchSurfData(currentDay);
}

function updateUI(data) {
  const currentDate = new Date();
  lastUpdated = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const currentForecast = data.forecast.find(f => f.day === currentDay) || data.forecast[0];
  
  window.OTH_SURF_DATA = {
    currentDay,
    currentData: {
      day: currentDay,
      stoke: currentForecast.stoke || 100,
      date: currentForecast.date || '',
      description: currentForecast.description || '',
      waveHeight: currentForecast.waveHeight || '',
      tideRange: currentForecast.tideRange || '',
      bestSlot: currentForecast.bestSlot || '',
      conditions: currentForecast.conditions || []
    },
    forecast: data.forecast,
    tide: data.tide,
    lastUpdated
  };
}

mb.on('ready-to-show', () => {
  document.body.innerHTML = '<div id="root"></div>';
  
  const React = require('react');
  const ReactDOM = require('react-dom');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(React.createElement(App));
  
  fetchSurfData('TODAY');
  
  setInterval(() => {
    fetchSurfData(currentDay);
  }, 30000);
});

const App = () => {
  const [currentData] = React.useState(window.OTH_SURF_DATA?.currentData);
  const [lastUpdated] = React.useState(window.OTH_SURF_DATA?.lastUpdated);
  
  return React.createElement('div', {
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: THEME.bg,
      minHeight: '100vh',
      padding: '20px'
    }
  }, 
    React.createElement('div', {
      style: {
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }
    }, 
      React.createElement('h1', { style: { margin: 0, fontSize: '14px', textTransform: 'uppercase' } }, 'OVER THE HILL // BOLINAS'),
      React.createElement('h2', { style: { margin: '5px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.9)' } }, `${currentDay} LONGBOARD REPORT`)
    ),
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }
    },
      React.createElement('button', {
        onClick: () => navigateDay('prev'),
        disabled: currentDay === 'TODAY',
        style: {
          background: currentDay !== 'TODAY' ? THEME.accent : '#333',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px'
        }
      }, '◀ PREV'),
      React.createElement('span', { style: { fontSize: '18px', fontWeight: 'bold', minWidth: '100px' } }, currentDay),
      React.createElement('button', {
        onClick: () => navigateDay('next'),
        disabled: currentDay === 'TODAY',
        style: {
          background: currentDay !== 'TODAY' ? THEME.accent : '#333',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px'
        }
      }, 'NEXT ▶')
    ),
    React.createElement('div', {
      style: {
        backgroundColor: THEME.gray,
        borderRadius: '8px',
        padding: '20px'
      }
    },
      React.createElement('div', {
        style: {
          background: '#2a2a40',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, 'STOKE:'),
        React.createElement('span', {
          style: { fontSize: '32px', fontWeight: 'bold', color: THEME.green, marginLeft: '10px' }
        }, `${currentData.stoke}%`)
      ),
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '15px'
        }
      },
        [
          { label: 'WAVES', value: currentData.waveHeight },
          { label: 'TIDE', value: currentData.tideRange },
          { label: 'SLOT', value: currentData.bestSlot }
        ].map((item, idx) =>
          React.createElement('div', {
            key: idx,
            style: {
              background: '#3a3a50',
              padding: '10px',
              borderRadius: '4px',
              textAlign: 'center'
            }
          },
            React.createElement('div', { style: { fontSize: '10px', color: '#888' } }, item.label),
            React.createElement('div', { style: { fontSize: '13px', fontWeight: 'bold', color: THEME.green } }, item.value)
          )
        )
      ),
      React.createElement('div', {
        style: {
          background: '#2a2a40',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px'
        }
      },
        React.createElement('strong', null, 'JL THINKS:'),
        React.createElement('p', {
          style: { margin: '5px 0 0', fontStyle: 'italic' }
        }, currentData.description)
      )
    )
  );
};

mb.trayMenu = [
  { label: 'Refresh', click: () => fetchSurfData(currentDay) },
  { label: 'Open Dashboard', click: () => window.open('https://oth.surf', '_blank') },
  { label: 'Quit', click: () => mb.app.quit() }
];

mb.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mb.app.quit();
  }
});
EOF

# Create icon (simple placeholder - in production you'd use a real icon)
echo "Creating placeholder icon..."
# You should replace this with a real icon
cp -r ../assets/icon.png "$APP_DIR/Contents/Resources/" 2>/dev/null || \
  echo "Warning: No icon found, using default"

# Create DMG
echo "📀 Creating DMG..."
hdiutil create -volname "$APP_NAME" -srcpath "$APP_DIR" -ov -format UDZO "$OUTPUT_DIR/$DMG_NAME"

# Open the DMG for inspection
open "$OUTPUT_DIR/$DMG_NAME"

echo "✅ DMG created: $OUTPUT_DIR/$DMG_NAME"
echo "📁 Size: $(du -h "$OUTPUT_DIR/$DMG_NAME" | cut -f1)"

# Cleanup
# rm -rf "$APP_DIR"
