const express = require('express');
const axios = require('axios');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;
const BACKEND_URL = 'http://10.12.91.101:5000';

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Main voting page
app.get('/', async (req, res) => {
  try {
    // Fetch random fox images from backend
    const response = await axios.get(`${BACKEND_URL}/api/foxes/random`);
    const images = response.data.images;
    
    res.render('index', { 
      images,
      error: null,
      showStats: false 
    });
  } catch (error) {
    console.error('Error fetching foxes:', error);
    res.render('index', { 
      images: [],
      error: 'Kunne ikke laste inn bilder. Vennligst prøv igjen senere.',
      showStats: false 
    });
  }
});

// Statistics page
app.get('/statistics', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/statistics`);
    const statistics = response.data.statistics;
    
    res.render('statistics', { 
      statistics,
      error: null 
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.render('statistics', { 
      statistics: null,
      error: 'Kunne ikke laste inn statistikk. Vennligst prøv igjen senere.' 
    });
  }
});

// Vote endpoint (AJAX)
app.post('/vote', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    // Forward vote to backend
    const response = await axios.post(`${BACKEND_URL}/api/vote`, {
      imageUrl
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke registrere stemmen. Vennligst prøv igjen.' 
    });
  }
});

// User guide page
app.get('/guide', (req, res) => {
  res.render('guide');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Frontend Server',
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Noe gikk galt. Vennligst prøv igjen senere.' 
  });
});

app.listen(PORT, '10.12.91.103', () => {
  console.log(`Frontend server running on http://10.12.91.103:${PORT}`);
}); 