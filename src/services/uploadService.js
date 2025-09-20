import { uploadUrl } from "../utils/Endpoint";

export const uploadSingleFile = async (axiosPrivate, file) => {
    try {
        console.log(file, "file from the single image")
        const formData = new FormData()
        formData.append('file', file)
        const response = await axiosPrivate.post(`${uploadUrl}/single`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/formdata'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export const uploadMultipleFiles = async (axiosPrivate, files = []) => {
    try {
        const formData = new FormData()
        files.forEach(element => {
            formData.append('files', element)
        });
        
        const response = await axiosPrivate.post(`${uploadUrl}/multiple`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/formdata'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}