const { AuthenticationError, UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const auth = require('../modules/auth');

module.exports = {
    async me(_, {}, {isLoggedIn, getUser}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("Not authorized");
        }

        return getUser();
    },
    async register(_, {username, password}, {database}) {
        const existingUser = await database.getUserByUsername(username);
        if (existingUser) {
            throw new UserInputError("user with this username already exists");
        }

        const fakeUser = await database.createUser(username, await auth.createHash(password));
        const result = { 
            id: fakeUser.id, 
            username: fakeUser.username,
        };
        return result;
    },
    async login(_, {username, password}, {database}) {
        const user = await database.getUserByUsernameAndHash(username, await auth.createHash(password));
        if (!user) {
            throw new UserInputError("Invalid credentials");
        }

        const tokenPayload = { 
            id: user.id, 
            username: user.username,
        };
        const token = jwt.sign(tokenPayload, config.jwtSecret);
        return token;
    }, 
    async users(_, {}, {database}) {
        return database.getUsers();
    },
    async rooms(_, {}, {database}) {
        return database.getRooms();
    }
}