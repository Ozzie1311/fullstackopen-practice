const config = require('./utils/config');
const logger = require('./utils/logger');
const cors = require('cors');
const express = require('express');
const Note = require('./models/note');

const app = express();

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(requestLogger);

// --Routes-- //

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

//All notes
app.get('/api/notes', (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

//Create note
app.post('/api/notes', (req, res, next) => {
    const body = req.body;

    if (!body.content || !body.important) {
        return res.status(400).json({ error: 'content missing' });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save()
        .then((savedNote) => {
            res.json(savedNote);
        })
        .catch((error) => next(error));
});

//Get a single note
app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => next(error));
});

//Update a single note
app.put('/api/notes/:id', (req, res, next) => {
    const { content, important } = req.body;
    const id = req.params.id;

    const newNote = {
        content,
        important,
    };

    Note.findByIdAndUpdate(id, newNote, {
        new: true,
        runValidators: true,
        context: 'query',
    })
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((error) => next(error));
});

//Delete a single note
app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(config.PORT);
logger.info(`Server running on port ${config.PORT}`);
