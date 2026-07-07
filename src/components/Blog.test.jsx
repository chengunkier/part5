import { render, screen } from '@testing-library/react'
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

  // title should be visible
  expect(screen.getByText('Component testing is done with react-testing-library Test Author')).toBeDefined()

  // url should NOT be visible by default
  expect(screen.queryByText('https://example.com')).toBeNull()

  // likes should NOT be visible by default
  expect(screen.queryByText('likes 5')).toBeNull()
})