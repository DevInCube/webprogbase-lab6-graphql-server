module.exports = {
    async timestamp(user, {}, {}) {
        return new Date(user.timestamp).toISOString();
    },
    async currentRoom(user, {}, {database}) {
        return database.getRoom(user.currentRoom);  
    },
    async rooms(user, {}, {database}) {
        return database.getUserRooms(user.id);
    }
}