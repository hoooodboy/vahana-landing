import Axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { ApiResponse } from '../model';
const { VITE_APP_API_HOST } = import.meta.env;

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  // baseURL: 'http://localhost:4200',
  // baseURL: VITE_API_URL,
  timeout: 15 * 1000,
});

export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> => {
  const beginAt = new Date().getTime();
  const method = config.method ?? "GET";
  const url = config.url;

  console.log(method, url);

  return axiosInstance({
    ...config,
  }).then((response) => {
    const endAt = new Date().getTime();
    const diff = (endAt - beginAt) / 1000;

    console.group("(", diff, ")", method, url);
    console.log("response", response);
    console.log("data", response.data);
    console.log("config", response.config);
    console.log("request", response.request);
    console.groupEnd();

    return response.data as T;
  });
};

export class unsecretError<T> extends AxiosError<T> {}

export interface ErrorType<Error> extends unsecretError<Error> {}

export type CustomErrorType = unsecretError<any>;
