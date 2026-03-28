const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public (or protected if only logged-in users should see)
const getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res, next) => {
  try {
    const { title, description, price, imageUrl, location } = req.body;

    if (!title || !description || !price || !imageUrl || !location) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const property = await Property.create({
      title,
      description,
      price,
      imageUrl,
      location,
    });

    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.deleteOne();

    res.status(200).json({ message: 'Property removed', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
