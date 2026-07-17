import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'

test('form calls createBlog with correct data when submitted', async () => {
  const mockCreateBlog = vi.fn()

  render(<CreateBlog createBlog={mockCreateBlog} />)

  const user = userEvent.setup()

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'Testing blog creation')
  await user.type(inputs[1], 'Test Author')
  await user.type(inputs[2], 'https://testblog.com')

  await user.click(screen.getByText('create'))

  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0]).toEqual({
    title: 'Testing blog creation',
    author: 'Test Author',
    url: 'https://testblog.com'
  })
})