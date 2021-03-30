const { v4: uuidv4 } = require('uuid');

const fakeUser1 = {
    id: uuidv4(),
    username: "fakeUser1",
    currentRoom: null,
};
const fakeUser2 = {
    id: uuidv4(),
    username: "fakeUser2",
    currentRoom: null,
};

module.exports = {
    users: [
        fakeUser1,
        fakeUser2,
    ],
    rooms: [
        {
            id: uuidv4(),
            name: "fake-room-1",
            owner: fakeUser1,
            members: [],
            messages: [
                {
                    id: uuidv4(),
                    timestamp: new Date().toISOString(),
                    author: fakeUser1,
                    text: "I am fakeUser1, everyone!",
                }
            ],
        },
    ],

    async createUser(username, passwordHash) {
        const newUser = {
            id: uuidv4(),
            username,
            passwordHash,
            rooms: [],
            currentRoom: null,
        };

        this.users.push(newUser);
        return newUser;
    },

    async getUsers() {
        return this.users;
    },

    async getUserById(id) {
        return this.users.find(x => x.id === id);
    },

    async getUserByUsername(username) {
        return this.users.find(x => x.username === username);
    },

    async getUserByUsernameAndHash(username, passwordHash) {
        return this.users.find(x => x.username === username && x.passwordHash === passwordHash);
    },

    async getRooms() {
        return this.rooms;
    },

    async getUserRooms(userId) {
        return this.rooms.filter(x => x.owner.id === userId);
    },

    async getMessageRoom(messageId) {
        return this.rooms.find(x => x.messages.find(m => m.id === messageId)); 
    },

    async createRoom(owner, name) {
        const newRoom = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            name,
            owner,
            members: [],
            messages: [],
        };
        this.rooms.push(newRoom);
        return newRoom;
    },

    async getRoom(id) {
        return this.rooms.find(x => x.id === id);
    },

    async updateRoom(id, name) {
        const index = this.rooms.findIndex(x => x.id === id);
        if (index >= 0) {
            const updated = this.rooms[index];
            updated.name = name;
            return updated;
        }

        return null;
    },

    async deleteRoom(id) {
        const index = this.rooms.findIndex(x => x.id === id);
        if (index >= 0) {
            const deleted = this.rooms[index];
            this.rooms.splice(index, 1);
            return deleted;
        }

        return null;
    },

    async createMessage(author, room, text) {
        const newMessage = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            text,
            author,
            room,
        };
        room.messages.push(newMessage);
        return newMessage;
    },
}