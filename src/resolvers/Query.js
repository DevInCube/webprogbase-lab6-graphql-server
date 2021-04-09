const { AuthenticationError, UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const auth = require('../modules/auth');
const {
    USER_NOT_AUTHENTICATED,
    INVALID_CREDENTIALS,
    USER_ALREADY_EXISTS,
} = require('./../constants/errors');

module.exports = {
    async me(_, {}, {user}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }
        
        return user;
    },
    async usernameExists(_, {username}, {database}) {
        const existingUser = await database.getUserByUsername(username);
        return !!existingUser;
    },
    async register(_, {username, password}, {database}) {
        const existingUser = await database.getUserByUsername(username);
        if (existingUser) {
            throw new UserInputError(USER_ALREADY_EXISTS);
        }

        const newUser = await database.createUser(username, await auth.createHash(password));
        const result = { 
            id: newUser.id, 
            username: newUser.username,
            timestamp: newUser.timestamp,
            rooms: [],
            currentRoom: null,
        };
        return result;
    },
    async login(_, {username, password}, {database}) {
        const user = await database.getUserByUsernameAndHash(username, await auth.createHash(password));
        if (!user) {
            throw new UserInputError(INVALID_CREDENTIALS);
        }

        const tokenPayload = { 
            id: user.id, 
            username: user.username,
        };
        const token = jwt.sign(tokenPayload, config.jwtSecret);
        return token;
    }, 
    async users(_, {}, {database, user}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        return database.getUsers();
    },
    async rooms(_, {}, {database, user}) {
        if (!user) {
            throw new AuthenticationError(USER_NOT_AUTHENTICATED);
        }

        return database.getRooms();
    },
}