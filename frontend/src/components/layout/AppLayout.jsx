import { Outlet } from 'react-router-dom'

import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  )
}

