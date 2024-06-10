const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date().getTime()
    },
})

const NoteModel = mongoose.model('Note', NoteSchema);

module.exports = NoteModel;