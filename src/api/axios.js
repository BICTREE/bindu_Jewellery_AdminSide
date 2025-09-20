import axios from 'axios';
import { baseUrl } from "../utils/Endpoint";

export default axios.create({
    baseURL: baseUrl,
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});