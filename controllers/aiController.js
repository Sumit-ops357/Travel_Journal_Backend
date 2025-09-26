const axios = require("axios");
const TravelJournal = require("../models/TravelJournal");

// Generate, save & return AI Itinerary
exports.getItinerary = async (req, res) => {
  const { destination, days, interests, title, description } = req.body;
  const location = destination; // use destination for location
  const userId = req.user.id;

  try {
    // Strong prompt to get structured data
    const prompt = `
      Plan a detailed ${days}-day travel itinerary for a trip to ${destination}, for someone interested in: ${interests.join(", ")}.
      Reply ONLY in valid JSON array format, like:
      [
        { "day": 1, "activities": ["", ""] },
        { "day": 2, "activities": ["", ""] }
      ]
      No introduction, explanation, or extra text. Do not wrap your response in backticks or 'json' code fences.
    `;

    const response = await axios({
      url: process.env.GEMINI_API_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY,
      },
      data: {
        contents: [{ parts: [{ text: prompt }] }],
      },
    });

    let rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let cleanedText = rawText.replace(/^[`]+json\n?/i, "").replace(/[`]+$/g, "").trim();

    let itinerary = [];
    try {
      itinerary = JSON.parse(cleanedText);
    } catch (e) {
      itinerary = [{ error: "Could not parse JSON", text: cleanedText }];
      return res.status(400).json({ itinerary });
    }

    // Save to MongoDB (directly after generation)
    const journal = new TravelJournal({
      user: userId,
      title: title || `Trip to ${destination}`,
      description: description || '',
      location,
      itinerary,
      map: "",
      photos: [],
      hiddenGem: false,
      upvotes: 0,
    });

    const savedJournal = await journal.save();

    res.json({ success: true, itinerary, journal: savedJournal });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Generate & return AI recommendations (not saved)
exports.getRecommendations = async (req, res) => {
  const { destination, interests } = req.body;
  try {
    const prompt = `
      Suggest the top 5 must-visit places in ${destination}, based on these interests: ${interests.join(", ")}.
      Reply ONLY in valid JSON array format, like:
      [
        {
          "name": "Place Name",
          "description": "Short description.",
          "perfectFor": "Foodies, culture seekers",
          "tags": ["food", "culture"]
        }
      ]
      No introduction, explanation, or extra text. Do not wrap your response in backticks or 'json' code fences.
    `;

    const response = await axios({
      url: process.env.GEMINI_API_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY,
      },
      data: {
        contents: [{ parts: [{ text: prompt }] }],
      },
    });

    let rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let cleanedText = rawText.replace(/^[`]+json\n?/i, "").replace(/[`]+$/g, "").trim();

    let recommendations = [];
    try {
      recommendations = JSON.parse(cleanedText);
    } catch (e) {
      recommendations = [{ error: "Could not parse JSON", text: cleanedText }];
    }

    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Retrieve all itineraries for current user
exports.getUserItineraries = async (req, res) => {
  try {
    const userId = req.user.id;
    const journals = await TravelJournal.find({ user: userId });

    if (!journals || journals.length === 0)
      return res.status(404).json({ msg: "No journals found for this user" });

    const itineraries = journals
      .filter((j) => j.itinerary && j.itinerary.length > 0)
      .map((j) => ({
        _id: j._id,
        title: j.title,
        description: j.description,
        location: j.location,
        itinerary: j.itinerary,
        createdAt: j.createdAt,
      }));

    res.json({ itineraries });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Manual save endpoint for saving generated itinerary (optional)
// exports.saveItineraryToJournal = async (req, res) => {
//   try {
//     const { title, description, location, itinerary } = req.body;
//     const userId = req.user.id;

//     const journal = new TravelJournal({
//       user: userId,
//       title,
//       description,
//       location,
//       itinerary,
//       map: "",
//       photos: [],
//       hiddenGem: false,
//       upvotes: 0,
//     });

//     const savedJournal = await journal.save();
//     res.json({ success: true, journal: savedJournal });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };



//Hi i am Sumit