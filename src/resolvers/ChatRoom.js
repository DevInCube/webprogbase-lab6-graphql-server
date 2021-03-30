module.exports = {
    async lastMessages(room, {}, {}) {
        const count = 10;
        return room.messages.slice(Math.max(room.messages.length - count, 0));
    }
}