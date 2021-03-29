const jwt = require('jsonwebtoken');
const config = require('./../config');

module.exports = {
    me: (parent, args, context) => {
        console.log(context);
        if (!context.user) {
            throw new Error("Not authorized");
        }

        return context.user;
    },
    login: (parent, {login, password}, context) => {
        const token = jwt.sign({login}, config.jwtSecret);
        return token;
    }
}