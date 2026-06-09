import './JobCard.css';

const JobCard = ({ job, isAdmin = false, onView, onEdit, onDelete }) => {
  const getBadgeClass = (type) => {
    return `badge--${type.toLowerCase().replace('-', '')}`;
  };

  return (
    <div className={`job-card ${isAdmin ? 'admin-card' : ''}`}>
      <div className="job-card-header">
        <div>
          <h3>{job.title}</h3>
          <span className={`badge ${getBadgeClass(job.type)}`}>{job.type}</span>
        </div>
        
        {isAdmin && (
          <div className="card-actions">
            <button className="btn-icon" onClick={onEdit} title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="btn-icon btn-delete" onClick={onDelete} title="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <p className="job-company">{job.company}</p>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>💼 {job.experience}</span>
        {job.salary && <span className="salary">💰 {job.salary}</span>}
        {isAdmin && (
          <span>📋 {job.applicationsCount || 0} applications</span>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {!isAdmin && (
        <button className="btn-primary btn-sm" onClick={onView}>
          View Details
        </button>
      )}
    </div>
  );
};

export default JobCard;
