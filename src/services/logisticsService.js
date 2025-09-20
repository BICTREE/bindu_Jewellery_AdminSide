import { shipCostsUrl } from "../utils/Endpoint";

export const getAllShipCosts = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(`${shipCostsUrl}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shipping costs:", error);
        throw error;
    }
}

export const getShipCostById = async (axiosPrivate, id) => {
    try {
        const response = await axiosPrivate.get(`${shipCostsUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shipping cost by ID:", error);
        throw error;
    }
}

export const createShipCost = async (axiosPrivate, shipCostData) => {
    try {
        const response = await axiosPrivate.post(shipCostsUrl, shipCostData);
        return response.data;
    } catch (error) {
        console.error("Error creating shipping cost:", error);
        throw error;
    }
}

export const updateShipCost = async (axiosPrivate, id, shipCostData) => {
    try {
        const response = await axiosPrivate.put(`${shipCostsUrl}/${id}`, shipCostData);
        return response.data;
    } catch (error) {
        console.error("Error updating shipping cost:", error);
        throw error;
    }
}

export const updateManyShipCost = async (axiosPrivate, shipCostData) => {
    try {
        const response = await axiosPrivate.put(`${shipCostsUrl}/all`, shipCostData);
        return response.data;
    } catch (error) {
        console.error("Error updating shipping cost:", error);
        throw error;
    }
}

