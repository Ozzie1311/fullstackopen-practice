import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNotes, setNewNotes] = useState('new note...')
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    noteService.getAll().then((inititalNotes) => {
      setNotes(inititalNotes)
    })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    const newNote = {
      content: newNotes,
      important: Math.random() < 0.5,
    }

    noteService.create(newNote).then((newNote) => {
      setNotes([...notes, newNote])
      setNewNotes('')
    })
  }

  const handleChange = (event) => {
    setNewNotes(event.target.value)
  }

  const changeFilter = () => {
    setShowAll(!showAll)
  }

  const toggleImportance = (id) => {
    console.log(`importance of ${id} needs to be toggled`)
    const noteToEdit = notes.find((note) => note.id === id)
    const edittedNote = { ...noteToEdit, important: !noteToEdit.important }

    noteService
      .update(id, edittedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch((error) => {
        alert(
          `the note ${noteToEdit.content} was already deleted from the server`
        )
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <>
      <h1>Notes</h1>
      <button onClick={changeFilter}>
        {showAll ? 'show important' : 'show all'}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            {note.content}
            <button onClick={() => toggleImportance(note.id)}>
              {note.important ? 'make not important' : 'make important'}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={addNote}>
        Note: <input value={newNotes} onChange={handleChange} />
        <button type='submit'>save</button>
      </form>
    </>
  )
}

export default App
