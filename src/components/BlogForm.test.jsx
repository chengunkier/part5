import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls createBlog with correct data when submitted', async () => {
  const mockCreateBlog = vi.fn()

  render(<BlogForm createBlog={mockCreateBlog} />)

  const user = userEvent.setup()

  // get all textboxes by order: title, author, url
  const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  await user.type(titleInput, 'Testing blog creation')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://testblog.com')

  // submit the form
  const createButton = screen.getByText('create')
  await user.click(createButton)

  // check that createBlog was called once
  expect(mockCreateBlog.mock.calls).toHaveLength(1)

  // check that createBlog was called with the correct data
  expect(mockCreateBlog.mock.calls[0][0]).toEqual({
    title: 'Testing blog creation',
    author: 'Test Author',
    url: 'https://testblog.com'
  })
})