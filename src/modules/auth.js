const config = require('../config');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

async function getCredentials(authorization = "") {
    if (!authorization) {
        return null;
    }

    const INVALID_TOKEN = "Invalid token: only Basic or Bearer are supported.";
    const parts = authorization.split(' ');
    if (parts.length != 2) {
        throw new Error(INVALID_TOKEN);
    }

    const type = parts[0];
    const token = parts[1];

    switch (type) 
    {
        case "Bearer":
            return {
                type,
                payload: jwt.verify(token, config.jwtSecret),
            };
        case "Basic":
            const tokenParts = Buffer.from(token, 'base64').toString().split(':');
            return {
                type,
                payload: {
                    username: tokenParts[0],
                    password: tokenParts[1],
                }
            }
        default: 
            throw new Error(INVALID_TOKEN);
    }
}

async function getUser(credentials, database) {
    if (!credentials) {
        return null;
    }

    if (credentials.type === "Bearer") {
        return await database.getUserById(credentials.payload.id);
    } else if (credentials.type === "Basic") {
        const user = await database.getUserByUsername(credentials.payload.username);
        if (!user) {
            return null;
        }

        const hash = await createHash(credentials.payload.password);
        if (user.passwordHash !== hash) {
            return null;
        }

        return user;
    }

    throw new Error(INVALID_TOKEN);
}

async function createHash(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = {
    getCredentials,
    getUser,
    createHash,
};