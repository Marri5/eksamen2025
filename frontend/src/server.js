const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = 'http://10.12.91.101:5000';

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management (simple implementation)
app.use((req, res, next) => {
  if (!req.headers.cookie?.includes('sessionId')) {
    const sessionId = Date.now() + '-' + Math.random().toString(36);
    res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/`);
    req.sessionId = sessionId;
  } else {
    req.sessionId = req.headers.cookie.split('sessionId=')[1].split(';')[0];
  }
  next();
});

// Routes
// Home page - Image gallery
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/images`);
    const images = response.data;
    res.render('index', { images, backendUrl: BACKEND_URL });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.render('index', { images: [], backendUrl: BACKEND_URL, error: 'Failed to load images' });
  }
});

// Statistics page
app.get('/statistics', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/statistics`);
    const stats = response.data;
    res.render('statistics', { stats, backendUrl: BACKEND_URL });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.render('statistics', { stats: null, backendUrl: BACKEND_URL, error: 'Failed to load statistics' });
  }
});

// Upload page
app.get('/upload', (req, res) => {
  res.render('upload');
});

// Proxy vote request to backend
app.post('/vote/:id', async (req, res) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/images/${req.params.id}/vote`,
      { sessionId: req.sessionId },
      { headers: { 'X-Forwarded-For': req.ip } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to register vote'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Frontend service is running', timestamp: new Date() });
});

app.listen(PORT, '10.12.91.103', () => {
  console.log(`Frontend server running on http://10.12.91.103:${PORT}`);
}); 