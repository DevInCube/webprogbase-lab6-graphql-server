module.exports = {
    async timestamp(room, {}, {}) {
        return new Date(room.timestamp).toISOString();
    },
    async owner(room, {}, {database}) {
        return database.getUserById(room.owner);
    },
    async members(room, {}, {database}) {
        return database.getMembers(room.id);
    },
    async lastMessages(room, {}, {}) {
        const count = 10;
        return room.messages.slice(Math.max(room.messages.length - count, 0));
    }
}