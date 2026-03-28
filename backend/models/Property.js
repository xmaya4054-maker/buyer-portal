const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      default: 'Unknown',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
