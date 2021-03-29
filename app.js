const fs = require('fs');
const { PubSub, ApolloServer } = require('apollo-server');

const pubsub = new PubSub();

const resolvers = {
    Query: require('./resolvers/Query'),
    Mutation: require('./resolvers/Mutation'),
    Subscription: require('./resolvers/Subscription'),
  };

const server = new ApolloServer({
    cors: true,
    typeDefs: fs.readFileSync('./schema.gql').toString(),
    resolvers,
    context: (req) => ({
        pubsub,
    }),
});

server
    .listen()
    .then(({ url, subscriptionsUrl }) => {
        console.log(`🚀 Server ready at ${url}`);
        console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
    });