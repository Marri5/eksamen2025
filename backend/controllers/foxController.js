const axios = require('axios');
const Fox = require('../models/Fox');

// Get two random fox images
const getRandomFoxes = async (req, res) => {
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
};

module.exports = {
  getRandomFoxes
}; 