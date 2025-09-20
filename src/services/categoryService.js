import { categoryUrl } from '../utils/Endpoint';

export const getCategory = async (axiosPrivate, categoryId) => {
    try {
        const response = await axiosPrivate.get(`${categoryUrl}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}

export const createCategory = async (axiosPrivate, categoryData) => {
    try {
        const response = await axiosPrivate.post(categoryUrl, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

export const updateCategory = async (axiosPrivate, categoryId, categoryData) => {
    try {
        const response = await axiosPrivate.put(`${categoryUrl}/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export const updateCategoryStatus = async (axiosPrivate, categoryId, status) => {
    try {
        const response = await axiosPrivate.patch(`${categoryUrl}/${categoryId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

export const getCategories = async (axiosPrivate, params = {}) => {
    try {
        const response = await axiosPrivate.get(`${categoryUrl}/all`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching categorys:', error);
        throw error;
    }
}


