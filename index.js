var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
let { Pool } = require('pg');

app.use('/public', express.static(__dirname + '/public'));

const pool = new Pool({
  user: 'faraaz',
  host: 'localhost',
  database: 'chat',
  password: process.env.PASSWORD,
  port: 5432,
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg.body);
    pool.query(`insert into messages (body, sender, created_at) values ('${msg.body}', '${msg.sender}', '${msg.created_at}');`, (err, res) => {
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