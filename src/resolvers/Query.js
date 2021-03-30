const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const config = require('./../config');

module.exports = {
    async me(parent, args, context) {
        const {isLoggedIn, getUser} = context;
        if (!isLoggedIn) {
            throw new AuthenticationError("Not authorized");
        }

        return getUser();
    },
    async login(parent, {username, password}, context) {
        const fakeId = Math.random() * 100000 | 0;
        const fakeUser = {
            id: fakeId,
            username,
        };
        const token = jwt.sign(fakeUser, config.jwtSecret);
        return token;
    },
    async users(_, {}, {database}) {
        return database.getUsers();
    },
    async rooms(_, {}, {database}) {
        return database.getRooms();
    }
}