import { Navigate } from 'react-router-dom'

// Placeholder for auth-protected routes.
// Implement later based on LOOP auth flow.
export default function ProtectedRoute({ children }) {
  // TODO: integrate auth context/provider
  const isAuthed = false

  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

