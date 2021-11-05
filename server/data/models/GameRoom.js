const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameRoomSchema = new Schema({
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    chatrooms: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

const GameRoomModel = mongoose.model('GameRoom', GameRoomSchema);

module.exports = GameRoomModel;