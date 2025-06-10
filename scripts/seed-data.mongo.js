// MongoDB Shell Script - Run with: mongo mongodb://10.12.91.102:27017/foxvoting seed-data.mongo.js

// Switch to the correct database
use foxvoting;

// Clear existing data (optional)
print("Clearing existing data...");
db.foxes.deleteMany({});
db.votes.deleteMany({});

// Sample fox URLs and vote counts
var foxData = [
  { url: "https://randomfox.ca/images/1.jpg", votes: 150 },
  { url: "https://randomfox.ca/images/2.jpg", votes: 142 },
  { url: "https://randomfox.ca/images/3.jpg", votes: 138 },
  { url: "https://randomfox.ca/images/4.jpg", votes: 125 },
  { url: "https://randomfox.ca/images/5.jpg", votes: 118 },
  { url: "https://randomfox.ca/images/6.jpg", votes: 105 },
  { url: "https://randomfox.ca/images/7.jpg", votes: 98 },
  { url: "https://randomfox.ca/images/8.jpg", votes: 87 },
  { url: "https://randomfox.ca/images/9.jpg", votes: 76 },
  { url: "https://randomfox.ca/images/10.jpg", votes: 65 },
  { url: "https://randomfox.ca/images/11.jpg", votes: 54 },
  { url: "https://randomfox.ca/images/12.jpg", votes: 43 },
  { url: "https://randomfox.ca/images/13.jpg", votes: 32 },
  { url: "https://randomfox.ca/images/14.jpg", votes: 28 },
  { url: "https://randomfox.ca/images/15.jpg", votes: 21 },
  { url: "https://randomfox.ca/images/16.jpg", votes: 15 },
  { url: "https://randomfox.ca/images/17.jpg", votes: 12 },
  { url: "https://randomfox.ca/images/18.jpg", votes: 8 },
  { url: "https://randomfox.ca/images/19.jpg", votes: 5 },
  { url: "https://randomfox.ca/images/20.jpg", votes: 2 }
];

print("Creating fox entries with votes...");

foxData.forEach(function(fox, index) {
  // Create fox document
  var foxDoc = {
    url: fox.url,
    votes: fox.votes,
    lastShown: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  };
  
  // Insert fox
  var result = db.foxes.insertOne(foxDoc);
  var foxId = result.insertedId;
  
  // Create vote documents
  var votes = [];
  for (var i = 0; i < fox.votes; i++) {
    votes.push({
      foxId: foxId,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      userIp: "192.168.1." + Math.floor(Math.random() * 255)
    });
  }
  
  // Insert votes in batches of 100
  if (votes.length > 0) {
    var batchSize = 100;
    for (var i = 0; i < votes.length; i += batchSize) {
      var batch = votes.slice(i, i + batchSize);
      db.votes.insertMany(batch);
    }
  }
  
  print("Created fox #" + (index + 1) + " with " + fox.votes + " votes");
});

// Show statistics
print("\nDatabase Statistics:");
print("Total foxes: " + db.foxes.countDocuments());
print("Total votes: " + db.votes.countDocuments());

var topFox = db.foxes.findOne({}, { sort: { votes: -1 } });
print("Most popular fox has " + topFox.votes + " votes");

print("\nSeed data created successfully!");
print("Visit http://10.12.91.103:3000/statistics to see the results"); 