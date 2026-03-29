const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = "mongodb://rokatuka6_db_user:lzbONy50VobZq4UA@cluster0-shard-00-00.rghopz4.mongodb.net:27017,cluster0-shard-00-01.rghopz4.mongodb.net:27017,cluster0-shard-00-02.rghopz4.mongodb.net:27017/techkraft_buyer_portal?ssl=true&tls=true&replicaSet=atlas-6hjfhl-shard-0&authSource=admin&retryWrites=true&w=majority";
console.log('Testing with non-SRV URI');

mongoose.connect(uri, { family: 4 })
  .then(() => {
    console.log('Successfully connected!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
