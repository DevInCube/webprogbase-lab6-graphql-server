const { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {
    USER_NOT_AUTHENTICATED,
    USER_IN_ROOM,
    USER_NOT_IN_ROOM,
    USER_NOT_OWNER,
    ROOM_NOT_FOUND,
} = require('./../constants/errors');

module.exports = {
    async createRoom(_, {name}, {pubsub, database, user}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        const newRoom = await database.createRoom(user, name);
        pubsub.publish('ROOM_CREATED', { roomCreated: newRoom });
        return newRoom;
    },
    async updateRoom(_, {id, name}, {pubsub, database, user}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        const room = await database.getRoom(id);
        if (!room) {
            return null;
        }

        if (room.owner.id !== user.id) {
            throw new ForbiddenError(USER_NOT_OWNER);
        }

        const updatedRoom = await database.updateRoom(id, name);
        pubsub.publish('ROOM_UPDATED', { roomUpdated: updatedRoom });
        return updatedRoom;
    },
    async deleteRoom(_, {id}, {pubsub, database, user}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        const room = await database.getRoom(id);
        if (!room) {
            return null;
        }

        if (room.owner.id !== user.id) {
            throw new ForbiddenError(USER_NOT_OWNER);
        }

        const deletedRoom = await database.deleteRoom(id);
        pubsub.publish('ROOM_DELETED', { roomDeleted: deletedRoom });

        // kick all members from deleted room
        for (const member of deletedRoom.members) {
            pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: member });
            member.currentRoom = null;
        }

        return deletedRoom;
    },
    async joinRoom(_, {roomId}, {user, database, pubsub}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        const room = await database.getRoom(roomId);
        if (!room) {
            throw new UserInputError(ROOM_NOT_FOUND);
        }

        if (user.currentRoom) {
            throw new UserInputError(USER_IN_ROOM);
        }

        user.currentRoom = room;
        room.members.push(user);
        pubsub.publish('MEMBER_JOINED', { memberJoined: user });
        pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: user });
        return room;
    },
    async leaveCurrentRoom(_, {}, {user, database, pubsub}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        const room = user.currentRoom;
        if (!room) {
            throw new UserInputError(USER_NOT_IN_ROOM);
        }

        room.members.splice(room.members.findIndex(x => x.id === user.id), 1);
        pubsub.publish('MEMBER_LEAVE', { memberLeft: user });
        user.currentRoom = null;
        pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: user });
        return room;
    },
    async createMessage(_, {text}, {user, database, pubsub}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        const room = user.currentRoom;
        if (!room) {
            throw new UserInputError(USER_NOT_IN_ROOM);
        }

        const message = await database.createMessage(user, room, text);
        pubsub.publish('MESSAGE_CREATED', { messageCreated: message });
        return message;
    },
};