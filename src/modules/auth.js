const config = require('../config');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

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

async function createHash(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = {
    getUser,
    createHash,
};