const Photo = require('../models/Photo');
const TravelJournal = require('../models/TravelJournal');

// Handle photo upload
exports.uploadPhoto = async (req, res) => {

    try {
        
        const file = req.file;
        
        if(!file)
            return res.status(400).json({ msg: "No file uploaded" });

        const { journalId } = req.body;

        const photo = new Photo({
            
            journal: journalId,
            user: req.user.id,
            url: `/uploads/${file.filename}`,
        });

        await photo.save();

        // Also add photo URL directly to the journal's photos array
        if (journalId) {
              await TravelJournal.findByIdAndUpdate(journalId, {
              $push: { photos: `/uploads/${file.filename}` },
           });
        }

        res.status(201).json({ url: `/uploads/${file.filename}` });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}


//400 - bad request  (eg:-  Syntax error and many more)
//404 - not found