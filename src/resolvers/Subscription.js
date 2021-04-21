const { withFilter, AuthenticationError } = require('apollo-server');
const {USER_NOT_AUTHENTICATED} = require('./../constants/errors');

module.exports = {
  roomCreated: {
    subscribe: (_, args, { user, pubsub }) => {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        return pubsub.asyncIterator(["ROOM_CREATED"]);
    }
  },
  roomUpdated: {
    subscribe: (_, args, { user, pubsub }) => {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        return pubsub.asyncIterator(["ROOM_UPDATED"]);
    }
  },
  roomDeleted: {
    subscribe: (_, args, { user, pubsub }) => {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        return pubsub.asyncIterator(["ROOM_DELETED"]);
    }
  },
  currentRoomChanged: {
    subscribe: (_, args, context) => withFilter(
        (_, args, { user, pubsub }) => {
            if (!user) {
                throw new AuthenticationError(USER_NOT_AUTHENTICATED);
            }

            return pubsub.asyncIterator(["CURRENT_ROOM_CHANGED"]);
        },
        async ({currentRoomChanged}, variables) => {
            return currentRoomChanged.id === context.user.id;
        })(_, args, context)
  },
  memberJoined: {
    subscribe: (_, args, context) => withFilter(
        (_, args, { user, pubsub }) => {
            if (!user) {
                throw new AuthenticationError(USER_NOT_AUTHENTICATED);
            }

            return pubsub.asyncIterator(["MEMBER_JOINED"]);
        },
        async ({messageCreated, roomId}, variables, {user, database}) => {
            const currentUser = await database.getUserById(user.id);
            return currentUser.currentRoom.equals(roomId);
        })(_, args, context)
  },
  memberLeft: {
    subscribe: (_, args, context) => withFilter(
        (_, args, { user, pubsub }) => {
            if (!user) {
                throw new AuthenticationError(USER_NOT_AUTHENTICATED);
            }

            return pubsub.asyncIterator(["MEMBER_LEFT"]);
        },
        async ({messageCreated, roomId}, variables, {user, database}) => {
            const currentUser = await database.getUserById(user.id);
            return currentUser.currentRoom.equals(roomId);
        })(_, args, context)
  },
  messageCreated: {
    subscribe: (_, args, context) => withFilter(
        (_, args, { user, pubsub }) => {
            if (!user) {
                throw new AuthenticationError(USER_NOT_AUTHENTICATED);
            }

            return pubsub.asyncIterator(["MESSAGE_CREATED"]);
        },
        async ({messageCreated, roomId}, variables, {user, database}) => {
            const currentUser = await database.getUserById(user.id);
            return currentUser.currentRoom.equals(roomId);
        })(_, args, context)
  },
}; 
