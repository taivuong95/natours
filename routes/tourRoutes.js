const express = require('express')
const {getMonthlyPlan, getTourStats, aliasTopTours,getAllTour ,createTour, getTour, updateTour, deleteTour,checkID, checkBody} = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', checkID)

router.route('/top-5-cheap').get(aliasTopTours,getAllTour);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTour).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);


module.exports = router;