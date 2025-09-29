const TravelJournal = require('../models/TravelJournal');

//Create a new travel journal entry
exports.createJournal = async (req,res) => {

    try {
        
        const { title, description, photos, map, location,itinerary, hiddenGem } = req.body;

        const journal = new TravelJournal({

            user: req.user.id,
            title,
            description,
            photos,
            map,
            location,
            itinerary,
            hiddenGem: hiddenGem || false
        });

        await journal.save();
        res.status(201).json(journal);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}





//Get all journals
exports.getAllJournals = async (req,res) => {

    try {
        const journals = await TravelJournal.find()
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 });   //Sort in descending order ...so that newest journal comes first

        res.json(journals);

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};



// Get particular journal by its id

exports.getJournalById = async (req, res) => {
    try {
        const journal = await TravelJournal.findById(req.params.id)
        .populate('user', 'username avatar');

        if(!journal)
            return res.status(404).json({ msg: "Journal not found" });

        res.json(journal);

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


// Upvote a journal
exports.upvoteJournal = async (req, res) => {

    try {
        
        const journal = await TravelJournal.findById(req.params.id);

        if(!journal)
            return res.status(404).json({ msg: "Journal not found" });

        journal.upvotes +=1;
        await journal.save();

        res.json({ upvotes: journal.upvotes });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}