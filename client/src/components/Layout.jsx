import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, FolderOpen, Sparkles, Merge, LogOut } from 'lucide-react'

export default function Layout({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2><BookOpen /> DSE Platform</h2>
        </div>
        
        <nav>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/dashboard" end>
                <BookOpen size={20} /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/resources">
                <FolderOpen size={20} /> Resources
              </NavLink>
            </li>
            <li>
              <NavLink to="/ai-tools">
                <Sparkles size={20} /> AI Tools
              </NavLink>
            </li>
            <li>
              <NavLink to="/merge">
                <Merge size={20} /> Merge Tool
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: '1rem' }}>
            <strong>{user?.name}</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {user?.role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
