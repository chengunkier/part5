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
    <div className="single-blog">
      <h2 className="single-blog-title">{blog.title}</h2>
      <p className="single-blog-author">by {blog.author}</p>
      <a className="single-blog-url" href={blog.url}>{blog.url}</a>
      <p className="single-blog-added">Added by {blog.user && blog.user.name}</p>
      <div className="single-blog-actions">
        <span className="single-blog-likes">{blog.likes} likes</span>
        {user && (
          <button className="btn-like" onClick={likeBlog}>like</button>
        )}
        {showDeleteButton && (
          <button className="btn-remove" onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default SingleBlog