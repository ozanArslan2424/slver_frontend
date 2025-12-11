import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface RequestInterface {
	get: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	delete: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	head: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	options: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	post: <D, B>(url: string, body?: B, config?: AxiosRequestConfig) => Promise<D>;
	put: <D, B>(url: string, body?: B, config?: AxiosRequestConfig) => Promise<D>;
	patch: <D, B>(url: string, body?: B, config?: AxiosRequestConfig) => Promise<D>;
}

export type RequestConfig = {
	baseURL: string;
	withCredentials?: boolean;
	refreshEndpoint: string;
	refreshCallback: (axiosInstance: AxiosInstance) => Promise<string>;
	beforeRequest?: (config: InternalAxiosRequestConfig) => void | Promise<void>;
};
