import api from '../utils/api';

export const commerceService = {
    createCheckoutSession: async (listingId) => {
        const response = await api.post('/api/commerce/checkout/session/', {
            listing_id: listingId
        });
        return response.data;
    }
};
