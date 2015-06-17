// Global declarations for linters
/* global __dirname */
/* global process */

var express       = require('express'),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app           = express(), // Define app with express
    db;

// Mongo connection string set if one not specified in MONGOCONNSTR
var mongoConnStr = process.env.MONGOCONNSTR || 'mongodb://localhost/yadaguru';
db = mongoose.connect(mongoConnStr);

// Define Angular app folder as static content
app.use(express.static(__dirname + '/yadaApp'));
// Configure app with bodyParser to get POST data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'Not a good secret' }));
app.use(passport.initialize());
app.use(passport.session());

// Use port 3000 if no PORT environment variable set
var port = process.env.PORT || 3000;

// Import user model
var User = require('./server/models/user');

var authRouter = require('./server/routes/authRoutes')();

app.use('/api/auth', authRouter);

// Configuring Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username:username }).exec(function(err, user) {
      if(user && user.authenticate(password)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  if(user) {
    done(null, user._id);
  }
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id:id }).exec(function(err, user) {
    if(user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

// Grab a instance of the DB model
var Reminder = require('./server/models/reminder');

// Use the DB model to get an instance of the router
var reminderRouter = require('./server/routes/reminderRoutes')(Reminder);

// All of the routes in reminderRouter will be prefixed with /api/reminders
app.use('/api/reminders', reminderRouter);

// Controls the routes for exporting reminders for calendar apps
var exportRouter = require('./server/routes/exportRoutes')();

// All of the export routes are prefixed with /api/export
app.use('/api/export', exportRouter);

var userRouter = require('./server/routes/userRoutes')();
app.use('/api/users', userRouter);

// Basic GET to serve static index.html
app.get('/', function (req, res) {
  res.sendFile('./yadaApp/index.html');
});

// Start the server and display a message to the console
app.listen(port, function () {
  console.log('Running on PORT: ' + port);
});

// Export app for use in testing
module.exports = app;