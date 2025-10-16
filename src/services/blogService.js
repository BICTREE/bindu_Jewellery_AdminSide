
import { baseUrl, BlogApi, GetAllBlogsApi } from "../utils/Endpoint";

export const GetAllBlogs = async (axiosPrivate, params = {}) => {
     
  try {
      const res = await axiosPrivate.get( `${GetAllBlogsApi}`);
      console.log(res,"api ")
    return res?.data?.data?.result;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};
export const createBlog = async (axiosPrivate, data) => {
  try {
    const res = await axiosPrivate.post(`${baseUrl}${BlogApi}`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

export const updateBlog = async (axiosPrivate, id, data) => {
  try {
    const res = await axiosPrivate.put(`${baseUrl}${BlogApi}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const getABlog = async (axiosPrivate, id) => {
  try {
    const res = await axiosPrivate.get(`${baseUrl}${BlogApi}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

export const archiveBlog = async (axiosPrivate,id,data) => {
  try {
    const res = await axiosPrivate.patch(`${BlogApi}/${id}`,data);
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
export const deleteBlog = async (axiosPrivate, bannerId) => {
  try {
    const res = await axiosPrivate.patch(`${BlogApi}/${bannerId}`);
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
