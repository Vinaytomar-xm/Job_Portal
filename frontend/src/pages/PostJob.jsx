import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const TYPES      = ['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Freelance', 'Contract'];
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Sales', 'HR', 'Operations', 'Other'];
const EXPERIENCE = ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'];

export default function PostJob() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', requirements: '',
    location: '', type: 'Full-Time', category: 'Technology',
    salary: '', experience: 'Fresher', skills: [],
    openings: 1, deadline: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(p => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location) {
      toast.error('Title, description and location are required');
      return;
    }
    setLoading(true);
    try {
      await createJob(form);
      toast.success('Job posted successfully! 🎉');
      navigate('/company/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>
          ← Back
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>Post a New Job</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>
          Posting as <strong style={{ color: 'var(--primary)' }}>{user?.companyName || user?.name}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1 - Basic Info */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)' }}>Basic Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Frontend Developer, Marketing Manager"
                  value={form.title} onChange={e => set('title', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" className="form-input" placeholder="e.g. Bangalore, Remote, Mumbai"
                    value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Required</label>
                  <select className="form-input" value={form.experience} onChange={e => set('experience', e.target.value)}>
                    {EXPERIENCE.map(ex => <option key={ex}>{ex}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Salary / Stipend</label>
                  <input type="text" className="form-input" placeholder="e.g. ₹8-12 LPA or Not Disclosed"
                    value={form.salary} onChange={e => set('salary', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Openings</label>
                  <input type="number" className="form-input" min={1} max={100}
                    value={form.openings} onChange={e => set('openings', parseInt(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input type="date" className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.deadline} onChange={e => set('deadline', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section 2 - Description */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)' }}>Job Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea className="form-input" rows={6}
                  placeholder="Describe the role, responsibilities, and what the candidate will do day-to-day..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements & Qualifications</label>
                <textarea className="form-input" rows={4}
                  placeholder="List the must-have qualifications, degree requirements, certifications, etc."
                  value={form.requirements} onChange={e => set('requirements', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section 3 - Skills */}
          <div className="card" style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-1)' }}>Required Skills</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input type="text" className="form-input" placeholder="e.g. React, Python, Figma"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={addSkill} className="btn btn-outline">Add</button>
            </div>
            {form.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.skills.map(skill => (
                  <span key={skill} className="badge badge-primary" style={{ cursor: 'pointer' }}
                    onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 2 }}>
              {loading ? 'Posting...' : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
