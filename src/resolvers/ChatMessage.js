module.exports = {
    async room(message, {}, {database}) {
        return database.getMessageRoom(message.id);
    }
}