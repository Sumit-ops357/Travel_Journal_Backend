const express = require('express');
const router = express.Router();

const { getItinerary, getRecommendations } = require('../controllers/aiController');

const { getUserItineraries } = require('../controllers/aiController');

// const { saveItineraryToJournal } = require('../controllers/aiController');

const { authMiddleware } = require('../middleware/auth');

router.post('/itinerary', authMiddleware, getItinerary);
router.post('/recommendations', authMiddleware, getRecommendations);
router.get("/user-itineraries", authMiddleware, getUserItineraries);
// router.post("/save-itinerary", authMiddleware, saveItineraryToJournal);

module.exports = router;