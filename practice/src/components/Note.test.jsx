import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  //   const { container } = render(<Note note={note} />)

  render(<Note note={note} />)
  //   const element = screen.getByText(note.content, { exact: false })
  const element = screen.findByText(note.content)

  //   screen.debug(element)
  //   const element = screen.getByText(
  //     'Component testing is done with react-testing-library',
  //   )
  expect(element).toBeDefined()

  //   const div = container.querySelector('.note')
  //   expect(div).toHaveTextContent(note.content)
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  const mockHandler = vi.fn()

  render(<Note note={note} toggleImportance={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('does not render this', () => {
  const note = {
    content: 'this is a reminder',
    important: true,
  }

  render(<Note note={note} />)
  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
