const express = require('express');
const router = express.Router();

const controller = require('../controllers/mainController');

const { login, verify } = require('../auth/auth');

const auth = require('../auth/auth');

router.get('/', controller.homepage);
router.get('/about', controller.about);
router.get('/courses', controller.courseList);
router.post('/book', controller.bookCourse);

router.get('/login', controller.showLoginPage);
router.post('/login', login, controller.afterLogin);

router.get('/dashboard', verify, controller.dashboard);
router.post('/dashboard/add', verify, controller.addCourse);
router.post('/dashboard/delete/:id', verify, controller.deleteCourse);
router.get('/dashboard/bookings/:id', verify, controller.viewBookings);
router.get('/dashboard/organisers', verify, controller.viewOrganisers);
router.post('/dashboard/add-organiser', verify, controller.addOrganiser);
router.post('/dashboard/delete-organiser/:username', verify, controller.deleteOrganiser);
router.get('/dashboard/edit/:id', verify, controller.showEditCourse);
router.post('/dashboard/edit/:id', verify, controller.editCourse);
router.post('/dashboard/delete-booking/:id', verify, controller.deleteBooking);

router.get('/register-user', controller.showUserRegister);
router.post('/register-user', controller.registerUser);

router.get('/login-user', controller.showUserLogin);
router.post('/login-user', auth.userLogin, controller.afterUserLogin);

router.get('/my-bookings', auth.userVerify, controller.showMyBookings);
router.get('/logout-user', controller.logoutUser);
router.post('/cancel-booking/:id', auth.userVerify, controller.cancelMyBooking);

router.get('/dashboard/users', verify, controller.viewUsers);
router.post('/dashboard/delete-user/:username', verify, controller.deleteUser);

router.get('/logout', controller.logout);

module.exports = router;

