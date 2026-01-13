const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
  return maxId + 1
}

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(404).json({
      error: 'content missing',
    })
  }

  const newObj = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = [...notes, newObj]

  res.json(newObj)
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const body = req.body

  const noteIndex = notes.findIndex((note) => note.id === id)

  if (noteIndex === -1) {
    return res.status(404).end()
  }

  const updatedNote = {
    ...notes[noteIndex],
    content: body.content,
    important: body.important,
  }

  notes[noteIndex] = updatedNote

  res.json(updatedNote)
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
