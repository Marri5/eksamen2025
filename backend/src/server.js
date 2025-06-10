const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Image = require('./models/Image');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://10.12.91.103:3000', // Frontend IP
  credentials: true
}));
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection - only accept connections from localhost
mongoose.connect('mongodb://10.12.91.102:27017/imageVoting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadDate: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Upload image
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const newImage = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname
    });

    await newImage.save();
    res.json({ message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Vote for an image
app.post('/api/images/:id/vote', async (req, res) => {
  try {
    const imageId = req.params.id;
    const voterIdentifier = req.ip || req.body.sessionId;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check if user already voted
    if (image.voters.includes(voterIdentifier)) {
      return res.status(400).json({ error: 'You have already voted for this image' });
    }

    // Add vote
    image.votes += 1;
    image.voters.push(voterIdentifier);
    await image.save();

    res.json({ message: 'Vote registered successfully', votes: image.votes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register vote' });
  }
});

// Get voting statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const topImages = await Image.find()
      .sort({ votes: -1 })
      .limit(10);
    
    const totalVotes = await Image.aggregate([
      { $group: { _id: null, total: { $sum: '$votes' } } }
    ]);

    res.json({
      topImages,
      totalVotes: totalVotes[0]?.total || 0,
      leadingImage: topImages[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend service is running', timestamp: new Date() });
});

app.listen(PORT, '10.12.91.101', () => {
  console.log(`Backend server running on http://10.12.91.101:${PORT}`);
}); 