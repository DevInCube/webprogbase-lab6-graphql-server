const { AuthenticationError, ForbiddenError } = require("apollo-server");
const { deleteRoom } = require("../modules/database");

module.exports = {
    async createRoom(_, {name}, {pubsub, database, isLoggedIn, getUser}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("user should be logged in");
        }

        const owner = await getUser();
        const newRoom = await database.createRoom(owner, name);
        pubsub.publish('ROOM_CREATED', { roomCreated: newRoom });
        return newRoom;
    },

    async deleteRoom(_, {id}, {pubsub, database, isLoggedIn, getUser}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("user should be logged in");
        }

        const user = await getUser();
        const room = await database.getRoom(id);
        if (!room) {
            return null;
        }

        if (room.owner.id !== user.id) {
            throw new ForbiddenError("this user is not an owner of this room");
        }

        const deletedRoom = await database.deleteRoom(id);
        pubsub.publish('ROOM_DELETED', { roomDeleted: deletedRoom });
        return deletedRoom;
    },
};