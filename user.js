const users = {};

exports.createUser = function (username, roomID, socketID) {
    let user = users[socketID];
    if (user) {
        return { error: "Username already taken." }
    } else {
        users[socketID] = { username: username, roomID: roomID }
        return { username: username, roomID: roomID }
    }
}

exports.removeUser = function (socketID) {
    let user = users[socketID];
    if (user) delete users[socketID];
    else return { error: "User doesn't exist." }
}

exports.getUser = function (socketID) {
    let user = users[socketID];
    if (user) return user;
    else return { error: "User doesn't exist." }
}
