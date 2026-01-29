import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, ArrowLeft, Loader2 } from 'lucide-react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        <Mail size={48} strokeWidth={1} />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>Check your email</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: 'var(--font-size-sm)', lineHeight: '1.6' }}>
                        We've sent a password reset link to<br />
                        <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{email}</strong>
                    </p>
                    <Link to="/login" className="btn btn-primary btn-full">
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Key size={32} strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.5rem' }}>Reset Password</h1>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Enter your email to receive a reset link</p>
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
                                style={{ fontSize: 'var(--font-size-sm)' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                <span style={{ marginLeft: '0.5rem' }}>Sending...</span>
                            </>
                        ) : (
                            <>Send Reset Link</>
                        )}
                    </button>

                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </form>

                <div className="auth-footer" style={{ fontSize: 'var(--font-size-sm)' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
