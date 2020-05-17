class Member{
    constructor(user){
        this.name = user.user,
        this.isHost = user.isHost,
        this.authToken = user.authToken,
        this.expTime = parseFloat(user.expirationTime),
        this.userID = user['id'] ? user['id'] : ""
    }
    updateToken(token){
        this.authToken = token;
    }
}

module.exports = Member;