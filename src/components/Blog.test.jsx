import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'https://example.com',
  likes: 5,
  user: {
    name: 'Test User',
    username: 'testuser'
  }
}

const mockUser = {
  username: 'testuser',
  name: 'Test User'
}

test('renders title and author but not url or likes by default', () => {
  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={mockUser} />)

  // title and author should be visible
  expect(screen.getByText('Component testing is done with react-testing-library Test Author')).toBeDefined()

  // url should NOT be visible by default
  expect(screen.queryByText('https://example.com')).toBeNull()

  // likes should NOT be visible by default
  expect(screen.queryByText('likes 5')).toBeNull()
})

test('url, likes and user are shown when view button is clicked', async () => {
  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={mockUser} />)

  const user = userEvent.setup()

  // click the view button
  const button = screen.getByText('view')
  await user.click(button)

  // url should now be visible
  expect(screen.getByText('https://example.com')).toBeDefined()

  // likes should now be visible
  expect(screen.getByText('likes 5')).toBeDefined()

  // user name should now be visible
  expect(screen.getByText('Test User')).toBeDefined()
})