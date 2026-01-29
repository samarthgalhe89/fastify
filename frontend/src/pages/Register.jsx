import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Globe, Check, Loader2, UserPlus } from 'lucide-react';

const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'India', 'Japan', 'Brazil', 'Mexico', 'Spain', 'Italy',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Singapore',
    'South Korea', 'China', 'Other'
];

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9!@#$%^&*]/.test(password)) strength += 25;

        if (strength <= 25) return { strength, label: 'Weak', color: '#ef4444' };
        if (strength <= 50) return { strength, label: 'Fair', color: '#eab308' };
        if (strength <= 75) return { strength, label: 'Good', color: '#a3a3a3' };
        return { strength, label: 'Strong', color: '#22c55e' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.country);
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <UserPlus size={32} strokeWidth={1.5} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Start managing your thumbnails today</p>
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
                                <User size={16} />
                            </span>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="Full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-input-icon">
                            <span className="icon" style={{ display: 'flex', alignItems: 'center', top: '50%' }}>
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                className="form-input"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {formData.password && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div className="progress-bar" style={{ height: '4px', background: 'var(--bg-elevated)' }}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${passwordStrength.strength}%`,
                                            background: passwordStrength.color,
                                            transition: 'all 0.3s ease'
                                        }}
                                    ></div>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: passwordStrength.color, marginTop: '0.25rem', display: 'block' }}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="form-input-icon">
                            <span className="icon" style={{ display: 'flex', alignItems: 'center', top: '50%' }}>
                                <Check size={16} />
                            </span>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-input-icon">
                            <span className="icon" style={{ display: 'flex', alignItems: 'center', top: '50%' }}>
                                <Globe size={16} />
                            </span>
                            <select
                                name="country"
                                className="form-input"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                style={{ cursor: 'pointer', appearance: 'none' }}
                            >
                                <option value="">Select your country</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                <span style={{ marginLeft: '0.5rem' }}>Creating account...</span>
                            </>
                        ) : (
                            <>Create Account</>
                        )}
                    </button>
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
