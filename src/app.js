const fs = require("fs");
const { PubSub, ApolloServer } = require("apollo-server");
const auth = require('./modules/auth');
const config = require('./config')
const database = require('./modules/database');
const resolvers = require('./resolvers/resolvers');

const pubsub = new PubSub();
const typeDefs = fs.readFileSync("./schema.gql").toString();

const server = new ApolloServer({
    cors: true,
    introspection: true,
    playground: true,
    typeDefs,
    resolvers,
    context: async ({req, connection}) => {
        const token = connection  
            ? connection.context.Authorization
            : req.headers.authorization;
        
        let user = null; 
        if (token) {
            const credentials = await auth.getCredentials(token);
            user = await auth.getUser(credentials, database);
        }
        console.log(user)

        return {
            pubsub,
            database,
            user,
        };
    },
});

server.listen(config.port).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
