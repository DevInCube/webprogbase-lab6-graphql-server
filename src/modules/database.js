const mongoose = require('mongoose');
const ObjectId = mongoose.mongo.ObjectId;

const {UserModel, ChatRoomModel} = require('../models');

module.exports = {
    async connect(url) {
        return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
    },

    async createUser(username, passwordHash) {
        const userDoc = await UserModel.create({
            username,
            passwordHash,
        });
        return userDoc;
    },

    async getUsers() {
        return UserModel.find();
    },

    async getUserById(id) {
        const objectId = new ObjectId(id);
        return UserModel.findById(objectId);
    },

    async getUserByUsername(username) {
        return UserModel.findOne({ username });
    },

    async getRooms() {
        return ChatRoomModel.find();
    },

    async getUserRooms(userId) {
        return ChatRoomModel.find({ owner: new ObjectId(userId) });
    },

    async createRoom(owner, name) {
        if (!owner) throw new Error(`Empty owner`);
        if (!name) throw new Error(`Empty name`);

        const roomDoc = await ChatRoomModel.create({
            name,
            owner: owner.id,
        })
        return roomDoc;
    },

    async getRoom(id) {
        return ChatRoomModel.findById(new ObjectId(id)).populate("owner");
    },

    async getRoomByName(name) {
        return ChatRoomModel.findOne({ name });
    },

    async getMembers(roomId) {
        return UserModel.find({ currentRoom: new ObjectId(roomId) });
    },

    async updateRoom(id, name) {
        const objectId = new ObjectId(id);
        await ChatRoomModel.findByIdAndUpdate(objectId, { name });
        return ChatRoomModel.findById(objectId);
    },

    async deleteRoom(id) {
        const roomDoc = await ChatRoomModel.findByIdAndDelete(new ObjectId(id));
        return roomDoc;
    },

    async createMessage(author, room, text) {
        room.messages.push({
            author: author.id,
            room: room.id,
            text,
        });
        await room.save();
        return room.messages[room.messages.length - 1];
    },
}