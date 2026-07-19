import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404 - Not found</h1>
      <p>
        <Link to="/dashboard">Go to Dashboard</Link>
      </p>
    </div>
  )
}


