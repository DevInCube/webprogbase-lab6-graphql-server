module.exports = {
  roomCreated: {
    subscribe: (_, args, { pubsub }) => 
        pubsub.asyncIterator(["ROOM_CREATED"]),
  },
  roomDeleted: {
    subscribe: (_, args, { pubsub }) => 
        pubsub.asyncIterator(["ROOM_DELETED"]),
  },
  messageCreated: {
    subscribe: (_, args, { pubsub }) =>
        pubsub.asyncIterator(["MESSAGE_CREATED"]),
  },
}; 
