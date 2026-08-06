import api from '../utils/api';

export const commerceService = {
    createCheckoutSession: async (listingId) => {
        const response = await api.post('/api/commerce/checkout/session/', {
            listing_id: listingId
        });
        return response.data;
    },
    generateDownloadToken: async (listingId) => {
        const response = await api.post(`/api/commerce/download-token/${listingId}/`);
        return response.data;
    },
    getMyPurchases: async () => {
        const response = await api.get('/api/commerce/purchases/');
        return response.data;
    }
};
