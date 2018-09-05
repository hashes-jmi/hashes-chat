let express = require('express');
let port = process.env.PORT || 3000;
const path = require('path');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const db = require('./db');
const pool = db.pool;

// folder for static files
app.use('/public', express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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