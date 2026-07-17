import { useParams, useNavigate } from 'react-router-dom'

const SingleBlog = ({ blogs, user, handleLike, handleDelete }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)

  if (!blog) return null

  const likeBlog = () => {
    handleLike({
      ...blog,
      user: blog.user ? blog.user.id || blog.user._id : null,
      likes: blog.likes + 1
    })
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await handleDelete(blog.id)
      navigate('/')
    }
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username

  return (
    <div>
      <h2>{blog.user && blog.user.name}: {blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        {user && <button onClick={likeBlog}>like</button>}
      </div>
      <div>Added by {blog.user && blog.user.name}</div>
      {showDeleteButton && (
        <div>
          <button onClick={deleteBlog}>remove</button>
        </div>
      )}
    </div>
  )
}

export default SingleBlog