
const Room = require('./models/Room');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
let cors = require ('cors');

//Keep track of the rooms in the server
let rooms = new Map();

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


//Room Object from client{
//     name: "",
//     user: "",
//     isHost: bool,
//     authToken: ""
// }

function createRoom(room, socket){
    console.log("New Room: ", room);
    let newRoom = new Room(room.name, room.user);
    newRoom.addMember(room);
    rooms.set(room.name, newRoom);
    socket.join(room.name);
    console.log(rooms);
    io.sockets.in(room.name).emit('create room', true);
}

function joinRoom(room, socket){
    let join = new Promise((resolve, reject) => {
        console.log("Joining room: ", room.name);
        console.log(socket.client.id, ' socket joining');
        resolve(socket.join(room.name));
    });
    join.then(()=>{
        console.log("Joined Room:", room.name);
        let r = rooms.get(room.name);
        r.addMember(room);
        console.log("Rooms", rooms);
        io.sockets.in(room.name).emit('join room', r);
    });
}

async function leaveRoom(room, socket){
    let r = await rooms.get(room.name);
    r.removeMember(room.user);
    io.sockets.in(room.name).emit("leave room", "User:" + room.user + "left the room");

    //Delete the room if there are no members left
    if(r.getRoomSize() == 0){
        rooms.delete(room.name);
    }
    console.log(rooms);
    socket.leave(room.name);
}

io.on('connection', (socket) => {
  console.log(socket.client.id, ' a user connected');
  

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        var room = Object.keys(socket.rooms)[1]; 
        io.sockets.in(room).emit('chat message', msg);
    });

    socket.on('create room', (room) => createRoom(room, socket));

    socket.on('join room', (room)=> joinRoom(room, socket));  

    socket.on('leave room', (room) => leaveRoom(room, socket));

    socket.on('add song', (trackID) => {
        console.log("Adding song", trackID);
        let roomName = Object.keys(socket.rooms)[1];
        let r = rooms.get(roomName);
        r.addSong(trackID);
        console.log("Added song", r);
        io.sockets.in(roomName).emit("add song", trackID);
    });


  socket.on('disconnect', () => {
    var roomName = Object.keys(socket.rooms)[1]; 
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on port:3000');
});
