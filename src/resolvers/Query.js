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
    async usernameExists(_, {username}, {database}) {
        const existingUser = await database.getUserByUsername(username);
        return !!existingUser;
    },
    async register(_, {username, password}, {database}) {
        const existingUser = await database.getUserByUsername(username);
        if (existingUser) {
            throw new UserInputError("User with this username already exists.");
        }

        const newUser = await database.createUser(username, await auth.createHash(password));
        const result = { 
            id: newUser.id, 
            username: newUser.username,
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
    async users(_, {}, {database, isLoggedIn}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("Not authorized");
        }

        return database.getUsers();
    },
    async rooms(_, {}, {database, isLoggedIn}) {
        if (!isLoggedIn) {
            throw new AuthenticationError("Not authorized");
        }

        return database.getRooms();
    },
}