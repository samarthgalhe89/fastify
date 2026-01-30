import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThumbnailCard from '../components/ThumbnailCard';
import { thumbnailApi } from '../services/api';
import { Search, Plus, Package, BadgeCheck, Gem, X, Image } from 'lucide-react';

function Dashboard() {
    const [thumbnails, setThumbnails] = useState([]);
    const [filteredThumbnails, setFilteredThumbnails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchThumbnails();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = thumbnails.filter(t =>
                t.videoName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredThumbnails(filtered);
        } else {
            setFilteredThumbnails(thumbnails);
        }
    }, [searchQuery, thumbnails]);

    const fetchThumbnails = async () => {
        try {
            setLoading(true);
            const data = await thumbnailApi.getAll();
            setThumbnails(data);
            setFilteredThumbnails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await thumbnailApi.delete(id);
            setThumbnails(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            alert('Failed to delete thumbnail');
        }
    };

    const stats = {
        total: thumbnails.length,
        paid: thumbnails.filter(t => t.paid).length,
        free: thumbnails.filter(t => !t.paid).length,
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                    <div className="page-actions">
                        <div className="search-bar">
                            <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
                                <Search size={16} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search thumbnails..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link to="/upload" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={16} /> Upload
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="icon" style={{ color: 'var(--text-secondary)' }}>
                            <Package size={24} />
                        </div>
                        <div className="value">{stats.total}</div>
                        <div className="label">Total Thumbnails</div>
                    </div>
                    <div className="stat-card">
                        <div className="icon" style={{ color: 'var(--success)' }}>
                            <BadgeCheck size={24} />
                        </div>
                        <div className="value">{stats.free}</div>
                        <div className="label">Free Thumbnails</div>
                    </div>
                    <div className="stat-card">
                        <div className="icon" style={{ color: 'var(--text-secondary)' }}>
                            <Gem size={24} />
                        </div>
                        <div className="value">{stats.paid}</div>
                        <div className="label">Paid Thumbnails</div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <div className="icon">
                            <X size={64} />
                        </div>
                        <h3>Error loading thumbnails</h3>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={fetchThumbnails}>
                            Try Again
                        </button>
                    </div>
                ) : filteredThumbnails.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">
                            <Image size={64} />
                        </div>
                        <h3>{searchQuery ? 'No results found' : 'No thumbnails yet'}</h3>
                        <p>{searchQuery ? 'Try a different search term' : 'Get started by uploading your first thumbnail'}</p>
                        {!searchQuery && (
                            <Link to="/upload" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={16} /> Upload Thumbnail
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="thumbnail-grid">
                        {filteredThumbnails.map(thumbnail => (
                            <ThumbnailCard
                                key={thumbnail._id}
                                thumbnail={thumbnail}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
