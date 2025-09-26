const express = require('express');
const router = express.Router();

const {
    createJournal,
    getAllJournals,
    getJournalById,
    upvoteJournal
} = require('../controllers/journalController');

const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createJournal);
router.get('/', getAllJournals);
router.get('/:id', getJournalById);
router.post('/:id/upvote', authMiddleware, upvoteJournal);

module.exports = router;