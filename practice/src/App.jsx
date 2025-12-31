import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNotes, setNewNotes] = useState('new note...')
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    axios.get('http://localhost:3001/notes').then((response) => {
      console.log(response)
      setNotes(response.data)
    })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    const newNote = {
      content: newNotes,
      important: Math.random() < 0.5,
    }

    axios.post('http://localhost:3001/notes', newNote).then((response) => {
      console.log(response)
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

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <>
      <h1>Notes</h1>
      <button onClick={changeFilter}>{showAll ? 'show important' : 'show all'}</button>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>{note.content}</li>
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
