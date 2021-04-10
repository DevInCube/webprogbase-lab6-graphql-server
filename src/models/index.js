const model = require('mongoose').model;

const SchemaUser = require('./user');
const SchemaChatRoom = require('./chatRoom');

module.exports = {
    UserModel: model('User', SchemaUser),
    ChatRoomModel: model('ChatRoom', SchemaChatRoom),
};