const Member = require("./Member");

class Room{

    //1 Param Constructor
    constructor(roomName, host, password){
        this.Members = {}; // map of member objects
        this.QueueItem = [];
        this.roomName = roomName;
        this.password = password ? password : "";
        this.host = host; //Member that is host
    }

    addMember(memberName){
        this.Members[memberName] = memberName;
    }

    removeMember(memberName){}

    addSong(trackID){}

    playSong(trackID){}

    playNext(){}
}


module.exports = Room