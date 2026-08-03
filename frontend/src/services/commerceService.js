import api from '../utils/api';

export const commerceService = {
    createCheckoutSession: async (listingId) => {
        const response = await api.post('/api/commerce/checkout/session/', {
            listing_id: listingId
        });
        return response.data;
    },
    getDownloadUrl: async (listingId) => {
        const response = await api.get(`/api/commerce/download/${listingId}/`);
        return response.data;
    }
};
