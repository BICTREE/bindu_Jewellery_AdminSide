import { dashboardUrl } from "../utils/Endpoint"

export const getDashboardData  = async(axiosPrivate)=>{
    try {
        const response = await axiosPrivate.get(dashboardUrl)
        return response.data;
    } catch (error) {
        console.log(error)
        throw Error(error)
    }
}