const express = require('express');
const router = express.Router();
const {
  getFavourites,
  addFavourite,
  removeFavourite,
  getAllFavourites,
} = require('../controllers/favouriteController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all routes in this file
router.use(protect);

router.route('/all').get(admin, getAllFavourites);
router.route('/').get(getFavourites).post(addFavourite);
router.route('/:id').delete(removeFavourite);

module.exports = router;
