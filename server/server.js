
const Room = require('./models/Room');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
let cors = require ('cors');

let rooms = {};

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.client.id, ' a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    var room = Object.keys(socket.rooms)[1]; 
    io.sockets.in(room).emit('chat message', msg);
  });

  socket.on('create room', function(room){
    console.log("room: ", room);
    let newRoom = new Room(room.name, room.user);
    rooms[room['name']] = newRoom;
    console.log(rooms);

  });

  socket.on('join room', function (roomName) {
    let join = new Promise((resolve, reject) => {
        console.log(socket.client.id, ' socket joining');
        resolve(socket.join(roomName));
    });

    join.then(() =>{
        console.log("Joined Room: ", roomName);
        console.log(socket.client.id, 'joined');
        var secondKey = Object.keys(socket.rooms)[1]; 

        console.log("Room:", secondKey);
    });  
    io.sockets.in(roomName).emit('join room', "Joined Room:" + roomName);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on port:3000');
});
