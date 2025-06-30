import axios from "axios";
import type { AxiosResponse, AxiosInstance, AxiosError } from "axios";

function useRequest(options: Partial<{ baseURL: string; timeout: number }> = {}): AxiosInstance {
	const request = axios.create({
		baseURL: options.baseURL || import.meta.env.VITE_API_URL,
		timeout: options.timeout || 60000,
	});

	request.defaults.headers.common["Content-Type"] = "application/json";
	request.defaults.headers.common["Accept"] = "application/json";

	request.interceptors.request.use(
		async (config) => {
			return config;
		},
		(requestError: AxiosError) => {
			return Promise.reject(requestError);
		}
	);

	request.interceptors.response.use(
		async (response: AxiosResponse) => {
			if (response.status !== 200) {
				return Promise.reject(response);
			}
			return Promise.resolve(response);
		},
		async (error: AxiosError) => {
			return Promise.reject(error);
		}
	);

	return request;
}

export const fetcher = useRequest();
