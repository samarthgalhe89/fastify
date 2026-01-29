import { Link } from 'react-router-dom';

function ThumbnailCard({ thumbnail, onDelete }) {
    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this thumbnail?')) {
            onDelete(thumbnail._id);
        }
    };

    return (
        <Link to={`/thumbnails/${thumbnail._id}`} className="thumbnail-card">
            <div className="thumbnail-image">
                <img
                    src={`http://localhost:3000${thumbnail.image}`}
                    alt={thumbnail.videoName}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x225?text=No+Image';
                    }}
                />
            </div>
            <div className="thumbnail-content">
                <h3 className="thumbnail-title">{thumbnail.videoName}</h3>
                <div className="thumbnail-meta">
                    {thumbnail.version && (
                        <span className="thumbnail-badge version">{thumbnail.version}</span>
                    )}
                    <span className={`thumbnail-badge ${thumbnail.paid ? 'paid' : 'free'}`}>
                        {thumbnail.paid ? '💎 Paid' : '🆓 Free'}
                    </span>
                </div>
                <div className="thumbnail-actions">
                    <Link
                        to={`/thumbnails/${thumbnail._id}/edit`}
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        ✏️ Edit
                    </Link>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ThumbnailCard;
