import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { thumbnailApi } from '../services/api';
import { X, ArrowLeft, Gem, BadgeCheck, Edit, Download, Trash2 } from 'lucide-react';

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
            link.href = `http://localhost:4000${thumbnail.image}`;
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
                        <div className="icon">
                            <X size={64} />
                        </div>
                        <h3>Thumbnail not found</h3>
                        <p>{error || 'The thumbnail you are looking for does not exist.'}</p>
                        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={16} /> Back to Dashboard
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
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <div className="detail-view">
                    <div className="detail-image">
                        <img
                            src={`http://localhost:4000${thumbnail.image}`}
                            alt={thumbnail.videoName}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect fill="%23262626" width="800" height="450"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{thumbnail.videoName}</h1>
                        <div className="detail-meta">
                            {thumbnail.version && (
                                <span className="thumbnail-badge version">{thumbnail.version}</span>
                            )}
                            <span className={`thumbnail-badge ${thumbnail.paid ? 'paid' : 'free'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {thumbnail.paid ? <><Gem size={12} /> Paid</> : <><BadgeCheck size={12} /> Free</>}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to={`/thumbnails/${id}/edit`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Edit size={16} /> Edit
                        </Link>
                        <button className="btn btn-secondary" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={16} /> Download
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ThumbnailView;
