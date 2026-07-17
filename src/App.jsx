import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const Navigation = ({ user, handleLogout }) => {
  return (
    <nav>
      <Link to="/">blogs</Link>
      {user
        ? <button onClick={handleLogout}>logout</button>
        : <Link to="/login"> login</Link>
      }
    </nav>
  )
}

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </li>
          )
        }
      </ul>
    </div>
  )
}

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

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleLike = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      setBlogs(blogs.map(blog =>
        blog.id === returnedBlog.id
          ? { ...returnedBlog, user: blog.user }
          : blog
      ))
    } catch (exception) {
      showNotification('liking blog failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('blog removed successfully', 'success')
    } catch (exception) {
      showNotification('removing blog failed', 'error')
    }
  }

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <Notification
        message={notification.message}
        type={notification.type}
      />
      <Routes>
        <Route
          path="/"
          element={<BlogList blogs={blogs} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <SingleBlog
              blogs={blogs}
              user={user}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App