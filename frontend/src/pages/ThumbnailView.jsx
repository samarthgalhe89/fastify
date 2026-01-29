import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { thumbnailApi } from '../services/api';

function ThumbnailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchThumbnail();
    }, [id]);

    const fetchThumbnail = async () => {
        try {
            setLoading(true);
            const data = await thumbnailApi.getById(id);
            setThumbnail(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this thumbnail?')) {
            return;
        }

        try {
            await thumbnailApi.delete(id);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to delete thumbnail');
        }
    };

    const handleDownload = () => {
        if (thumbnail) {
            const link = document.createElement('a');
            link.href = `http://localhost:3000${thumbnail.image}`;
            link.download = `${thumbnail.videoName}-thumbnail.jpg`;
            link.target = '_blank';
            link.click();
        }
    };

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !thumbnail) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="empty-state">
                        <div className="icon">❌</div>
                        <h3>Thumbnail not found</h3>
                        <p>{error || 'The thumbnail you are looking for does not exist.'}</p>
                        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            ← Back to Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/dashboard" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="detail-view">
                    <div className="detail-image">
                        <img
                            src={`http://localhost:3000${thumbnail.image}`}
                            alt={thumbnail.videoName}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x450?text=No+Image';
                            }}
                        />
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{thumbnail.videoName}</h1>
                        <div className="detail-meta">
                            {thumbnail.version && (
                                <span className="thumbnail-badge version">{thumbnail.version}</span>
                            )}
                            <span className={`thumbnail-badge ${thumbnail.paid ? 'paid' : 'free'}`}>
                                {thumbnail.paid ? '💎 Paid' : '🆓 Free'}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to={`/thumbnails/${id}/edit`} className="btn btn-secondary">
                            ✏️ Edit
                        </Link>
                        <button className="btn btn-secondary" onClick={handleDownload}>
                            📥 Download
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ThumbnailView;
