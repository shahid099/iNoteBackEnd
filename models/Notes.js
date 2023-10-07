const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'createUser'
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: 'personal',
    },
    date: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("notes", notesSchema);