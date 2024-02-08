const path = require('path');
const express = require('express');
const router = express.Router();

// Route for /notes serving in the notes.html file. 
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'notes.html'));
});

// Default route serving in the index.html file.
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = router;