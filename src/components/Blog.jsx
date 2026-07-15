import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = () => {
    handleLike({
      ...blog,
      user: blog.user ? blog.user.id || blog.user._id : null,
      likes: blog.likes + 1
    })
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog.id)
    }
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={likeBlog}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {showDeleteButton && (
            <button
              onClick={deleteBlog}
              style={{ backgroundColor: 'blue', color: 'white' }}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog