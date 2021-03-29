module.exports = {
    postCreated: {
      // More on pubsub below
      subscribe: (parent, args, context) => 
        context.pubsub.asyncIterator(['POST_CREATED'])
    },
  };