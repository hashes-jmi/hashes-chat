let express = require('express');
let port = process.env.PORT || 3000;
const path = require('path');
let cons = require('consolidate');
let passport = require('passport');
let GoogleStrategy = require('passport-google-oidc');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// Database and models stuff
let db = require('./models/index');
let User = require('./models/user')(db.sequelize, db.Sequelize);
let Message = require('./models/message')(db.sequelize, db.Sequelize);
Message.User = Message.belongsTo(User);
User.Messages = User.hasMany(Message);

app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// set templating engine
app.engine('html', cons.ejs);
// set .html as default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// folder for static files
app.use('/public', express.static(__dirname + '/public'));

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://hashes-chat.herokuapp.com/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      where: {
        email: profile.emails[0].value,
        name: profile.displayName,
        avatarUrl: profile.photos[0].value
      }
    })
      .spread((user, created) => {
        return done(null, user);
      })
  }
));

app.get("/", (req, res) => {
  res.render('index', {});
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/chat');
  });

app.get('/chat',
  require('connect-ensure-login').ensureLoggedIn('/auth/google'),
  function (req, res) {
    res.render('chat', {
      user: req.user
    });
  });

io.on('connection', function (socket) {
  // load all messages from db and broadcase
  Message.findAll({
    attributes: ['body', 'UserId']
  })
    .then(messages => {
      messages.forEach(msg => {
        // build message object
        let msgObj = {
          body: msg.dataValues.body,
          sender: msg.dataValues.UserId
        }

        User.findById(msgObj.sender)
          .then(user => {
            msgObj.senderName = user.name;
            socket.emit('chat message', msgObj);
          });
      });
    });

  socket.on('chat message', function (msg) {
    // push message to db
    Message.build({
      body: msg.body,
      UserId: msg.sender
    }, {
      include: [{
        association: Message.User
      }]
    })
      .save()
      // execute promise when there are no errors
      .then(() => {
        // get mame of user who has sent the message
        User.findById(msg.sender)
          .then((user) => {
            io.emit('chat message', {
              body: msg.body,
              sender: msg.sender,
              senderName: user.name
            });
          });
      })
      // catch all errors
      .catch(err => {
        console.error('ERROR: ' + err.name);
        // change errorMessage to something more appropriate
        let errorMessage =
          'There was an error sending a message: \n' + err.name;
        io.emit('error message', errorMessage);
      });
  });
});

http.listen(port, function () {
  console.log('listening on localhost:' + port);
});