const API_BASE = 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// Thumbnail API
export const thumbnailApi = {
    // Get all thumbnails
    getAll: async () => {
        const response = await fetch(`${API_BASE}/thumbnails`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch thumbnails');
        }

        return response.json();
    },

    // Get single thumbnail
    getById: async (id) => {
        const response = await fetch(`${API_BASE}/thumbnails/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch thumbnail');
        }

        return response.json();
    },

    // Create thumbnail
    create: async (formData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/thumbnails`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create thumbnail');
        }

        return response.json();
    },

    // Update thumbnail
    update: async (id, data) => {
        const response = await fetch(`${API_BASE}/thumbnails/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update thumbnail');
        }

        return response.json();
    },

    // Delete thumbnail
    delete: async (id) => {
        const response = await fetch(`${API_BASE}/thumbnails/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete thumbnail');
        }

        return response.json();
    },

    // Delete all thumbnails
    deleteAll: async () => {
        const response = await fetch(`${API_BASE}/thumbnails`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete thumbnails');
        }

        return response.json();
    },
};

export default thumbnailApi;
