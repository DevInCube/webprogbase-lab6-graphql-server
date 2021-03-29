const jwt = require('jsonwebtoken');
const config = require('./../config');

async function getUser(req) {
    const token = (req.headers.authorization || "").substring("Bearer ".length);
    if (!token) {
        throw new Error("Not authenticated");
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
}

module.exports = {
    me: (parent, args, context) => {
        const {req} = context;
        const user = getUser(req);
        
        if (!user) {
            throw new Error("Not authorized");
        }

        return user;
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