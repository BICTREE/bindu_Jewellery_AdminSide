import { discountUrl, baseUrl } from "../utils/Endpoint";

export const createDiscount = async (axiosPrivate,data) => {
  try {
    const res = await axiosPrivate.post(`${baseUrl}${discountUrl}`, data)
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
export const updateDiscount = async (axiosPrivate,id,data) => {
  try {
    const res = await axiosPrivate.put(`${baseUrl}${discountUrl}/${id}`, data)
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

export const getAllDiscount = async axiosPrivate => {
  try {
    const res = await axiosPrivate.get(discountUrl);
    if (!res.data.success) {
      return { message: "API call have some issues" };
    }

    return res.data;
  } catch (error) {
    console.log("Error fetching Banner all data:", error);
    return error;
  }
};

export const getDiscountById  = async (axiosPrivate, id) => {
  try {
    const res = await axiosPrivate.get(`${discountUrl}/${id}`);
    if (!res.data.success) {
      return { message: "API call have some issues" };
    }
    return res.data;
  } catch (error) {
    console.log("Error fetching Banner all data:", error);
    return error;
  }
};

export const deleteDiscount = async (axiosPrivate, bannerId) => {
  try {
    const res = await axiosPrivate.delete(`${discountUrl}/${bannerId}`);
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
