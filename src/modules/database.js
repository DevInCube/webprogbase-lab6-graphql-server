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
            owner: fakeUser1
        },
    ],

    async getUsers() {
        return this.users;
    },

    async getRooms() {
        return this.rooms;
    },

    async getUserRooms(userId) {
        return this.rooms.filter(x => x.owner.id === userId);
    },

    async createRoom(owner, name) {
        const newRoom = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            name,
            owner,
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