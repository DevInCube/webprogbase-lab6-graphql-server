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
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["CURRENT_ROOM_CHANGED"]),
  },
  memberJoined: {
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["MEMBER_JOINED"]),
  },
  messageCreated: {
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["MESSAGE_CREATED"]),
  },
}; 
