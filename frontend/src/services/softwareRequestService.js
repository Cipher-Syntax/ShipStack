import api from '../utils/api';

const softwareRequestService = {
    getRequests: async () => {
        const response = await api.get('/api/requests/');
        return response.data;
    },
    
    getMyRequests: async () => {
        const response = await api.get('/api/requests/me/');
        return response.data;
    },
    
    getRequest: async (id) => {
        const response = await api.get(`/api/requests/${id}/`);
        return response.data;
    },
    
    createRequest: async (data) => {
        const response = await api.post('/api/requests/', data);
        return response.data;
    },
    
    updateRequest: async (id, data) => {
        const response = await api.patch(`/api/requests/${id}/`, data);
        return response.data;
    },
    
    cancelRequest: async (id) => {
        const response = await api.delete(`/api/requests/${id}/`);
        return response.data;
    },
    
    getProposals: async (requestId) => {
        const response = await api.get(`/api/requests/${requestId}/proposals/`);
        return response.data;
    },
    
    submitProposal: async (requestId, data) => {
        const response = await api.post(`/api/requests/${requestId}/proposals/`, data);
        return response.data;
    },
    
    acceptProposal: async (proposalId) => {
        const response = await api.post(`/api/requests/proposals/${proposalId}/accept/`);
        return response.data;
    }
};

export default softwareRequestService;
