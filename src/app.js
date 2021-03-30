const fs = require("fs");
const { PubSub, ApolloServer } = require("apollo-server");
const auth = require('./modules/auth');
const database = require('./modules/database');

const pubsub = new PubSub();

const resolvers = {
    Query: require("./resolvers/Query"),
    Mutation: require("./resolvers/Mutation"),
    Subscription: require("./resolvers/Subscription"),
    //
    User: require("./resolvers/User"),
    ChatRoom: require("./resolvers/ChatRoom"),
    ChatMessage: require("./resolvers/ChatMessage"),
};

const server = new ApolloServer({
    cors: true,
    typeDefs: fs.readFileSync("./schema.gql").toString(),
    resolvers,
    context: (expressContext) => {
        const token = (expressContext.req)
            ? expressContext.req.headers.authorization
            : "";
        return {
            pubsub,
            database,
            isLoggedIn: !!token,
            async getUser() {
                const tokenUser = auth.getUser(token);
                return database.getUserById(tokenUser.id);
            },
        };
    },
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
