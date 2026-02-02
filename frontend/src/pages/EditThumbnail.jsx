import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { thumbnailApi } from '../services/api';
import { Video, Tag, Gem, Save, ArrowLeft } from 'lucide-react';

function EditThumbnail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [videoName, setVideoName] = useState('');
    const [version, setVersion] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                const data = await thumbnailApi.getById(id);
                setVideoName(data.videoName);
                setVersion(data.version || '');
                setIsPaid(data.paid);
                setCurrentImage(data.image);
            } catch (err) {
                setError('Failed to load thumbnail details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchThumbnail();
        }
    }, [id, isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoName.trim()) {
            setError('Please enter a video name');
            return;
        }

        setError('');
        setSaving(true);

        try {
            const updateData = {
                videoName,
                version,
                paid: isPaid
            };

            await thumbnailApi.update(id, updateData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to update thumbnail');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="spinner"></div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="page-title">Edit Thumbnail</h1>
                </div>

                <div style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Current Thumbnail</label>
                            <div style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                border: '1px solid var(--border-color)'
                            }}>
                                <img
                                    src={`http://localhost:4000${currentImage}`}
                                    alt="Current thumbnail"
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Note: Changing the image file is not supported in this version.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Video Name *</label>
                            <div className="form-input-icon">
                                <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Video size={16} />
                                </span>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter video name"
                                    value={videoName}
                                    onChange={(e) => setVideoName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Version</label>
                            <div className="form-input-icon">
                                <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Tag size={16} />
                                </span>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., v1.0, v2.0"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={isPaid}
                                    onChange={(e) => setIsPaid(e.target.checked)}
                                />
                                <span className="toggle-switch"></span>
                                <span className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Gem size={16} /> Paid Content
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full btn-lg"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                                    Saving...
                                </>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Save size={16} /> Save Changes
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default EditThumbnail;
