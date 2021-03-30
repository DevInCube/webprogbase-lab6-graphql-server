const { v4: uuidv4 } = require('uuid');

const fakeUser1 = {
    id: uuidv4(),
    username: "fakeUser1",
};
const fakeUser2 = {
    id: uuidv4(),
    username: "fakeUser2",
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
        const fakeId = Math.random() * 100000 | 0;
        const fakeUser = {
            id: fakeId,
            username,
            passwordHash,
        };

        this.users.push(fakeUser);
        return fakeUser;
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
        console.log(passwordHash, this.users)
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

    async deleteRoom(id) {
        const index = this.rooms.findIndex(x => x.id === id);
        if (index >= 0) {
            const deleted = this.rooms[index];
            this.rooms.splice(index, 1);
            return deleted;
        }

        return null;
    }
}