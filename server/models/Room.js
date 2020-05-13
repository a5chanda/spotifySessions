import Member from "./Member";
import QueueItem from "./QueueItem";

export class Room{

    //1 Param Constructor
    constructor(roomName, host){
        this.Members = {}; // map of member objects
        this.QueueItem = [];
        this.roomName = roomName;
        this.password = "";
        this.host = new Member(host, true); //Member that is host
    }

    //2 param constructor
    constructor(roomName, password, host){
        this.Members = {}; // map of member objects
        this.QueueItem = [];
        this.roomName = roomName;
        this.password = password;
        this.host = new Member(host, true); //Member that is host
    }

    

    addMember(memberName){}

    removeMember(memberName){}

    addSong(trackID){}

    playSong(trackID){}

    playNext(){}
}