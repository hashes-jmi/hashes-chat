let express = require('express');
let port = process.env.PORT || 3000;

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const db = require('./db');

// folder for static files
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg.body);
    db.pool.query(db.insertQuery(msg), (err, res) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log(res);
      }
    });
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});