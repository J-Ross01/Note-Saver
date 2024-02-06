const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dbFilePath = path.join(__dirname, '..', 'db', 'db.json');

const readData = async () => {
    const data = await fs.promises.readFile(dbFilePath, 'utf8');
    return JSON.parse(data);
};

const writeData = async (notes) => {
    await fs.promises.writeFile(dbFilePath, JSON.stringify(notes, null, 2), 'utf8');
};

router.get('/notes', async (req, res) => {
    try {
        const notes = await readData();
        res.json(notes);
    } catch (err) {
        res.status(500).send(err);
    }
});

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
