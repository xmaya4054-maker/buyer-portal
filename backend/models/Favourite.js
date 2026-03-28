const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide property title'],
    },
    propertyId: {
      type: String,
      required: [true, 'Please provide property ID'],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Favourite', favouriteSchema);
