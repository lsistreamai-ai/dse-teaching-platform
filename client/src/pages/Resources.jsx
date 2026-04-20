import { useState, useEffect } from 'react'
import api from '../api'
import { Search, Upload } from 'lucide-react'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [subjects, setSubjects] = useState([])
  const [formLevels, setFormLevels] = useState([])
  const [filters, setFilters] = useState({ subject: '', form_level: '', search: '' })
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', subject: '', form_level: '', topic: ''
  })

  useEffect(() => {
    fetchResources()
  }, [filters])

  const fetchResources = async () => {
    const params = new URLSearchParams()
    if (filters.subject) params.append('subject', filters.subject)
    if (filters.form_level) params.append('form_level', filters.form_level)
    if (filters.search) params.append('search', filters.search)
    
    const res = await api.get(`/api/resources?${params}`)
    setResources(res.data.resources)
    setSubjects(res.data.subjects)
    setFormLevels(res.data.formLevels)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    await api.post('/api/resources', uploadForm)
    setShowUpload(false)
    setUploadForm({ title: '', description: '', subject: '', form_level: '', topic: '' })
    fetchResources()
  }

  return (
    <div>
      <div className="page-header">
        <h1>Teaching Resources</h1>
        <p>Browse and upload DSE-aligned teaching materials</p>
      </div>

      <div className="filters">
        <select
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select
          value={filters.form_level}
          onChange={(e) => setFilters({ ...filters, form_level: e.target.value })}
        >
          <option value="">All Forms</option>
          {formLevels.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        
        <input
          type="text"
          placeholder="Search resources..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        
        <button className="btn btn-success" onClick={() => setShowUpload(true)}>
          <Upload size={18} /> Upload
        </button>
      </div>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Resource</h2>
              <button className="modal-close" onClick={() => setShowUpload(false)}>&times;</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Title</label>
                <input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={uploadForm.subject}
                  onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Form Level</label>
                <select
                  value={uploadForm.form_level}
                  onChange={(e) => setUploadForm({ ...uploadForm, form_level: e.target.value })}
                  required
                >
                  <option value="">Select Form</option>
                  {formLevels.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Topic</label>
                <input
                  value={uploadForm.topic}
                  onChange={(e) => setUploadForm({ ...uploadForm, topic: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">Upload Resource</button>
            </form>
          </div>
        </div>
      )}

      <div className="resource-grid">
        {resources.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>No resources found. Upload your first resource!</p>
        ) : (
          resources.map(r => (
            <div key={r.id} className="resource-card">
              <h3>{r.title}</h3>
              <div className="resource-meta">
                <span className="tag">{r.subject}</span>
                <span className="tag">{r.form_level}</span>
              </div>
              <p>{r.description}</p>
              {r.topic && <p style={{ fontSize: '0.75rem' }}>Topic: {r.topic}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
