const Member = require("./Member");
const SpotifyWebAPI = require('spotify-web-api-node');
const https = require('https')


// export const 

class Room{

    //1 Param Constructor
    constructor(roomName, host, password){
        this.Members = new Map(); // map of member objects
        this.Queue = [];
        this.roomName = roomName;
        this.password = password ? password : "";
        this.host = host; //Member that is host
        this.MemberNames = []; //array of member names and images
    }

    async getValidSPObj(user){
        const tokenExpirationTime = user['expTime'];

        //@TODO add refresh token functionality

        // if (new Date().getTime() > tokenExpirationTime) {
        //     // access token has expired, so we need to use the refresh token
        //     await refreshTokens();
        // }
        const accessToken = user['authToken'];
        var sp = new SpotifyWebAPI();
        sp.setAccessToken(accessToken);
        return sp; 
    }

//User Object from client{
//     roomName: "",
//     user: "",
//     isHost: bool,
//     authToken: "",
//     exptTime: float
// }
    addMember(user){
        let m = new Member(user);
        console.log(m);
        this.Members.set(user.user, m);
        //for(let i = 0; i < 5; i++){
            this.MemberNames.push({"name": user.user, "image": user['profileImage']});
        //}
        
    }

    removeMember(memberName){
        this.Members.delete(memberName);
        let index = this.MemberNames.map(user => user.name).indexOf(memberName);
        this.MemberNames.splice(index, 1);
        
    }

    //Returns the total number of members in the room
    getRoomSize(){
        return Object.keys(this.Members).length;
    }

    addSong(song){
        this.Queue.push(song);
        //this.playSong(song['trackID']);
    }

    async play(song){
        await this.playSong(song['trackID']);
    }

    async playSong(trackID){
        let hostMember = this.Members.get(this.host);
        // const sp = await this.getValidSPObj(hostMember);
        const accessToken = hostMember['authToken'];
        var sp = new SpotifyWebAPI();
        sp.setAccessToken(accessToken);

        let str = "spotify:track:"+trackID;
        let deviceID = "";
        sp.getMyDevices().then((data)=>{
            console.log(data['body']['devices']);
            deviceID = data['body']['devices'][0]['id'];
            sp.play( { device_id: deviceID, uris: [str]}).then((data)=>{
                console.log("Playing");
            });
        });

        
    }

    playNext(){}
}

module.exports = Room