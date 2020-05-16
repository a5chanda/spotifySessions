var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
let cors = require ('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.client.id, ' a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });


  socket.on('join room', function (roomName) {
      
    let join = new Promise((resolve, reject) => {
        console.log(socket.client.id, ' socket joining');
        resolve(socket.join(roomName));
    });
    
    join.then(() =>{
        console.log("Joined Room: ", roomName);
        console.log(socket.client.id, 'joined');
        io.sockets.in(roomName).emit("Joined Room:");
    });  
    
    
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on port:3000');
});
