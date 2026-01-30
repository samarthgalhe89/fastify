import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, User, LogOut, Palette } from 'lucide-react';

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
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Palette size={20} /> ThumbnailHub
                </h1>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon" style={{ display: 'flex' }}>
                        <LayoutDashboard size={18} />
                    </span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon" style={{ display: 'flex' }}>
                        <Upload size={18} />
                    </span>
                    <span>Upload</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="icon" style={{ display: 'flex' }}>
                        <User size={18} />
                    </span>
                    <span>Profile</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                    <span className="icon" style={{ display: 'flex' }}>
                        <LogOut size={18} />
                    </span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
