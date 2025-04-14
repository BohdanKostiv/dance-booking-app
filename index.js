const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const userModel = require('./models/userModel');
const courseModel = require('./models/courseModel');
courseModel.seedCourses();

const app = express();

//Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Mustache templates
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Routes
const mainRoutes = require('./routes/mainRoutes');
app.use('/', mainRoutes);

//Errors handling
app.use((req, res) => {
  res.status(404).send('404 – Page not found');
});

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dance booking app running at http://localhost:${PORT}`);
});

userModel.seedAdmin();
