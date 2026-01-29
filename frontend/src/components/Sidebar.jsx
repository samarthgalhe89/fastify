import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>🎨 ThumbnailHub</h1>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon">📊</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/thumbnails" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon">🖼️</span>
                    <span>Thumbnails</span>
                </NavLink>

                <NavLink to="/upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon">⬆️</span>
                    <span>Upload</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon">👤</span>
                    <span>Profile</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                    <span className="icon">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
