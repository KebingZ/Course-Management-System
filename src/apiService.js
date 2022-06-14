import axios from "axios"
import { endPoint } from "./domain"

const user = JSON.parse(window.localStorage.getItem("user")) || null
const axiosInst = axios.create({
    endPoint,
    withCredentials: true,
    responseType: "json",
})

axiosInst.interceptors.request.use((config) => {
    if (!config.url.includes("login")) {
        console.log(user?.token)
        return {
            ...config,
            headers: {
                ...config.headers,
                Authorization: "Bearer " + user?.token
            }
        }
    }
    return config
})

export default axiosInst;