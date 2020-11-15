const express = require('express')
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(authController.protect, tourController.getAllTour).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect,
     authController.restrictTo('admin', 'lead-guide'),
      tourController.deleteTour);

// POST /tour/4312fasdf/reviews
// GET /tour/4312fasdf/reviews
// GET /tour/4312fasdf/reviews/978fdfd

router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)


module.exports = router;