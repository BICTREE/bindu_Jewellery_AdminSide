import { bannerUrl, baseUrl } from "../utils/Endpoint";

export const getAllBanner = async axiosPrivate => {
  try {
    const res = await axiosPrivate.get(bannerUrl);
    if (!res.data.success) {
      return { message: "API call have some issues" };
    }

    return res.data;
  } catch (error) {
    console.log("Error fetching Banner all data:", error);
    return error;
  }
};

export const createBanner = async (axiosPrivate,data) => {
  try {
    const res = await axiosPrivate.post(`${baseUrl}${bannerUrl}`, data)
    console.log(res.data);
    return res.data
  } catch (error) {
    console.log(
      "Creating banner have some problem pls try after some time",
      error
    );
    return error;
  }
};
export const updateBanner = async (axiosPrivate,id,data) => {
  try {
    const res = await axiosPrivate.put(`${baseUrl}${bannerUrl}/${id}`, data)
    console.log(res.data);
    return res.data
  } catch (error) {
    console.log(
      "Creating banner have some problem pls try after some time",
      error
    );
    return error;
  }
};

export const getABanner = async (axiosPrivate, id) => {
  try {
    const res = await axiosPrivate.get(`${bannerUrl}/${id}`);
    if (!res.data.success) {
      return { message: "API call have some issues" };
    }
    return res.data;
  } catch (error) {
    console.log("Error fetching Banner all data:", error);
    return error;
  }
};

export const deleteBanner = async (axiosPrivate, bannerId) => {
  try {
    const res = await axiosPrivate.delete(`${bannerUrl}/${bannerId}`);
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
