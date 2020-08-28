
const Room = require('./models/Room');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
let cors = require ('cors');

var port = process.env.PORT || 3000;

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
//     authToken: "",
//      expToken: ""
// }

function createRoom(room, socket){
    console.log("New Room: ", room);
    let newRoom = new Room(room.name, room.user);
    newRoom.addMember(room);
    rooms.set(room.name, newRoom);
    socket.join(room.name);
    console.log(rooms);
    console.log("Room JSON", JSON.stringify(newRoom));
    io.sockets.in(room.name).emit('create room', {isCreated: true, "MemberNames": newRoom['MemberNames']});
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
        //r['MemberNames'] = Array.from(r['Members'].keys()); //send back member names
        io.sockets.in(room.name).emit('join room', r);
    });
}

async function leaveRoom(room, socket){
    await (rooms.get(room.name)).removeMember(room.user);
    let r = await rooms.get(room.name);
    
    io.sockets.in(room.name).emit("leave room", r);

    //Delete the room if there are no members left
    if(r.getRoomSize() == 0){
       rooms.delete(room.name);
    }
    console.log("Member left", rooms);
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

http.listen(port, () => {
  console.log('listening on port:', port);
});
