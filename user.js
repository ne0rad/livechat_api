const users = {};

exports.createUser = function (username, roomID, socketID) {
    username = username.trim();
    roomID = roomID.trim();
    let userExists = false;
    for (const [key, value] of Object.entries(users)) {
        if (value.username.toLowerCase() == username.toLowerCase()) {
            userExists = true;
            break;
        }
    }
    if (userExists) {
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
