import api from '../utils/api';

export const getListingReviews = async (listingId, params = {}) => {
    const response = await api.get(`/api/reviews/listings/${listingId}/reviews/`, { params });
    return response.data;
};

export const getMyReviews = async () => {
    const response = await api.get('/api/reviews/my-reviews/');
    return response.data;
};

export const createReview = async (data) => {
    const response = await api.post('/api/reviews/my-reviews/', data);
    return response.data;
};

export const updateReview = async (id, data) => {
    const response = await api.put(`/api/reviews/my-reviews/${id}/`, data);
    return response.data;
};

export const deleteReview = async (id) => {
    const response = await api.delete(`/api/reviews/my-reviews/${id}/`);
    return response.data;
};
