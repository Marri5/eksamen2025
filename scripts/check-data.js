const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://10.12.91.102:27017/foxvoting';

// Models
const foxSchema = new mongoose.Schema({
  url: String,
  votes: Number,
  lastShown: Date,
  createdAt: Date
});

const voteSchema = new mongoose.Schema({
  foxId: mongoose.Schema.Types.ObjectId,
  timestamp: Date,
  userIp: String
});

const Fox = mongoose.model('Fox', foxSchema);
const Vote = mongoose.model('Vote', voteSchema);

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to:', MONGODB_URI);

    // Get counts
    const foxCount = await Fox.countDocuments();
    const voteCount = await Vote.countDocuments();

    console.log('\n📊 Database Statistics:');
    console.log(`- Total foxes: ${foxCount}`);
    console.log(`- Total votes: ${voteCount}`);

    if (foxCount > 0) {
      // Get top 5 foxes
      const topFoxes = await Fox.find().sort({ votes: -1 }).limit(5);
      
      console.log('\n🏆 Top 5 Foxes:');
      topFoxes.forEach((fox, index) => {
        console.log(`${index + 1}. ${fox.url.split('/').pop()} - ${fox.votes} votes`);
      });

      // Get recent votes
      const recentVotes = await Vote.find()
        .sort({ timestamp: -1 })
        .limit(5)
        .populate('foxId');

      console.log('\n🕐 Recent Votes:');
      for (const vote of recentVotes) {
        const timeAgo = Math.round((Date.now() - vote.timestamp) / 1000 / 60);
        console.log(`- ${timeAgo} minutes ago from ${vote.userIp || 'unknown'}`);
      }
    } else {
      console.log('\n⚠️  No data found in database!');
      console.log('Run the seed script to add test data:');
      console.log('  node scripts/seed-data.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPossible issues:');
    console.log('- MongoDB not running on', MONGODB_URI);
    console.log('- Firewall blocking connection');
    console.log('- Wrong database name or connection string');
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkDatabase(); 