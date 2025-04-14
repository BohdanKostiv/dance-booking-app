const courseModel = require('../models/courseModel');
const bookingModel = require('../models/bookingModel');
const memberModel = require('../models/memberModel');
const userModel = require('../models/userModel');

exports.homepage = (req, res) => {
    res.render('home', {
      title: 'Welcome to the Dance Classes Booking App'
    });
  };
  
exports.about = (req, res) => {
    res.render('about', {
      title: 'About Us',
      description: 'We offer dance classes for all fitness levels – from weekend workshops to weekly sessions.'
    });
};
  
exports.courseList = async (req, res) => {
    const courseModel = require('../models/courseModel');
    try {
      const courses = await courseModel.getAllCourses();
      res.render('courses', {
        title: 'Our Dance Courses',
        courses
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching courses');
    }
};

exports.bookCourse = async (req, res) => {
    const bookingModel = require('../models/bookingModel');
  
    const { name, courseId } = req.body;
  
    if (!name || !courseId) {
      return res.status(400).send('Missing name or course ID');
    }
  
    try {
      await bookingModel.addBooking(name, courseId);
      res.send(`<h2>Thank you, ${name}, your booking has been received!</h2><a href="/courses">← Back to courses</a>`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error booking course');
    }
};

exports.showLoginPage = (req, res) => {
  res.render('login', { title: 'Organiser Login' });
};

exports.afterLogin = (req, res) => {
  res.redirect('/dashboard');
};

exports.dashboard = (req, res) => {
  res.send(`<h2>Welcome, ${req.user}!</h2><p>This is the organiser dashboard.</p><a href="/courses">← Back to courses</a>`);
};

exports.dashboard = async (req, res) => {
  const courses = await courseModel.getAllCourses();
  res.render('dashboard', {
    title: 'Organiser Dashboard',
    user: req.user,
    courses
  });
};

exports.addCourse = async (req, res) => {
  const { name, duration, schedule, description, location, price } = req.body;
  await courseModel.addCourse({ name, duration, schedule, description, location, price });
  res.redirect('/dashboard');
};

exports.deleteCourse = async (req, res) => {
  const id = req.params.id;
  await courseModel.deleteCourse(id);
  res.redirect('/dashboard');
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
  };
 
exports.viewBookings = async (req, res) => {
  const courseId = req.params.id;

  try {
    const bookings = await bookingModel.getBookingsByCourse(courseId);
    const course = (await courseModel.getAllCourses()).find(c => c._id === courseId);

    res.render('bookings', {
      title: `Bookings for ${course?.name || 'Unknown Course'}`,
      course,
      bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bookings");
  }
};

exports.viewOrganisers = async (req, res) => {
    const users = await userModel.getAllOrganisers();
    res.render('organisers', {
      title: 'Organiser Management',
      users,
      currentUser: req.user
    });
};

exports.addOrganiser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.send('All fields required.');
  
    const existing = await userModel.lookup(username);
    if (existing) return res.send('Organiser already exists.');
  
    await userModel.create(username, password);
    res.redirect('/dashboard/organisers');
};
  
exports.deleteOrganiser = async (req, res) => {
    const username = req.params.username;
    if (username === req.user) {
      return res.send("You can't delete yourself.");
    }
  
    await userModel.delete(username);
    res.redirect('/dashboard/organisers');
};
  
exports.showEditCourse = async (req, res) => {
    const id = req.params.id;
    const courses = await courseModel.getAllCourses();
    const course = courses.find(c => c._id === id);
  
    if (!course) return res.status(404).send('Course not found');
  
    res.render('editCourse', {
      title: 'Edit Course',
      course
    });
};
  
exports.editCourse = async (req, res) => {
    const id = req.params.id;
    const updated = req.body;
  
    await courseModel.updateCourse(id, updated);
    res.redirect('/dashboard');
};
  
exports.deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
    await bookingModel.deleteBooking(bookingId);
    res.redirect(`/dashboard/bookings/${req.body.courseId}`);
};
  
exports.showUserRegister = (req, res) => {
  res.render('register-user', { title: 'Register as Member' });
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  const existing = await memberModel.lookup(username);
  if (existing) return res.send('User already exists.');

  await memberModel.create(username, password);
  res.redirect('/login-user');
};

exports.showUserLogin = (req, res) => {
  res.render('login-user', { title: 'Member Login' });
};

exports.afterUserLogin = (req, res) => {
  res.redirect('/my-bookings');
};

exports.logoutUser = (req, res) => {
  res.clearCookie('userJwt');
  res.redirect('/');
};

exports.showMyBookings = async (req, res) => {
    try {
      const username = req.user;
      const bookings = await bookingModel.getBookingsByUser(username);
      const allCourses = await courseModel.getAllCourses();
  
      const enrichedBookings = bookings.map(booking => {
        const course = allCourses.find(c => c._id === booking.courseId);
        return {
          ...booking,
          courseName: course?.name || 'Unknown Course',
          schedule: course?.schedule || 'N/A',
          location: course?.location || 'N/A',
          price: course?.price || 'N/A',
          description: course?.description || 'N/A'
        };
      });
  
      res.render('myBookings', {
        title: 'My Bookings',
        username,
        bookings: enrichedBookings
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading your bookings");
    }
};
  
exports.cancelMyBooking = async (req, res) => {
    const bookingId = req.params.id;
    const username = req.user;
  
    const allBookings = await bookingModel.getBookingsByUser(username);
    const target = allBookings.find(b => b._id === bookingId);
  
    if (!target) {
      return res.status(403).send('You are not allowed to delete this booking.');
    }
  
    await bookingModel.deleteBooking(bookingId);
    res.redirect('/my-bookings');
};
  
exports.viewUsers = async (req, res) => {
    const users = await memberModel.getAllUsers();
    res.render('users', {
      title: 'Registered Members',
      users
    });
  };
  
  exports.deleteUser = async (req, res) => {
    const username = req.params.username;
  
    await memberModel.deleteUser(username);
    await bookingModel.deleteBookingsByUsername(username); // optional cleanup
    res.redirect('/dashboard/users');
};
  
exports.homepage = (req, res) => {
    res.render('home', {
      title: 'Welcome to Dance Booking',
      isUser: !!req.cookies.userJwt,
      isOrganiser: !!req.cookies.jwt
    });
};
  