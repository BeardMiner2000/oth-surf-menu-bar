const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_PATH = path.join(__dirname, '../src/api.json');

// Middleware
app.use(cors());
app.use(express.json());

// Load API data
let surfData = {};
try {
  const rawData = fs.readFileSync(API_PATH, 'utf8');
  surfData = JSON.parse(rawData);
  console.log('✓ Loaded surf data from api.json');
} catch (error) {
  console.error('✗ Error loading API data:', error.message);
}

// Main API endpoint
app.get('/api/surf', async (req, res) => {
  try {
    res.json({
      timestamp: new Date().toISOString(),
      current: surfData.current,
      forecast: surfData.forecast,
      tide: surfData.tide
    });
  } catch (error) {
    console.error('Error fetching surf data:', error);
    res.status(500).json({ error: 'Failed to fetch surf data' });
  }
});

// Forecast-only endpoint
app.get('/api/forecast', async (req, res) => {
  try {
    res.json({ forecast: surfData.forecast });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    data_loaded: !!surfData.current
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  oth.surf Backend Server`);
  console.log(`${'='.repeat(50)}`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api/surf`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(50)}\n`);
});
