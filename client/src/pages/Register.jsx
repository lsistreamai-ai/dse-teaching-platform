import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const SUBJECTS = [
  'Chinese Language', 'English Language', 'Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Economics',
  'History', 'Geography', 'Chinese History', 'ICT'
]

const ROLES = ['teacher', 'student']

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'teacher',
    subjects: [],
    school: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await api.post('/api/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join the DSE Teaching Platform</p>
        
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Your name"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label>School (optional)</label>
            <input
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              placeholder="Your school name"
            />
          </div>
          
          <div className="form-group">
            <label>Subjects</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`btn ${form.subjects.includes(s) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleSubject(s)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
