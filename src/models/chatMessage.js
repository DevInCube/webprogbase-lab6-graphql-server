const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.mongo.ObjectId;

const SchemaChatMessage = new Schema({
    timestamp: { type: Date, required: true, default: Date.now },
    author: { type: ObjectId, ref: "User" },
    room: { type: ObjectId, ref: "ChatRoom" },
    text: { type: String, required: true },
});

module.exports = SchemaChatMessage;