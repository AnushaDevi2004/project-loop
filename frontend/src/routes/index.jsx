import { Navigate, Route, Routes } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Feedback from '../pages/Feedback.jsx'
import Analytics from '../pages/Analytics.jsx'
import AskLoop from '../pages/AskLoop.jsx'
import Reports from '../pages/Reports.jsx'
import Settings from '../pages/Settings.jsx'
import NotFound from '../pages/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/ask-loop" element={<AskLoop />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

