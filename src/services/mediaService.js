import { baseUrl, GetAllmediaUrl, mediaUrl } from "../utils/Endpoint";

export const GetAllMedia = async (axiosPrivate, params = {}) => {
     
  try {
      const res = await axiosPrivate.get( `${GetAllmediaUrl}`);
      console.log(res,"api ")
    return res?.data?.data?.result;
  } catch (error) {
    console.error("Error fetching Media:", error);
    throw error;
  }
};
export const createMedia = async (axiosPrivate, data) => {
  try {
    const res = await axiosPrivate.post(`${baseUrl}${mediaUrl}`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating Media:", error);
    throw error;
  }
};

export const updateMedia = async (axiosPrivate, id, data) => {
  try {
    const res = await axiosPrivate.put(`${baseUrl}${mediaUrl}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating Media:", error);
    throw error;
  }
};

export const getAMedia = async (axiosPrivate, id) => {
  try {
    const res = await axiosPrivate.get(`${baseUrl}${mediaUrl}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching Media:", error);
    throw error;
  }
};

export const archiveMedia = async (axiosPrivate,id,data) => {
  try {
    const res = await axiosPrivate.patch(`${mediaUrl}/${id}`,data);
    if (!res.data.success) {
      return {
        message:
          "Delete this banner have some problem please try after sometime"
      };
    }

    return res.data;
  } catch (error) {
    console.log("error while we delete the Media", error);
    return error;
  }
};
export const deleteMedia= async (axiosPrivate, bannerId) => {
  try {
    const res = await axiosPrivate.patch(`${mediaUrl}/${bannerId}`);
    if (!res.data.success) {
      return {
        message:
          "Delete this banner have some problem please try after sometime"
      };
    }

    return res.data;
  } catch (error) {
    console.log("error while we delete the banner", error);
    return error;
  }
};
