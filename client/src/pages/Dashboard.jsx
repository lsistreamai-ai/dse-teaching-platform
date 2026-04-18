import { BookOpen, FolderOpen, Sparkles, Users, FileText, Clock } from 'lucide-react'

export default function Dashboard({ user }) {
  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your teaching resources</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FolderOpen size={24} />
          </div>
          <div className="stat-value">12</div>
          <div className="stat-label">Resources Created</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">
            <FileText size={24} />
          </div>
          <div className="stat-value">8</div>
          <div className="stat-label">Lesson Plans</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon purple">
            <Sparkles size={24} />
          </div>
          <div className="stat-value">15</div>
          <div className="stat-label">AI Tools Used</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orange">
            <Users size={24} />
          </div>
          <div className="stat-value">3</div>
          <div className="stat-label">Collaborations</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <a href="/ai-tools" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Sparkles size={18} /> Generate Lesson Plan
          </a>
          <a href="/ai-tools" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <FileText size={18} /> Create Quiz
          </a>
          <a href="/merge" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Users size={18} /> Start Collaboration
          </a>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
        </div>
        <div style={{ color: 'var(--text-light)' }}>
          <p><Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            No recent activity. Start by creating a resource or using an AI tool!
          </p>
        </div>
      </div>

      {user?.subjects?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your Subjects</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {user.subjects.map(s => (
              <span key={s} className="tag" style={{ background: 'var(--primary)', color: 'white' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
