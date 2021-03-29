const fs = require("fs");
const { PubSub, ApolloServer } = require("apollo-server");
const auth = require('./auth');

const pubsub = new PubSub();

const resolvers = {
  Query: require("./resolvers/Query"),
  Mutation: require("./resolvers/Mutation"),
  Subscription: require("./resolvers/Subscription"),
};

const server = new ApolloServer({
  cors: true,
  typeDefs: fs.readFileSync("./schema.gql").toString(),
  resolvers,
  context: (expressContext) => {
    const token = expressContext.req.headers.authorization;
    return {
        pubsub,
        isLoggedIn: !!token,
        getUser() {
            return auth.getUser(token);
        },
    };
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
