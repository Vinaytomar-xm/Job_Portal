import './Modal.css';

const JobModal = ({ job, onClose, onApply }) => {
  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>{job.title}</h2>
          <p className="modal-company">{job.company}</p>
          <div className="modal-meta">
            <span>📍 {job.location}</span>
            <span>💼 {job.type}</span>
            <span>🎓 {job.experience}</span>
            {job.salary && <span className="salary">💰 {job.salary}</span>}
          </div>
        </div>

        <div className="modal-body">
          <section>
            <h3>About the Role</h3>
            <p>{job.description}</p>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h3>Responsibilities</h3>
              <ul>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h3>Requirements</h3>
              <ul>
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {job.skills && job.skills.length > 0 && (
            <section>
              <h3>Skills</h3>
              <div className="skills-list">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onApply}>
            Apply Now
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
