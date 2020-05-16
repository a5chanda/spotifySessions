class Member{
    constructor(user){
        this.name = user.name,
        this.isHost = user.isHost,
        this.authToken = user.authToken,
        this.userID = user['id'] ? user['id'] : ""
    }
    updateToken(token){
        this.authToken = token;
    }
}

module.exports = Member;