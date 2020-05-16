var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
let cors = require ('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/session', (req, res)=>{
  res.send("post data");
});

io.on('connection', (socket) => {
  console.log(socket.client.id, ' a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });


  socket.on('join room', function (roomName) {
    socket.join(roomName);
    io.sockets.in(roomName).emit("Joined Room: " + roomName);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on port:3000');
});
