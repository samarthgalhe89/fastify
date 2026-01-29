import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Layout, Loader2, ArrowRight } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Layout size={32} strokeWidth={1.5} />
                    </div>
                    <h1>ThumbnailHub</h1>
                    <p>Welcome back! Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message" style={{
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--error)',
                        fontSize: 'var(--font-size-sm)',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>}

                    <div className="form-group">
                        <div className="form-input-icon">
                            <span className="icon" style={{ display: 'flex', alignItems: 'center', top: '50%' }}>
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-input-icon">
                            <span className="icon" style={{ display: 'flex', alignItems: 'center', top: '50%' }}>
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                <span style={{ marginLeft: '0.5rem' }}>Signing in...</span>
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign Up</Link>
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Login;
