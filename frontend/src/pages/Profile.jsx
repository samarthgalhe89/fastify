import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function Profile() {
    const { user, logout } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        try {
            // In a real app, you'd call an API to change the password
            // For now, simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Profile Settings</h1>
                </div>

                <div style={{ maxWidth: '600px' }}>
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.email?.charAt(0)?.toUpperCase() || '👤'}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.name || 'User'}</h2>
                            <p>{user?.email || 'user@example.com'}</p>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                🌍 {user?.country || 'Not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="profile-section">
                        <h3>Change Password</h3>

                        <form onSubmit={handlePasswordChange}>
                            {message.text && (
                                <div
                                    style={{
                                        marginBottom: '1.5rem',
                                        padding: '1rem',
                                        background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: 'var(--radius-lg)',
                                        color: message.type === 'error' ? 'var(--error)' : 'var(--success)',
                                        textAlign: 'center'
                                    }}
                                >
                                    {message.text}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <div className="form-input-icon">
                                    <span className="icon">🔒</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="form-input-icon">
                                    <span className="icon">🔐</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <div className="form-input-icon">
                                    <span className="icon">🔐</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>✨ Update Password</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="profile-section" style={{ marginTop: '1.5rem', borderColor: 'var(--error)' }}>
                        <h3 style={{ color: 'var(--error)' }}>Danger Zone</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Once you log out, you'll need to sign in again with your credentials.
                        </p>
                        <button
                            className="btn btn-danger"
                            onClick={logout}
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
