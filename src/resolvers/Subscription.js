const { withFilter, AuthenticationError } = require('apollo-server');
const {USER_NOT_AUTHENTICATED} = require('./../constants/errors');

async function userIsRoomMember(user, room) {
    return !!room.members.find(m => m.id === user.id);
}

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
        async ({memberJoined}, variables) => {
            return userIsRoomMember(context.user, memberJoined.currentRoom);
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
        async ({memberLeft}, variables) => {
            return userIsRoomMember(context.user, memberLeft.currentRoom);
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
        async ({messageCreated}, variables) => {
            return userIsRoomMember(context.user, messageCreated.room);
        })(_, args, context)
  },
}; 
