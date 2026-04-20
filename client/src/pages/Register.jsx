import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const SUBJECTS = [
  'Chinese Language', 'English Language', 'Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Economics',
  'History', 'Geography', 'Chinese History', 'ICT', 'BAFS'
]

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    subjects: [],
    school: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const res = await api.post('/api/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(res.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  const toggleSubject = (subject) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter(s => s !== subject)
        : [...f.subjects, subject]
    }))
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join the DSE Teaching Platform today</p>
        
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          
          {form.role === 'teacher' && (
            <>
              <div className="form-group">
                <label>Subjects</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {SUBJECTS.map(s => (
                    <span
                      key={s}
                      className="tag"
                      style={{
                        cursor: 'pointer',
                        background: form.subjects.includes(s) ? 'var(--primary)' : 'var(--bg)',
                        color: form.subjects.includes(s) ? 'white' : 'var(--text)'
                      }}
                      onClick={() => toggleSubject(s)}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>School</label>
                <input
                  value={form.school}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                  placeholder="Your school name"
                />
              </div>
            </>
          )}
          
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
