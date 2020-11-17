const express = require('express')
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', checkID)

// POST /tour/4312fasdf/reviews
// GET /tour/4312fasdf/reviews

// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

router.use('/:tourId/reviews' , reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year')
.get(authController.protect,authController.restrictTo('admin', 'lead-guide', 'guide'),tourController.getMonthlyPlan);


router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/')
.get(authController.protect, tourController.getAllTour)
.post(authController.protect,authController.restrictTo('admin', 'lead-guide'),tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
      authController.restrictTo('admin', 'lead-guide'),tourController.updateTour)
.delete(authController.protect,
     authController.restrictTo('admin', 'lead-guide'),
      tourController.deleteTour);





module.exports = router;