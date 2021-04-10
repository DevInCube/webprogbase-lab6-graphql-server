const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.mongo.ObjectId;

const SchemaUser = new Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    currentRoom: { type: ObjectId, ref: "ChatRoom" },
    // rooms
});

module.exports = SchemaUser;