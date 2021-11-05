
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Authors',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    genres: [{
        type: String,
        enum: ['horror', 'fiction', 'romance', 'science-fiction', 'fantasy', 'philosophy', 'biography'],
        default: 'fiction'
    }]

}, { timestamps: true });

const BookModel = mongoose.model('Books', BookSchema);
module.exports = BookModel;
