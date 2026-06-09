import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ user, tabs, activeTab, setActiveTab, isAdmin = false }) => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Job<span>Board</span></h2>
        <div className="user-info">
          <div className={`user-avatar ${isAdmin ? 'admin' : ''}`}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name || 'User'}</p>
            <span className="user-role">{isAdmin ? 'Admin' : 'User'}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.badge > 0 && (
              <span className="nav-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <button className="btn-logout" onClick={logout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
