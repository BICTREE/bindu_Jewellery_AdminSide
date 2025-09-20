import { siteSettingsUrl } from "../utils/Endpoint";

export const getSiteSettings = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(siteSettingsUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching settings:", error);
        throw error;
    }
}

export const updateSiteSettings = async (axiosPrivate, settingsData) => {
    try {
        const response = await axiosPrivate.put(siteSettingsUrl, settingsData);
        return response.data;
    } catch (error) {
        console.error("Error updating settings:", error);
        throw error;
    }
}