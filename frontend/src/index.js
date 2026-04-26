const menubar = require('menubar');
const axios = require('axios');

// oth.surf color scheme
const THEME = {
  bg: '#1a1a2e',
  text: '#e0e0e0',
  accent: '#ff6b35',
  green: '#00d4aa',
  gray: '#4a4a68',
  border: '#2d2d44'
};

// Main menubar application
const mb = menubar({
  icon: './assets/icon.png',
  browserWidth: 400,
  browserHeight: 600,
  browser: {
    type: 'chromium',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  }
});

// Main application state
let currentDay = 'TODAY';
let surfData = null;
let lastUpdated = '';

// API URL (will be set to localhost in dev, Render URL in prod)
let API_URL = 'http://localhost:3001';

// Update API URL from environment
if (process.env.RENDER_EXTERNAL_URL) {
  API_URL = process.env.RENDER_EXTERNAL_URL.replace('/dashboard', '/api');
}

// Fetch surf data from API
async function fetchSurfData(day) {
  try {
    const response = await axios.get(`${API_URL}/api/surf`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

// Navigation days
const days = ['TODAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY'];

// Update the UI with new data
function updateUI(data) {
  const currentDate = new Date();
  lastUpdated = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Update current day data
  const currentForecast = data.forecast.find(f => f.day === currentDay) || data.forecast[0];
  
  // Store data for React component
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

  // Re-render React component
  if (window.ReactRoot) {
    window.root.render(
      React.createElement(App, { 
        data: window.OTH_SURF_DATA,
        navigateDay,
        fetchSurfData
      })
    );
  }
}

// Navigate to previous/next day
function navigateDay(direction) {
  const currentIndex = days.indexOf(currentDay);
  let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
  
  if (newIndex < 0) newIndex = days.length - 1;
  if (newIndex >= days.length) newIndex = 0;
  
  currentDay = days[newIndex];
  fetchSurfData(currentDay);
}

// Main React component
const React = window.React;
const ReactDOM = window.ReactDOM;

const App = ({ data, navigateDay, fetchSurfData }) => {
  const [loading, setLoading] = React.useState(true);
  const [currentData, setCurrentData] = React.useState(data?.currentData);

  React.useEffect(() => {
    if (data) {
      setLoading(false);
      setCurrentData(data.currentData);
    }
  }, [data]);

  const handleRefresh = async () => {
    setLoading(true);
    const newData = await fetchSurfData(currentDay);
    if (newData) {
      const currentForecast = newData.forecast.find(f => f.day === currentDay) || newData.forecast[0];
      updateUI(newData);
      setCurrentData({
        day: currentDay,
        stoke: currentForecast.stoke || 100,
        date: currentForecast.date || '',
        description: currentForecast.description || '',
        waveHeight: currentForecast.waveHeight || '',
        tideRange: currentForecast.tideRange || '',
        bestSlot: currentForecast.bestSlot || '',
        conditions: currentForecast.conditions || []
      });
    }
  };

  const handleOpenDashboard = () => {
    window.open('https://oth.surf', '_blank');
  };

  return React.createElement('div', {
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: THEME.bg,
      color: THEME.text,
      minHeight: '100vh',
      padding: '20px'
    }
  }, 
    // Header Banner
    React.createElement('div', {
      style: {
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }
    }, 
      React.createElement('h1', {
        style: { margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }
      }, 'OVER THE HILL // BOLINAS BEARD PATROL'),
      React.createElement('h2', {
        style: { margin: '5px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.9)' }
      }, `${currentDay} LONGBOARD REPORT`)
    ),

    // Navigation
    React.createElement('div', {
      style: { marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }
    },
      React.createElement('button', {
        onClick: () => navigateDay('prev'),
        disabled: currentDay === 'TODAY',
        style: {
          background: currentDay !== 'TODAY' ? THEME.accent : '#333',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: currentDay === 'TODAY' ? 'not-allowed' : 'pointer'
        }
      }, '◀ PREV'),
      React.createElement('span', {
        style: { fontSize: '18px', fontWeight: 'bold', minWidth: '100px', textAlign: 'center' }
      }, currentDay),
      React.createElement('button', {
        onClick: () => navigateDay('next'),
        disabled: currentDay === 'TODAY',
        style: {
          background: currentDay !== 'TODAY' ? THEME.accent : '#333',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: currentDay === 'TODAY' ? 'not-allowed' : 'pointer'
        }
      }, 'NEXT ▶')
    ),

    // Main Content
    React.createElement('div', {
      style: {
        backgroundColor: THEME.gray,
        borderRadius: '8px',
        padding: '20px',
        border: `1px solid ${THEME.border}`
      }
    },
      // Current Day Card
      React.createElement('div', {
        style: {
          background: '#2a2a40',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '10px'
        }
      },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
          React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, 'STOKE METER:'),
          React.createElement('div', {
            style: {
              fontSize: '32px',
              fontWeight: 'bold',
              color: THEME.green,
              marginLeft: '10px'
            }
          }, `${currentData.stoke}%`),
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              fontSize: '10px',
              color: '#888'
            }
          }, 'LAST UPDATE:',
            React.createElement('span', { style: { marginLeft: '5px', fontWeight: 'bold' } }, lastUpdated)
          )
        )
      ),

      // Conditions Grid
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '15px'
        }
      },
        currentData.conditions.slice(0, 6).map((condition, idx) =>
          React.createElement('div', {
            key: idx,
            style: {
              background: '#3a3a50',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '11px',
              textAlign: 'center'
            }
          }, condition)
        )
      ),

      // Wave Info Grid
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
          { label: 'TIDE RANGE', value: currentData.tideRange },
          { label: 'BEST SLOT', value: currentData.bestSlot }
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
            React.createElement('div', {
              style: { fontSize: '13px', fontWeight: 'bold', color: THEME.green }
            }, item.value)
          )
        )
      ),

      // JL thinks section
      React.createElement('div', {
        style: {
          background: '#2a2a40',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.6'
        }
      },
        React.createElement('strong', null, 'JL THINKS...'),
        React.createElement('p', {
          style: { margin: '8px 0 0', fontStyle: 'italic' }
        }, currentData.description)
      ),

      // 5-Day Forecast
      React.createElement('div', {
        style: { marginTop: '20px' }
      },
        React.createElement('h3', {
          style: { fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }
        }, '5-DAY GLIDE REPORT // BOLINAS'),
        data?.forecast?.slice(0, 5).map((day, idx) =>
          React.createElement('div', {
            key: idx,
            style: {
              background: currentDay === day.day ? THEME.accent : '#3a3a50',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '8px',
              opacity: currentDay === day.day ? 1 : 0.7
            }
          },
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            },
              React.createElement('span', {
                style: { fontWeight: 'bold', color: currentDay === day.day ? 'white' : 'inherit' }
              }, day.day),
              React.createElement('span', {
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: currentDay === day.day ? THEME.green : 'inherit'
                }
              }, `${day.stoke}%`)
            ),
            React.createElement('div', {
              style: {
                fontSize: '10px',
                marginTop: '5px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }
            },
              day.conditions.slice(0, 4).map((c, i) =>
                React.createElement('span', { key: i, style: { color: '#ccc' } }, c)
              )
            )
          )
        )
      ),

      // Footer
      React.createElement('div', {
        style: {
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#666'
        }
      },
        React.createElement('span', null, 'LAT: 37.9091° N | LON: 122.6830° W | BOLINAS'),
        React.createElement('button', {
          onClick: handleOpenDashboard,
          style: {
            background: 'transparent',
            border: '1px solid #4a4a68',
            color: '#888',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer'
          }
        }, 'DASHBOARD')
      )
    )
  );
};

// Browser window setup
mb.on('ready-to-show', () => {
  document.body.innerHTML = '<div id="root"></div>';
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.root = ReactDOM.createRoot(document.getElementById('root'));
  
  // Initial data fetch
  fetchSurfData('TODAY');
  
  // Auto-refresh every 30 seconds
  setInterval(() => {
    fetchSurfData(currentDay);
  }, 30000);
});

// Menu bar items
mb.trayMenu = [
  {
    label: 'Refresh',
    click: () => {
      fetchSurfData(currentDay);
    }
  },
  {
    label: 'Open Dashboard',
    click: () => {
      window.open('https://oth.surf', '_blank');
    }
  },
  {
    label: 'Quit',
    click: () => {
      mb.app.quit();
    }
  }
];

mb.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mb.app.quit();
  }
});

mb.app.on('activate', () => {
  if (mb.window === null) {
    mb.showWindow();
  }
});
