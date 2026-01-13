require('dotenv').config()
const cors = require('cors')
const express = require('express')

const Note = require('./models/note')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//All notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

//Create note
app.post('/api/notes', (req, res) => {
  const body = req.body

  if (body.content === undefined || body.important === undefined) {
    return res.status(404).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    res.json(savedNote)
  })
})

//Get a single note
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    res.json(note)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
