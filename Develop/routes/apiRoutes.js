const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Sets path for db.json file which will be the database for storing notes. 
const dbFilePath = path.join(__dirname, '..', 'db', 'db.json');

// Function to read and parse the data in the db.json file.
const readData = async () => {
    const data = await fs.promises.readFile(dbFilePath, 'utf8');
    return JSON.parse(data);
};

// Function to write the data as JSON into the db.json file.
const writeData = async (notes) => {
    await fs.promises.writeFile(dbFilePath, JSON.stringify(notes, null, 2), 'utf8');
};

// Route function to get all notes and handle any errors while doing so. 
router.get('/notes', async (req, res) => {
    try {
        const notes = await readData();
        res.json(notes);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route function to create a new note and handle any errors while doing so.. 
router.post('/notes', async (req, res) => {
    try {
        const notes = await readData();
        const newNote = { id: uuidv4(), ...req.body };
        notes.push(newNote);
        await writeData(notes);
        res.json(newNote);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route function to delete a note by its id and handle any errors while doing so.. 
router.delete('/notes/:id', async (req, res) => {
    try {
        const notes = await readData();
        const filteredNotes = notes.filter(note => note.id !== req.params.id);
        await writeData(filteredNotes);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
