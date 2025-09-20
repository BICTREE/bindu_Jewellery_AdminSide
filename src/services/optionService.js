import { optionUrl } from '../utils/Endpoint';

export const createOption = async (axiosPrivate, optionData) => {
    try {
        const response = await axiosPrivate.post(optionUrl, optionData);
        return response.data;
    } catch (error) {
        console.error('Error creating option:', error);
        throw error;
    }
}

export const updateOption = async (axiosPrivate, optionId, optionData) => {
    try {
        const response = await axiosPrivate.put(`${optionUrl}/${optionId}`, optionData);
        return response.data;
    } catch (error) {
        console.error('Error updating option:', error);
        throw error;
    }
}

export const deleteOption = async (axiosPrivate, optionId) => {
    try {
        const response = await axiosPrivate.delete(`${optionUrl}/${optionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting option:', error);
        throw error;
    }
}

export const getOption = async (axiosPrivate, optionId) => {
    try {
        const response = await axiosPrivate.get(`${optionUrl}/${optionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching option:', error);
        throw error;
    }
}

export const getOptions = async (axiosPrivate, params = {}) => {
    try {
        const response = await axiosPrivate.get(optionUrl, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching options:', error);
        throw error;
    }
}


