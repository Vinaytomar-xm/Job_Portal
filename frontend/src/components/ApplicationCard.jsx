import './ApplicationCard.css';

const ApplicationCard = ({ application, isAdmin = false, onStatusUpdate }) => {
  const getStatusClass = (status) => {
    return `status--${status}`;
  };

  return (
    <div className="application-card">
      <div className="application-header">
        <div>
          {isAdmin ? (
            <>
              <h3>{application.job.title} at {application.job.company}</h3>
              <p className="app-company">
                Applicant: {application.user.name} ({application.user.email})
              </p>
            </>
          ) : (
            <>
              <h3>{application.job.title}</h3>
              <p className="app-company">{application.job.company}</p>
            </>
          )}
        </div>
        
        {isAdmin ? (
          <div className="status-actions">
            <select
              className="status-select"
              value={application.status}
              onChange={(e) => onStatusUpdate(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
        ) : (
          <span className={`status-badge ${getStatusClass(application.status)}`}>
            {application.status}
          </span>
        )}
      </div>

      <div className="application-meta">
        <span>📍 {application.job.location}</span>
        <span>💼 {application.job.type}</span>
        <span>📅 Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ApplicationCard;
