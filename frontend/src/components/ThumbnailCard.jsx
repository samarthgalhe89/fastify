import { Link, useNavigate } from 'react-router-dom';
import { Gem, BadgeCheck, Edit, Trash2 } from 'lucide-react';

function ThumbnailCard({ thumbnail, onDelete }) {
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this thumbnail?')) {
            onDelete(thumbnail._id);
        }
    };

    const handleCardClick = () => {
        navigate(`/thumbnails/${thumbnail._id}`);
    };

    return (
        <div className="thumbnail-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="thumbnail-image">
                <img
                    src={`http://localhost:4000${thumbnail.image}`}
                    alt={thumbnail.videoName}
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"%3E%3Crect fill="%23262626" width="400" height="225"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                />
            </div>
            <div className="thumbnail-content">
                <h3 className="thumbnail-title">{thumbnail.videoName}</h3>
                <div className="thumbnail-meta">
                    {thumbnail.version && (
                        <span className="thumbnail-badge version">{thumbnail.version}</span>
                    )}
                    <span className={`thumbnail-badge ${thumbnail.paid ? 'paid' : 'free'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {thumbnail.paid ? <><Gem size={12} /> Paid</> : <><BadgeCheck size={12} /> Free</>}
                    </span>
                </div>
                <div className="thumbnail-actions">
                    <Link
                        to={`/thumbnails/${thumbnail._id}/edit`}
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Edit size={14} /> Edit
                    </Link>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ThumbnailCard;
