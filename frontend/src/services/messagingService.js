import api from '../utils/api';

const messagingService = {
    getConversations: async () => {
        const response = await api.get('/api/messaging/conversations/');
        return response.data;
    },
    
    getOrCreateConversation: async (username) => {
        const response = await api.post('/api/messaging/conversations/', { username });
        return response.data;
    },
    
    getMessages: async (conversationId) => {
        const response = await api.get(`/api/messaging/conversations/${conversationId}/messages/`);
        return response.data;
    },
    
    sendMessage: async (conversationId, content) => {
        const response = await api.post(`/api/messaging/conversations/${conversationId}/messages/`, { content });
        return response.data;
    },
    
    markAsRead: async (conversationId) => {
        const response = await api.post(`/api/messaging/conversations/${conversationId}/read/`);
        return response.data;
    }
};

export default messagingService;
