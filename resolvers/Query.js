const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const config = require('./../config');

module.exports = {
    me: (parent, args, context) => {
        const {isLoggedIn, getUser} = context;
        if (!isLoggedIn) {
            throw new AuthenticationError("Not authorized");
        }

        return getUser();
    },
    login: (parent, {login, password}, context) => {
        const fakeId = Math.random() * 100000 | 0;
        const fakeUser = {
            id: fakeId,
            login,
        };
        const token = jwt.sign(fakeUser, config.jwtSecret);
        return token;
    }
}