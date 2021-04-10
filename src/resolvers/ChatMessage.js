module.exports = {
    async timestamp(message, {}, {}) {
        return new Date(message.timestamp).toISOString();
    },
    async room(message, {}, {database}) {
        return database.getRoom(message.room);
    }
}