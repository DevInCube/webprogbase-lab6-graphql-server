const { withFilter, AuthenticationError } = require('apollo-server');

module.exports = {
  roomCreated: {
    subscribe: (_, args, { pubsub }) => 
        pubsub.asyncIterator(["ROOM_CREATED"]),
  },
  roomUpdated: {
    subscribe: (_, args, { pubsub }) => 
        pubsub.asyncIterator(["ROOM_UPDATED"]),
  },
  roomDeleted: {
    subscribe: (_, args, { pubsub }) => 
        pubsub.asyncIterator(["ROOM_DELETED"]),
  },
  currentRoomChanged: {
    subscribe: (_, args, context) => withFilter(
        (_, args, { pubsub, isLoggedIn }) => {
            if (!isLoggedIn) {
                throw new AuthenticationError("User not authenticated.");
            }

            return pubsub.asyncIterator(["CURRENT_ROOM_CHANGED"]);
        },
        async ({currentRoomChanged}, variables) => {
            const user = await context.getUser();
            return currentRoomChanged.id === user.id;
        })(_, args, context)
  },
  memberJoined: {
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["MEMBER_JOINED"]),
  },
  memberLeft: {
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["MEMBER_LEFT"]),
  },
  messageCreated: {
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["MESSAGE_CREATED"]),
  },
}; 
