let mongoose = require('mongoose');

// event schema
let eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
});

let Event = module.exports = mongoose.model('Event', eventSchema);