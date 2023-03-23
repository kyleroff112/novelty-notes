const express = require('express');
const path = require('path');
const database = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    database.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(database), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving new note');
        }
        res.json(newNote);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteIndex = database.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).send('Note not found');
    }

    database.splice(noteIndex, 1);

    fs.writeFile('./db/db.json', JSON.stringify(database), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting note');
        }
        res.sendStatus(204);
    });
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
