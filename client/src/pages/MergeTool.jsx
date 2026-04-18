import { useState, useEffect } from 'react'
import axios from 'axios'
import { merge } from 'lucide-react'

export default function MergeTool({ user }) {
  const [suggestions, setSuggestions] = useState([])
  const [projects, setProjects] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subjects: [],
    mergedContent: ['', '']
  })

  useEffect(() => {
    fetchSuggestions()
    fetchProjects()
  }, [])

  const fetchSuggestions = async () => {
    const res = await axios.get('/api/merge/suggestions')
    setSuggestions(res.data.suggestions)
  }

  const fetchProjects = async () => {
    const res = await axios.get('/api/merge/projects')
    setProjects(res.data.projects)
  }

  const toggleSubject = (subject) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter(s => s !== subject)
        : [...f.subjects, subject]
    }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await axios.post('/api/merge/worksheets', {
      ...form,
      teacherIds: [user?.id]
    })
    setShowCreate(false)
    setForm({ title: '', subjects: [], mergedContent: ['', ''] })
    fetchProjects()
  }

  const selectSuggestion = (suggestion) => {
    setForm({
      title: suggestion.theme,
      subjects: suggestion.subjects,
      mergedContent: suggestion.subjects.map(() => '')
    })
    setShowCreate(true)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Merge Tool</h1>
        <p>Collaborate with other teachers across subjects</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Cross-Subject Suggestions</h3>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            Create New Project
          </button>
        </div>
        <div className="suggestions-grid">
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-card" onClick={() => selectSuggestion(s)}>
              <div className="subject-tags">
                {s.subjects.map(sub => (
                  <span key={sub} className="tag">{sub}</span>
                ))}
              </div>
              <h3>{s.theme}</h3>
              <p>{s.description}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                Topics: {s.topics.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Merged Project</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g., Applied Mathematics in Physics"
                />
              </div>
              
              <div className="form-group">
                <label>Selected Subjects</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {form.subjects.map(s => (
                    <span key={s} className="tag" style={{ background: 'var(--primary)', color: 'white' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {form.subjects.map((subject, i) => (
                <div key={subject} className="form-group">
                  <label>{subject} Content</label>
                  <textarea
                    value={form.mergedContent[i] || ''}
                    onChange={(e) => {
                      const content = [...form.mergedContent]
                      content[i] = e.target.value
                      setForm({ ...form, mergedContent: content })
                    }}
                    rows={3}
                    placeholder={`Content for ${subject} section`}
                  />
                </div>
              ))}

              <button type="submit" className="btn btn-primary">Create Project</button>
            </form>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="card">
          <h3 className="card-title">Your Projects</h3>
          {projects.map(p => (
            <div key={p.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <h4>{p.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                Subjects: {Array.isArray(p.subjects) ? p.subjects.join(', ') : p.subjects}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
