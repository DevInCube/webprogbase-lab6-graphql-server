const fs = require("fs");
const { PubSub, ApolloServer } = require("apollo-server");
const auth = require('./modules/auth');
const config = require('./config')
const database = require('./modules/database');
const resolvers = require('./resolvers/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
    cors: true,
    typeDefs: fs.readFileSync("./schema.gql").toString(),
    resolvers,
    context: ({req, connection}) => {
        const token = connection  
            ? connection.context.Authorization
            : req.headers.authorization;
        
        return {
            pubsub,
            database,
            isLoggedIn: !!token,
            async getUser() {
                const tokenUser = await auth.getUser(token);
                return database.getUserById(tokenUser.id);
            },
        };
    },
});

server.listen(config.port).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
