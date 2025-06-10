const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://10.12.91.103:3000', // Frontend server
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection - only accessible via internal IP
mongoose.connect('mongodb://10.12.91.102:27017/foxvoting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import models
const Fox = require('./models/Fox');
const Vote = require('./models/Vote');

// API Routes
// Get two random fox images
app.get('/api/foxes/random', async (req, res) => {
  try {
    // Fetch two random fox images from the external API
    const [fox1, fox2] = await Promise.all([
      axios.get('https://randomfox.ca/floof/'),
      axios.get('https://randomfox.ca/floof/')
    ]);

    // Extract image URLs
    const images = [
      { id: 1, url: fox1.data.image },
      { id: 2, url: fox2.data.image }
    ];

    // Save or update foxes in database
    for (const img of images) {
      await Fox.findOneAndUpdate(
        { url: img.url },
        { url: img.url, lastShown: new Date() },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching fox images:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke hente bilder. Vennligst prøv igjen.' 
    });
  }
});

// Vote for a fox
app.post('/api/vote', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ingen bilde-URL mottatt' 
      });
    }

    // Find or create fox
    let fox = await Fox.findOne({ url: imageUrl });
    if (!fox) {
      fox = await Fox.create({ url: imageUrl });
    }

    // Increment vote count
    fox.votes += 1;
    await fox.save();

    // Create vote record
    await Vote.create({
      foxId: fox._id,
      timestamp: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Takk for din stemme!',
      totalVotes: fox.votes 
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke registrere stemmen. Vennligst prøv igjen.' 
    });
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    // Get top 10 most voted foxes
    const topFoxes = await Fox.find()
      .sort({ votes: -1 })
      .limit(10);

    // Get the leading fox
    const leader = topFoxes[0];

    // Get total votes
    const totalVotes = await Vote.countDocuments();

    res.json({
      success: true,
      statistics: {
        topFoxes: topFoxes.map(fox => ({
          id: fox._id,
          url: fox.url,
          votes: fox.votes
        })),
        leader: leader ? {
          url: leader.url,
          votes: leader.votes,
          message: `Rev ${leader._id.toString().slice(-2)} er søtest akkurat nå!`
        } : null,
        totalVotes
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kunne ikke hente statistikk' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Backend API',
    timestamp: new Date().toISOString() 
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: [
      {
        method: 'GET',
        path: '/api/foxes/random',
        description: 'Henter to tilfeldige revebilder',
        response: {
          success: true,
          images: [
            { id: 1, url: 'https://randomfox.ca/images/1.jpg' },
            { id: 2, url: 'https://randomfox.ca/images/2.jpg' }
          ]
        }
      },
      {
        method: 'POST',
        path: '/api/vote',
        description: 'Registrerer en stemme for et revebilde',
        body: { imageUrl: 'https://randomfox.ca/images/1.jpg' },
        response: {
          success: true,
          message: 'Takk for din stemme!',
          totalVotes: 42
        }
      },
      {
        method: 'GET',
        path: '/api/statistics',
        description: 'Henter statistikk over mest populære rever',
        response: {
          success: true,
          statistics: {
            topFoxes: [],
            leader: {},
            totalVotes: 100
          }
        }
      }
    ]
  });
});

app.listen(PORT, '10.12.91.101', () => {
  console.log(`Backend server running on http://10.12.91.101:${PORT}`);
}); 