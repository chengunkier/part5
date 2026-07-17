import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SingleBlog from './SingleBlog'

const blog = {
  id: '123',
  title: 'The Single Responsibility Principle',
  author: 'Robert C. Martin',
  url: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html',
  likes: 0,
  user: {
    id: '456',
    name: 'Matti Luukkainen',
    username: 'mluukkai'
  }
}

const creator = {
  username: 'mluukkai',
  name: 'Matti Luukkainen'
}

const otherUser = {
  username: 'anotheruser',
  name: 'Another User'
}

const renderSingleBlog = (user) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <SingleBlog
              blogs={[blog]}
              user={user}
              handleLike={vi.fn()}
              handleDelete={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('unauthenticated users see blog info and likes but no buttons', () => {
  renderSingleBlog(null)

  expect(screen.getByText('Matti Luukkainen: The Single Responsibility Principle')).toBeDefined()
  expect(screen.getByText('https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html')).toBeDefined()
  expect(screen.getByText('likes 0')).toBeDefined()
  expect(screen.getByText('Added by Matti Luukkainen')).toBeDefined()

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('authenticated non-creator sees only the like button', () => {
  renderSingleBlog(otherUser)

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('blog creator sees both like and remove buttons', () => {
  renderSingleBlog(creator)

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
})