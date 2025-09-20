import { productUrl } from '../utils/Endpoint';

export const getProduct = async (axiosPrivate, productId) => {
    try {
        const response = await axiosPrivate.get(`${productUrl}/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export const createProduct = async (axiosPrivate, productData) => {
    try {
        const response = await axiosPrivate.post(productUrl, productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export const updateProduct = async (axiosPrivate, productId, productData) => {
    try {
        const response = await axiosPrivate.put(`${productUrl}/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export const updateProductStatus = async (axiosPrivate, productId, status) => {
    try {
        const response = await axiosPrivate.patch(`${productUrl}/${productId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export const getProducts = async (axiosPrivate, params = {}) => {
    try {
        const response = await axiosPrivate.get(`${productUrl}/all`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}


