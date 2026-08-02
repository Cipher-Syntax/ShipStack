import api from '../utils/api';

export const getMyListings = async () => {
    const response = await api.get('/api/listings/');
    return response.data;
};

export const createDraft = async (data = { title: "Untitled Draft", slug: "untitled-draft-" + Date.now() }) => {
    const response = await api.post('/api/listings/', data);
    return response.data;
};

export const getListing = async (id) => {
    const response = await api.get(`/api/listings/${id}/`);
    return response.data;
};

export const updateListing = async (id, data) => {
    const response = await api.patch(`/api/listings/${id}/`, data);
    return response.data;
};

export const deleteListing = async (id) => {
    const response = await api.delete(`/api/listings/${id}/`);
    return response.data;
};

export const uploadMedia = async (id, formData) => {
    const response = await api.post(`/api/listings/${id}/media/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const uploadPackage = async (id, formData) => {
    const response = await api.post(`/api/listings/${id}/packages/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const submitListing = async (id) => {
    const response = await api.post(`/api/listings/${id}/submit/`);
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/api/marketplace/categories/');
    return response.data;
};

export const getTechnologies = async () => {
    const response = await api.get('/api/marketplace/technologies/');
    return response.data;
};

export const getTags = async () => {
    const response = await api.get('/api/marketplace/tags/');
    return response.data;
};

export const getPublicListings = async (page = 1) => {
    const response = await api.get(`/api/listings/public/?page=${page}`);
    return response.data;
};
