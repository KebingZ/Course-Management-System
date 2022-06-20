import { message } from "antd";
import axios from "axios";
import { endPoint } from "./domain";

const user = JSON.parse(window.localStorage.getItem("user")) || null;
const axiosInst = axios.create({
  endPoint,
  withCredentials: true,
  responseType: "json",
});

axiosInst.interceptors.request.use((config) => {
  if (!config.url.includes("login")) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: "Bearer " + user?.token,
      },
    };
  }
  return config;
});

export const post = (path, params) => {
  const url = endPoint + path;

  return axiosInst
    .post(url, params)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error.message);
      return error;
    });
};

export const get = (path, params) => {
  const url = endPoint + path;

  return axiosInst
    .get(url, params)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error.message);
      return error;
    });
};

export const put = (path, params) => {
  const url = endPoint + path;

  return axiosInst
    .put(url, params)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error.message);
      return error;
    });
};

export const apiDelete = (path) => {
  const url = endPoint + path;

  return axiosInst
    .delete(url)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error.message);
      return error;
    });
};

export default axiosInst;
