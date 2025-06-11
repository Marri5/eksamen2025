const express = require('express');
const axios = require('axios');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;
const FRONTEND_HOST = process.env.FRONTEND_HOST || '10.12.91.103';
const BACKEND_HOST = process.env.BACKEND_HOST || '10.12.91.101';
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

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
    
    // Forward vote to backend with cookies
    const response = await axios.post(`${BACKEND_URL}/api/vote`, {
      imageUrl
    }, {
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    });
    
    // Forward any cookies from backend to frontend
    if (response.headers['set-cookie']) {
      response.headers['set-cookie'].forEach(cookie => {
        res.setHeader('Set-Cookie', cookie);
      });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Error voting:', error);
    
    // Check if it's an "already voted" error
    if (error.response && error.response.data) {
      res.status(error.response.status || 500).json(error.response.data);
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Kunne ikke registrere stemmen. Vennligst prøv igjen.' 
      });
    }
  }
});

// Vote status endpoint (AJAX)
app.get('/api/vote-status', async (req, res) => {
  try {
    // Forward request to backend with cookies
    const response = await axios.get(`${BACKEND_URL}/api/vote-status`, {
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    });
    
    // Forward any cookies from backend to frontend
    if (response.headers['set-cookie']) {
      response.headers['set-cookie'].forEach(cookie => {
        res.setHeader('Set-Cookie', cookie);
      });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke sjekke stemme-status' 
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

app.listen(PORT, FRONTEND_HOST, () => {
  console.log(`Frontend server running on http://${FRONTEND_HOST}:${PORT}`);
  console.log(`Connected to backend: ${BACKEND_URL}`);
}); 