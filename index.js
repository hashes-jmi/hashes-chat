let express = require('express');
let port = process.env.PORT || 3000;
const path = require('path');
let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let db = require('./models/index');
let User = require('./models/user')(db.sequelize, db.Sequelize);

// folder for static files
app.use('/public', express.static(__dirname + '/public'));

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      where: {
        email: profile.emails[0].value,
        name: profile.displayName,
        avatarUrl: profile.photos[0].value
      } 
    })
    .spread((err, user, created) => {
      return done(err, user);
    })
  }
));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/chat');
  });

app.get('/chat', function(req, res){
  res.sendFile(path.join(__dirname, 'chat.html'));
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    pool.query(db.insertQuery(msg), (err, res) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

http.listen(port, function(){
  console.log('listening on localhost:' + port);
});