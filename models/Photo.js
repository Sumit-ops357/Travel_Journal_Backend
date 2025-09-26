const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    journal:  { type: mongoose.Schema.Types.ObjectId, ref: 'TravelJournal' },
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    url: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Photo', photoSchema);