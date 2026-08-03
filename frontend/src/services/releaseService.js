import api from '../utils/api';

export const releaseService = {
    getDeveloperReleases: async (listingId) => {
        const response = await api.get('/api/releases/developer/');
        return response.data.filter(r => String(r.listing_id) === String(listingId));
    },
    
    createRelease: async (releaseData) => {
        const response = await api.post('/api/releases/developer/', releaseData);
        return response.data;
    },
    
    updateRelease: async (id, releaseData) => {
        const response = await api.patch(`/api/releases/developer/${id}/`, releaseData);
        return response.data;
    },
    
    publishRelease: async (id) => {
        const response = await api.post(`/api/releases/developer/${id}/publish/`);
        return response.data;
    },
    
    deleteRelease: async (id) => {
        await api.delete(`/api/releases/developer/${id}/`);
    }
};
