import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const mockText = 'testing a form...'
  const createNote = vi.fn() //para simular una función
  const user = userEvent.setup()

  //   const { container } = render(<NoteForm createNote={createNote} />)
  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write note content here')
  //   const input = container.querySelector('#note-input')
  const sendButton = screen.getByText('save')

  await user.type(input, mockText)
  await user.click(sendButton)

  console.log(createNote.mock.calls)

  expect(createNote.mock.calls).toHaveLength(1) //Para probar que la función simulada se llama al menos una vez.
  expect(createNote.mock.calls[0][0].content).toBe(mockText)
})
