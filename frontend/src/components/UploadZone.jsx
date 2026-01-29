import { useState, useRef } from 'react';

function UploadZone({ onFileSelect, selectedFile, onClear }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                onFileSelect(file);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div>
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <div className="icon">☁️</div>
                <h3>Drop your thumbnail here</h3>
                <p>or click to browse files</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supports: PNG, JPG, JPEG, GIF, WebP
                </p>
            </div>

            {selectedFile && (
                <div className="file-preview">
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                    />
                    <div className="file-info">
                        <div className="name">{selectedFile.name}</div>
                        <div className="size">{formatFileSize(selectedFile.size)}</div>
                    </div>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                    >
                        ✖️
                    </button>
                </div>
            )}
        </div>
    );
}

export default UploadZone;
