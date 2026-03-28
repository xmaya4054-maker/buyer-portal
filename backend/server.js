const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Security and utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Apply Routes
app.use('/api/auth', authRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/properties', propertyRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
