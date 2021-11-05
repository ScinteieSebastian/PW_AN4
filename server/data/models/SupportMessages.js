const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupportMessagesSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: false
    },
    impFlag: {
        type: Boolean,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }

}, { timestamps: true });

const SupportMessagesModel = mongoose.model('SupportMessages', SupportMessagesSchema);
module.exports = SupportMessagesModel;