const { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const { deleteRoom } = require("../modules/database");

module.exports = {
    async createRoom(_, {name}, {pubsub, database, isLoggedIn, getUser}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("User should be logged in.");
        }

        const owner = await getUser();
        const newRoom = await database.createRoom(owner, name);
        pubsub.publish('ROOM_CREATED', { roomCreated: newRoom });
        return newRoom;
    },
    async updateRoom(_, {id, name}, {pubsub, database, isLoggedIn, getUser}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("User should be logged in.");
        }

        const user = await getUser();
        const room = await database.getRoom(id);
        if (!room) {
            return null;
        }

        if (room.owner.id !== user.id) {
            throw new ForbiddenError("This user is not an owner of this room.");
        }

        const updatedRoom = await database.updateRoom(id, name);
        pubsub.publish('ROOM_UPDATED', { roomUpdated: updatedRoom });
        return updatedRoom;
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
        // for (const user of deletedRoom.members) {
        //     pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: room });
        // }
        return deletedRoom;
    },
    async joinRoom(_, {roomId}, {isLoggedIn, getUser, database, pubsub}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("user should be logged in");
        }

        const room = await database.getRoom(roomId);
        if (!room) {
            throw new UserInputError("Room not found");
        }

        const user = await getUser();
        if (user.currentRoom) {
            throw new UserInputError("User is already in the room");
        }

        user.currentRoom = room;
        room.members.push(user);
        pubsub.publish('MEMBER_JOINED', { memberJoined: user });
        pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: user });
        return room;
    },
    async leaveCurrentRoom(_, {}, {isLoggedIn, getUser, database, pubsub}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("User should be logged in.");
        }

        const user = await getUser();
        const room = user.currentRoom;
        if (!room) {
            throw new UserInputError("User is not in the room");
        }

        room.members.splice(room.members.findIndex(x => x.id === user.id), 1);
        user.currentRoom = null;
        pubsub.publish('MEMBER_LEAVE', { memberJoined: user });
        pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: user });
        return room;
    },
};