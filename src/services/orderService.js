import { orderUrl } from '../utils/Endpoint';

export const updateOrder = async (axiosPrivate, orderId, orderData) => {
    try {
        const response = await axiosPrivate.put(`${orderUrl}/${orderId}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

export const getOrders = async (axiosPrivate, params = {}) => {
    try {
        const response = await axiosPrivate.get(`${orderUrl}/all`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export const getOrder = async (axiosPrivate, orderId) => {
    try {
        const response = await axiosPrivate.get(`${orderUrl}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

