const { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {
    USER_NOT_AUTHENTICATED,
    EMPTY_ROOM_NAME,
    ROOM_ALREADY_EXISTS,
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

        if (!name) {
            throw new UserInputError(EMPTY_ROOM_NAME);
        }

        const existingRoom = await database.getRoomByName(name);
        if (existingRoom) {
            throw new UserInputError(ROOM_ALREADY_EXISTS);
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
            throw new UserInputError(ROOM_NOT_FOUND);
        }

        if (!room.owner.equals(user.id)) {
            throw new ForbiddenError(USER_NOT_OWNER);
        }

        if (!name) {
            throw new UserInputError(EMPTY_ROOM_NAME);
        }

        const existingRoom = await database.getRoomByName(name);
        if (existingRoom) {
            throw new UserInputError(ROOM_ALREADY_EXISTS);
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
            throw new UserInputError(ROOM_NOT_FOUND);
        }

        if (!room.owner.equals(user.id)) {
            throw new ForbiddenError(USER_NOT_OWNER);
        }

        const deletedRoom = await database.deleteRoom(id);
        pubsub.publish('ROOM_DELETED', { roomDeleted: deletedRoom });

        // kick all members from deleted room
        const members = await database.getMembers(room.id);
        for (const member of members) {
            pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: member });
            member.currentRoom = null;
            await member.save();
        }

        return deletedRoom;
    },
    async joinRoom(_, {roomId}, {user, database, pubsub}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        if (user.currentRoom) {
            throw new UserInputError(USER_IN_ROOM);
        }

        const room = await database.getRoom(roomId);
        if (!room) {
            throw new UserInputError(ROOM_NOT_FOUND);
        }

        user.currentRoom = roomId;
        await user.save();
        pubsub.publish('MEMBER_JOINED', { memberJoined: user, roomId: room.id });
        pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: user });
        return room;
    },
    async leaveCurrentRoom(_, {}, {user, database, pubsub}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        if (!user.currentRoom) {
            throw new UserInputError(USER_NOT_IN_ROOM);
        }

        const room = await database.getRoom(user.currentRoom);
        if (!room) {
            throw new UserInputError(ROOM_NOT_FOUND);
        }

        user.currentRoom = null;
        await user.save();
        pubsub.publish('MEMBER_LEFT', { memberLeft: user, roomId: room.id });
        pubsub.publish('CURRENT_ROOM_CHANGED', { currentRoomChanged: user });
        return room;
    },
    async createMessage(_, {text}, {user, database, pubsub}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        if (!user.currentRoom) {
            throw new UserInputError(USER_NOT_IN_ROOM);
        }

        const room = await database.getRoom(user.currentRoom);
        if (!room) {
            throw new UserInputError(ROOM_NOT_FOUND);
        }

        const message = await database.createMessage(user, room, text);
        pubsub.publish('MESSAGE_CREATED', { messageCreated: message, roomId: room.id });
        return message;
    },
};