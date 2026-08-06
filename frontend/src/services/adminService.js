import api from '../utils/api';

export const getReports = async () => {
  const response = await api.get('/api/admin/reports/');
  return response.data;
};

export const getUsers = async (params) => {
  const response = await api.get('/api/admin/users/', { params });
  return response.data;
};

export const banUser = async (userId) => {
  const response = await api.post(`/api/admin/users/${userId}/ban/`);
  return response.data;
};

export const unbanUser = async (userId) => {
  const response = await api.post(`/api/admin/users/${userId}/unban/`);
  return response.data;
};

export const getVerifications = async (params) => {
  const response = await api.get('/api/admin/verifications/', { params });
  return response.data;
};

export const approveVerification = async (appId) => {
  const response = await api.post(`/api/admin/verifications/${appId}/approve/`);
  return response.data;
};

export const rejectVerification = async (appId) => {
  const response = await api.post(`/api/admin/verifications/${appId}/reject/`);
  return response.data;
};

export const getListings = async (params) => {
  const response = await api.get('/api/admin/listings/', { params });
  return response.data;
};

export const approveListing = async (listingId) => {
  const response = await api.post(`/api/admin/listings/${listingId}/approve/`);
  return response.data;
};

export const rejectListing = async (listingId, reason) => {
  const response = await api.post(`/api/admin/listings/${listingId}/reject/`, { reason });
  return response.data;
};

export const getAuditLogs = async (params) => {
  const response = await api.get('/api/audit/logs/', { params });
  return response.data;
};
