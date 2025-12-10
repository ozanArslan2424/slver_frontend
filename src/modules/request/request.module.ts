import type { AuthResponseData } from "@/modules/auth/auth.schema";
import type { RequestConfig, RequestInterface } from "@/modules/request/request.schema";
import type { StoreModule } from "@/modules/store/store.module";
import type { StoreData } from "@/modules/store/store.schema";
import axiosDefault from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import qs from "qs";

export class RequestModule implements RequestInterface {
	private isRefreshing = false;
	private failedQueue: ((token: string) => void)[] = [];
	private instance: AxiosInstance;
	private baseURL: string;
	private withCredentials: boolean;
	private refreshEndpoint: string;
	private beforeRequest?: (config: InternalAxiosRequestConfig) => void;

	constructor(
		private readonly store: StoreModule<StoreData>,
		readonly config: RequestConfig,
	) {
		this.baseURL = config.baseURL;
		this.withCredentials = config.withCredentials;
		this.refreshEndpoint = config.refreshEndpoint;
		this.beforeRequest = config.beforeRequest;
		this.instance = this.createInstance();
		this.attachRequestInterceptor();
		this.attachResponseInterceptor();
	}

	private getAccessToken() {
		return this.store.get("accessToken");
	}
	private setAccessToken(value: string | null) {
		this.store.set("accessToken", value);
	}

	private processQueue(token: string) {
		for (const callback of this.failedQueue) {
			callback(token);
		}
		this.failedQueue = [];
	}

	private bearer(token: string) {
		return `Bearer ${token}`;
	}

	private createInstance() {
		return axiosDefault.create({
			baseURL: this.baseURL,
			timeout: 10000,
			withCredentials: this.withCredentials,
			paramsSerializer: (params) =>
				qs.stringify(params, {
					filter: (_, value) => (value ? value : undefined),
					skipNulls: true,
					arrayFormat: "indices",
					serializeDate: (date) => date.toISOString(),
				}),
		});
	}

	private attachRequestInterceptor() {
		this.instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const token = this.getAccessToken();
				if (token) {
					config.headers.Authorization = this.bearer(token);
				}

				this.beforeRequest?.(config);

				return config;
			},
			(err) => Promise.reject(err),
		);
	}

	private attachResponseInterceptor() {
		this.instance.interceptors.response.use(
			(res: AxiosResponse) => res,
			async (err) => {
				const config = err.config;

				const isRefreshError = config.url?.includes(this.refreshEndpoint);
				const isDifferentError = err.response?.status !== 401;
				const isRetryError = config._retry;

				if (isRefreshError || isDifferentError || isRetryError) {
					return Promise.reject(err);
				}

				config._retry = true;

				if (this.isRefreshing) {
					return new Promise((resolve) => {
						this.failedQueue.push((newToken: string) => {
							config.headers.Authorization = this.bearer(newToken);
							config._retry = false;
							resolve(this.instance(config));
						});
					});
				}

				try {
					this.isRefreshing = true;
					this.setAccessToken(null);
					const res = await this.instance.post<AuthResponseData>(this.refreshEndpoint);
					const newToken = res.data.accessToken;
					this.setAccessToken(newToken);
					this.instance.defaults.headers.common.Authorization = this.bearer(newToken);
					config.headers.Authorization = this.bearer(newToken);
					this.processQueue(newToken);
					return this.instance(config);
				} catch (refreshErr) {
					this.failedQueue = [];
					return Promise.reject(refreshErr);
				} finally {
					this.isRefreshing = false;
				}
			},
		);
	}

	private async resolve<T>(promise: Promise<AxiosResponse<T>>) {
		const res = await promise;
		return res.data;
	}

	get: RequestInterface["get"] = (url, config) => this.resolve(this.instance.get(url, config));

	delete: RequestInterface["delete"] = (url, config) =>
		this.resolve(this.instance.delete(url, config));

	head: RequestInterface["head"] = (url, config) => this.resolve(this.instance.head(url, config));

	options: RequestInterface["options"] = (url, config) =>
		this.resolve(this.instance.options(url, config));

	post: RequestInterface["post"] = (url, body, config) =>
		this.resolve(this.instance.post(url, body, config));

	put: RequestInterface["put"] = (url, body, config) =>
		this.resolve(this.instance.put(url, body, config));

	patch: RequestInterface["patch"] = (url, body, config) =>
		this.resolve(this.instance.patch(url, body, config));
}
