const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.mongo.ObjectId;

const SchemaChatMessage = require('./chatMessage');

const SchemaChatRoom = new Schema({
    name: { type: String, required: true, unique: true },
    owner: { type: ObjectId, ref: "User" },
    timestamp: { type: Date, required: true, default: Date.now },
    messages: {
        type: [SchemaChatMessage],
        default: [],
    },
    // members
});

module.exports = SchemaChatRoom;