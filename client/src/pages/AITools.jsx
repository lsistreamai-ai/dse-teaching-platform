import { useState } from 'react'
import axios from 'axios'
import { FileText, Presentation, ClipboardList, CheckCircle } from 'lucide-react'

const AI_TOOLS = [
  {
    id: 'lesson-plan',
    name: 'Lesson Plan Generator',
    description: 'Create structured lesson plans aligned with DSE curriculum',
    icon: FileText
  },
  {
    id: 'presentation',
    name: 'Presentation Maker',
    description: 'Generate presentation slides for your lessons',
    icon: Presentation
  },
  {
    id: 'quiz',
    name: 'Quiz Generator',
    description: 'Create DSE-style quizzes with multiple question types',
    icon: ClipboardList
  },
  {
    id: 'marking',
    name: 'Smart Marking Tool',
    description: 'Auto-grade student submissions with instant feedback',
    icon: CheckCircle
  }
]

const SUBJECTS = [
  'Chinese Language', 'English Language', 'Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Economics',
  'History', 'Geography', 'Chinese History', 'ICT'
]

const FORM_LEVELS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']

export default function AITools() {
  const [activeTool, setActiveTool] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [form, setForm] = useState({
    subject: 'English Language',
    formLevel: 'S4',
    topic: '',
    duration: 40,
    questionCount: 10,
    slideCount: 10
  })

  const runTool = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      let endpoint = ''
      let data = {}
      
      switch (activeTool) {
        case 'lesson-plan':
          endpoint = '/api/ai/lesson-plan'
          data = form
          break
        case 'presentation':
          endpoint = '/api/ai/presentation'
          data = { subject: form.subject, topic: form.topic, slideCount: form.slideCount }
          break
        case 'quiz':
          endpoint = '/api/ai/quiz'
          data = { ...form, questionTypes: ['MCQ', 'Short Answer'] }
          break
        case 'marking':
          // Demo marking
          endpoint = '/api/ai/mark'
          data = {
            studentAnswers: ['A', 'B', 'C', 'A', 'D'],
            markingScheme: [
              { answer: 'A', marks: 1 },
              { answer: 'B', marks: 1 },
              { answer: 'C', marks: 1 },
              { answer: 'A', marks: 1 },
              { answer: 'D', marks: 1 }
            ]
          }
          break
      }
      
      const res = await axios.post(endpoint, data)
      setResult(res.data)
    } catch (err) {
      setResult({ error: err.response?.data?.error || 'Failed to generate' })
    }
    
    setLoading(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>AI Teaching Tools</h1>
        <p>Powerful AI-powered tools to save time and enhance your teaching</p>
      </div>

      <div className="ai-tools-grid">
        {AI_TOOLS.map(tool => (
          <div
            key={tool.id}
            className={`ai-tool-card ${activeTool === tool.id ? 'selected' : ''}`}
            onClick={() => { setActiveTool(tool.id); setResult(null) }}
            style={{ border: activeTool === tool.id ? '2px solid var(--primary)' : '2px solid var(--border)' }}
          >
            <div className="ai-tool-icon">
              <tool.icon size={24} />
            </div>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
          </div>
        ))}
      </div>

      {activeTool && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 className="card-title">Configure {AI_TOOLS.find(t => t.id === activeTool)?.name}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Form Level</label>
              <select
                value={form.formLevel}
                onChange={(e) => setForm({ ...form, formLevel: e.target.value })}
              >
                {FORM_LEVELS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Topic</label>
              <input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g., Photosynthesis, Quadratic Equations"
              />
            </div>
            
            {(activeTool === 'lesson-plan') && (
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                />
              </div>
            )}
            
            {(activeTool === 'quiz') && (
              <div className="form-group">
                <label>Number of Questions</label>
                <input
                  type="number"
                  value={form.questionCount}
                  onChange={(e) => setForm({ ...form, questionCount: parseInt(e.target.value) })}
                />
              </div>
            )}
            
            {(activeTool === 'presentation') && (
              <div className="form-group">
                <label>Number of Slides</label>
                <input
                  type="number"
                  value={form.slideCount}
                  onChange={(e) => setForm({ ...form, slideCount: parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>
          
          <button
            className="btn btn-primary"
            onClick={runTool}
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}

      {result && (
        <div className="result-box" style={{ marginTop: '1.5rem' }}>
          <h4>Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
