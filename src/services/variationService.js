import { variationUrl } from '../utils/Endpoint';

export const createVariation = async (axiosPrivate, variationData) => {
    try {
        const response = await axiosPrivate.post(variationUrl, variationData);
        return response.data;
    } catch (error) {
        console.error('Error creating variation:', error);
        throw error;
    }
}

export const updateVariation = async (axiosPrivate, variationId, variationData) => {
    try {
        const response = await axiosPrivate.put(`${variationUrl}/${variationId}`, variationData);
        return response.data;
    } catch (error) {
        console.error('Error updating variation:', error);
        throw error;
    }
}

export const deleteVariation = async (axiosPrivate, variationId) => {
    try {
        const response = await axiosPrivate.delete(`${variationUrl}/${variationId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting variation:', error);
        throw error;
    }
}

export const getVariation = async (axiosPrivate, variationId) => {
    try {
        const response = await axiosPrivate.get(`${variationUrl}/${variationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching variation:', error);
        throw error;
    }
}

export const getVariations = async (axiosPrivate, params = {}) => {
    try {
        const response = await axiosPrivate.get(variationUrl, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching variations:', error);
        throw error;
    }
}


