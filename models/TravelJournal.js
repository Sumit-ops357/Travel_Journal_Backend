const mongoose = require('mongoose');

const ItineraryDaySchema = new mongoose.Schema({
    day: Number,
    activities: [String]
}, { _id: false }); // Prevent auto _id on subdocs

const journalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photos: [{
        type: String
    }],
    map: {
        type: String
    },
    location: {
        type: String
    },
    itinerary: [ItineraryDaySchema], // <-- FIXED
    hiddenGem: {
        type: Boolean,
        default: false
    },
    upvotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TravelJournal', journalSchema);
