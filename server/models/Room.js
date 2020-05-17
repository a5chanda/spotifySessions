const Member = require("./Member");

class Room{

    //1 Param Constructor
    constructor(roomName, host, password){
        this.Members = new Map(); // map of member objects
        this.Queue = [];
        this.roomName = roomName;
        this.password = password ? password : "";
        this.host = host; //Member that is host
    }


//User Object from client{
//     roomName: "",
//     user: "",
//     isHost: bool,
//     authToken: ""
// }
    addMember(user){
        let m = new Member(user);
        console.log(m);
        this.Members.set(user.user, m);
    }

    removeMember(memberName){
        // delete this.Members[memberName];
        this.Members.delete(memberName);
    }

    //Returns the total number of members in the room
    getRoomSize(){
        return Object.keys(this.Members).length;
    }

    addSong(trackID){
        this.Queue.push(trackID);
    }

    playSong(trackID){}

    playNext(){}
}


module.exports = Room