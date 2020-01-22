
const express = require('express')
const {getAllUser ,createUser, getUser, updateUser, deleteUser} = require('./../controllers/userController');
const {signup, login} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router.route('/').get(getAllUser).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;