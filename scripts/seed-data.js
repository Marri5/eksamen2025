const mongoose = require('mongoose');

// MongoDB connection - adjust if running from different location
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://10.12.91.102:27017/foxvoting';

// Fox model schema
const foxSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  votes: { type: Number, default: 0 },
  lastShown: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Vote model schema
const voteSchema = new mongoose.Schema({
  foxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fox', required: true },
  timestamp: { type: Date, default: Date.now },
  userIp: { type: String, default: null }
});

const Fox = mongoose.model('Fox', foxSchema);
const Vote = mongoose.model('Vote', voteSchema);

// Sample fox image URLs (from randomfox.ca pattern)
const sampleFoxUrls = [
  'https://randomfox.ca/images/1.jpg',
  'https://randomfox.ca/images/2.jpg',
  'https://randomfox.ca/images/3.jpg',
  'https://randomfox.ca/images/4.jpg',
  'https://randomfox.ca/images/5.jpg',
  'https://randomfox.ca/images/6.jpg',
  'https://randomfox.ca/images/7.jpg',
  'https://randomfox.ca/images/8.jpg',
  'https://randomfox.ca/images/9.jpg',
  'https://randomfox.ca/images/10.jpg',
  'https://randomfox.ca/images/11.jpg',
  'https://randomfox.ca/images/12.jpg',
  'https://randomfox.ca/images/13.jpg',
  'https://randomfox.ca/images/14.jpg',
  'https://randomfox.ca/images/15.jpg',
  'https://randomfox.ca/images/16.jpg',
  'https://randomfox.ca/images/17.jpg',
  'https://randomfox.ca/images/18.jpg',
  'https://randomfox.ca/images/19.jpg',
  'https://randomfox.ca/images/20.jpg'
];

// Vote distribution for more realistic data
const voteDistribution = [
  150, 142, 138, 125, 118, 105, 98, 87, 76, 65,
  54, 43, 32, 28, 21, 15, 12, 8, 5, 2
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Optional: Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await Fox.deleteMany({});
    await Vote.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('\n🦊 Creating fox entries with votes...');
    
    for (let i = 0; i < sampleFoxUrls.length; i++) {
      const url = sampleFoxUrls[i];
      const voteCount = voteDistribution[i];
      
      // Create fox entry
      const fox = await Fox.create({
        url: url,
        votes: voteCount,
        lastShown: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
      });

      // Create individual vote records
      const votePromises = [];
      for (let j = 0; j < voteCount; j++) {
        // Spread votes over the last 7 days
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        votePromises.push(Vote.create({
          foxId: fox._id,
          timestamp: timestamp,
          userIp: `192.168.1.${Math.floor(Math.random() * 255)}` // Random IP for variety
        }));
      }

      // Create votes in batches to avoid overwhelming the database
      if (votePromises.length > 0) {
        await Promise.all(votePromises);
      }

      console.log(`✅ Created fox #${i + 1} with ${voteCount} votes`);
    }

    // Get statistics
    console.log('\n📊 Database Statistics:');
    const foxCount = await Fox.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const topFox = await Fox.findOne().sort({ votes: -1 });

    console.log(`- Total foxes: ${foxCount}`);
    console.log(`- Total votes: ${totalVotes}`);
    console.log(`- Most popular fox: ${topFox.votes} votes`);

    console.log('\n✨ Seed data created successfully!');
    console.log('🌐 Visit http://10.12.91.103:3000/statistics to see the results');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 