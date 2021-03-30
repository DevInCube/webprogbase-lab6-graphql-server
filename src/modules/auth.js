const config = require('../config');
const jwt = require('jsonwebtoken');

async function getUser(token = "") {
    if (!token) {
        return null;
    }

    if (!token.startsWith("Bearer ")) {
        return null;
    }

    token = token.substring("Bearer ".length);
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
}

module.exports = {
    getUser,
};