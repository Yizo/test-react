import axios from "axios";
import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import type { UseRequestOptions, UseRequestReturn } from "./types";
import { ErrorMessageEnum } from "./types";

function handleError(error: AxiosError | Error): string {
	let message = "";
	if (axios.isAxiosError(error)) {
		if (axios.isCancel(error)) {
			// 请求取消
			message = ErrorMessageEnum.REQUEST_CANCELLED;
		} else if (error?.code === "ECONNABORTED") {
			// 请求超时
			message = ErrorMessageEnum.REQUEST_TIMEOUT;
		} else if (error.code === "NETWORK_ERROR") {
			// 网络错误
			message = ErrorMessageEnum.NETWORK_ERROR;
		} else if (error.response) {
			// 接口错误
			const { status, data } = error.response;
			if ((data as any).message) {
				message = `HTTP 错误: ${status} - ${(data as any).message}`;
			} else {
				message = `HTTP 错误: ${status} - ${data ? JSON.stringify(data) : ""}`;
			}
		} else if (error.request) {
			message = ErrorMessageEnum.NETWORK_DISCONNECT;
		} else {
			message = ErrorMessageEnum.REQUEST_ERROR.replace("{message}", error.message);
		}
	} else {
		// 非 axios 错误，可能是代码运行时错误
		message = ErrorMessageEnum.UNKNOWN_ERROR.replace("{message}", error?.message || "");
	}
	return message;
}

export function useRequest(options: UseRequestOptions): UseRequestReturn {
	const request = axios.create({
		baseURL: options.baseURL || "",
		timeout: options.timeout || 60000,
	});

	request.interceptors.request.use(
		async (config) => {
			if (options.beforeRequest) {
				const newConfig = await options.beforeRequest(config);
				return (newConfig as typeof config) || config;
			}
			return config;
		},
		(requestError: AxiosError) => {
			const result = options.errorHandler(requestError);
			if (result) {
				return result;
			}
			return Promise.reject(requestError);
		}
	);

	// 响应拦截器
	request.interceptors.response.use(
		async (response: AxiosResponse) => {
			if (response.status !== 200) {
				const error = new AxiosError(
					undefined,
					"ERR_BAD_RESPONSE",
					response.config,
					response.request,
					response
				);
				const result = options.errorHandler(error);
				if (result) {
					return result;
				}
				return Promise.reject(response);
			}
			const data = options.responseHandler(response);
			if (data) {
				return data;
			}
			return Promise.resolve(response);
		},
		async (error: AxiosError) => {
			const result = options.errorHandler(error);
			if (result) {
				return result;
			}
			return Promise.reject(error);
		}
	);

	return {
		request,
		handleError,
	};
}

export * from "./types";
