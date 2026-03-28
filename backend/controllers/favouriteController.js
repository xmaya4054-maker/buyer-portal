const Favourite = require('../models/Favourite');

// @desc    Get logged in user's favourites
// @route   GET /api/favourites
// @access  Private
const getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ user: req.user.id });
    res.status(200).json(favourites);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new favourite
// @route   POST /api/favourites
// @access  Private
const addFavourite = async (req, res, next) => {
  try {
    const { title, propertyId, description, imageUrl, price, location } = req.body;

    if (!title || !propertyId) {
      return res.status(400).json({ message: 'Please provide title and propertyId' });
    }

    // Check if it already exists for this user
    const existingFavourite = await Favourite.findOne({
      user: req.user.id,
      propertyId: propertyId,
    });

    if (existingFavourite) {
      return res.status(400).json({ message: 'Property is already in favourites' });
    }

    const favourite = await Favourite.create({
      user: req.user.id,
      title,
      propertyId,
      description,
      imageUrl,
      price,
      location,
    });

    res.status(201).json(favourite);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a favourite
// @route   DELETE /api/favourites/:id
// @access  Private
const removeFavourite = async (req, res, next) => {
  try {
    const favourite = await Favourite.findById(req.params.id);

    if (!favourite) {
      return res.status(404).json({ message: 'Favourite not found' });
    }

    // Ensure user owns this favourite (Security Check)
    if (favourite.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this' });
    }

    await favourite.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Favourite removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all favourites from all users (Admin only)
// @route   GET /api/favourites/all
// @access  Private/Admin
const getAllFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find().populate('user', 'name email');
    res.status(200).json(favourites);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
  getAllFavourites,
};
