module.exports = {
    async timestamp(message, {}, {}) {
        return new Date(message.timestamp).toISOString();
    },
    async author(message, {}, {database}) {
        return database.getUserById(message.author);
    },
    async room(message, {}, {database}) {
        return database.getRoom(message.room);
    }
}