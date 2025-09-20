import { userUrl } from '../utils/Endpoint';

export const getUser = async (axiosPrivate, userId) => {
    try {
        const response = await axiosPrivate.get(`${userUrl}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export const updateUser = async (axiosPrivate, userId, userData) => {
    try {
        const response = await axiosPrivate.put(`${userUrl}/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const updateUserStatus = async (axiosPrivate, userId, status) => {
    try {
        const response = await axiosPrivate.patch(`${userUrl}/${userId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export const getUsers = async (axiosPrivate, params = {}) => {
    try {
        const response = await axiosPrivate.get(userUrl, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}


