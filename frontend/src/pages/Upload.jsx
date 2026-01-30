import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UploadZone from '../components/UploadZone';
import { thumbnailApi } from '../services/api';
import { Video, Tag, Gem, Upload as UploadIcon } from 'lucide-react';

function Upload() {
    const [file, setFile] = useState(null);
    const [videoName, setVideoName] = useState('');
    const [version, setVersion] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image to upload');
            return;
        }

        if (!videoName.trim()) {
            setError('Please enter a video name');
            return;
        }

        setError('');
        setLoading(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('videoName', videoName);
            formData.append('version', version);
            formData.append('paid', isPaid.toString());

            await thumbnailApi.create(formData);

            setProgress(100);
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (err) {
            setError(err.message);
            clearInterval(progressInterval);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Upload Thumbnail</h1>
                </div>

                <div style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <UploadZone
                            selectedFile={file}
                            onFileSelect={setFile}
                            onClear={() => setFile(null)}
                        />

                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
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

                        {loading && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-full btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                                    Uploading...
                                </>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <UploadIcon size={16} /> Upload Thumbnail
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Upload;
