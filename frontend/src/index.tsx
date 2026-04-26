import { AppWindow, Menu as ElectronMenu, shell } from 'menubar';
import React from 'react';
import { createRoot } from 'react-dom/client';

// oth.surf color scheme and aesthetic
const THEME = {
  bg: '#1a1a2e',
  text: '#e0e0e0',
  accent: '#ff6b35',
  green: '#00d4aa',
  gray: '#4a4a68',
  border: '#2d2d44'
};

// Main menu bar application
const App = () => {
  const [currentDay, setCurrentDay] = React.useState('TODAY');
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState('');

  // Fetch data from backend
  const fetchData = async (day: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/surf`);
      const result = await response.json();
      
      if (result.error) {
        console.error('Error fetching data:', result.error);
        return;
      }
      
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(currentDay);
    const interval = setInterval(() => {
      fetchData(currentDay);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [currentDay]);

  const navigateDay = (direction: 'prev' | 'next') => {
    const days = ['TODAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY'];
    const currentIndex = days.indexOf(currentDay);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0) newIndex = days.length - 1;
    if (newIndex >= days.length) newIndex = 0;
    
    setCurrentDay(days[newIndex]);
    fetchData(days[newIndex]);
  };

  const openDashboard = () => {
    shell.openExternal('https://oth.surf');
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: THEME.bg,
      color: THEME.text,
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigateDay('prev')}
          disabled={currentDay === 'TODAY'}
          style={{
            background: currentDay !== 'TODAY' ? THEME.accent : '#333',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: currentDay === 'TODAY' ? 'not-allowed' : 'pointer'
          }}
        >
          PREV
        </button>
        
        <span style={{ margin: '0 15px', fontSize: '18px', fontWeight: 'bold' }}>
          {currentDay}
        </span>
        
        <button
          onClick={() => navigateDay('next')}
          disabled={currentDay === 'TODAY'}
          style={{
            background: currentDay !== 'TODAY' ? THEME.accent : '#333',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: currentDay === 'TODAY' ? 'not-allowed' : 'pointer'
          }}
        >
          NEXT ▶
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading...</div>
        </div>
      ) : (
        <div style={{
          backgroundColor: THEME.gray,
          borderRadius: '8px',
          padding: '20px',
          border: `1px solid ${THEME.border}`
        }}>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              OVER THE HILL // BOLINAS BEARD PATROL
            </h1>
            <h2 style={{ margin: '5px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
              {currentDay} LONGBOARD REPORT
            </h2>
          </div>

          {/* Main Forecast */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#2a2a40',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '10px'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#888' }}>STOKE METER:</span>
                <span style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: THEME.green,
                  marginLeft: '10px'
                }}>
                  {data?.current?.stoke}%
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>LAST UPDATED:</span>
                <span style={{ fontSize: '11px', marginLeft: '5px' }}>{lastUpdated}</span>
              </div>
            </div>

            {/* Conditions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '15px'
            }}>
              {data?.current?.conditions?.slice(0, 6).map((condition: string, idx: number) => (
                <div key={idx} style={{
                  background: '#3a3a50',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  textAlign: 'center'
                }}>
                  {condition}
                </div>
              ))}
            </div>

            {/* Wave Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '15px'
            }}>
              <div style={{
                background: '#3a3a50',
                padding: '10px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '10px', color: '#888' }}>WAVES</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.green }}>
                  {data?.current?.waveHeight}
                </span>
              </div>
              <div style={{
                background: '#3a3a50',
                padding: '10px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '10px', color: '#888' }}>TIDE RANGE</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {data?.current?.tideRange}
                </span>
              </div>
              <div style={{
                background: '#3a3a50',
                padding: '10px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '10px', color: '#888' }}>BEST SLOT</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {data?.current?.bestSlot}
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{
              background: '#2a2a40',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px',
              lineHeight: '1.6'
            }}>
              <strong>JL THINKS...</strong>
              <p style={{ margin: '8px 0 0', fontStyle: 'italic' }}>
                {data?.current?.description}
              </p>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>
              5-DAY GLIDE REPORT
            </h3>
            {data?.forecast?.slice(0, 5).map((day: any) => (
              <div
                key={day.day}
                style={{
                  background: currentDay === day.day ? THEME.accent : '#3a3a50',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  opacity: currentDay === day.day ? 1 : 0.7
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: currentDay === day.day ? 'white' : 'inherit' }}>
                    {day.day}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: currentDay === day.day ? THEME.green : 'inherit'
                  }}>
                    {day.stoke}%
                  </span>
                </div>
                <div style={{
                  fontSize: '10px',
                  marginTop: '5px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  {day.conditions.slice(0, 4).map((c: string, i: number) => (
                    <span key={i} style={{ color: '#ccc' }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#666'
          }}>
            <span>LAT: 37.9091° N | LON: 122.6830° W | BOLINAS</span>
            <button
              onClick={openDashboard}
              style={{
                background: 'transparent',
                border: '1px solid #4a4a68',
                color: '#888',
                padding: '4px 8px',
                borderRadius: '3px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              REFRESH / DASHBOARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main entry point
const createWindow = () => {
  const mainWindow = new AppWindow({
    width: 400,
    height: 600,
    show: false,
    frame: false,
    width: 400,
    height: 600,
    width: 400,
    height: 600,
    icon: path.join(__dirname, '../assets/icon.png'),
    menuBar: true,
    width: 400,
    height: 600,
    width: 400,
    height: 600,
  });
  
  const root = createRoot(mainWindow.getReactRoot());
  root.render(<App />);
  
  mainWindow.show();
  
  // Set app title
  mainWindow.menuBarApp.setApplicationOptions({
    title: 'OTH SURF'
  });
  
  // Menu items
  mainWindow.menuBarApp.createTrayContextMenu([
    {
      label: 'Refresh',
      click: () => {
        fetchData(currentDay);
      }
    },
    {
      label: 'Open Dashboard',
      click: () => {
        shell.openExternal('https://oth.surf');
      }
    },
    {
      label: 'Quit',
      click: () => {
        mainWindow.menuBarApp.quit();
      }
    }
  ]);
};
