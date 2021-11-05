const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const GameModel = mongoose.model('Games', GameSchema);

module.exports = GameModel;