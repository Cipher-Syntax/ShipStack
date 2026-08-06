import api from '../utils/api';

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/api/notifications/');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/api/notifications/unread-count/');
    return response.data.unread_count;
  },

  markAsRead: async (id) => {
    const response = await api.post(`/api/notifications/${id}/read/`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/api/notifications/read-all/');
    return response.data;
  }
};

export default notificationService;
