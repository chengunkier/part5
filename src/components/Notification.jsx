const Notification = ({ message, type }) => {
  if (message === null) return null

  const style = {
    border: '2px solid',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    backgroundColor: '#e0e0e0',
    color: type === 'error' ? 'red' : 'green',
    borderColor: type === 'error' ? 'red' : 'green',
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification