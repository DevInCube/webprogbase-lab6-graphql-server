require('dotenv').config()

module.exports = {
    jwtSecret: process.env.JWT_SECRET || "you_should_rewrite_this",
    port: process.env.PORT || 4000,
    databaseUrl: process.env.DB_URL
};