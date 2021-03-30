module.exports = {
    async rooms(user, {}, {database}) {
        return database.getUserRooms(user.id);
    }
}