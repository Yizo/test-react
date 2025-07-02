import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export type ResponseHandler<T = AxiosResponse> = (response: AxiosResponse) => Promise<T> | void;

export interface CodeErrorHandler {
	code: number | string;
	handler: (res: AxiosResponse) => void;
}

export interface UseRequestOptions {
	baseURL: string;
	timeout?: number;

	// 请求拦截前处理
	// 主要是添加token/appkey
	beforeRequest: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;

	// 默认错误处理
	// 处理拦截器reject的错误
	errorHandler: (res: AxiosError) => Promise<any> | void;

	// 响应拦截相关
	// 判断请求成功还是失败
	// 处理响应数据
	// 注意流文件
	responseHandler: ResponseHandler<AxiosResponse>;
}

export const ErrorMessageEnum = {
	// 网络相关错误
	NETWORK_ERROR: "网络错误，请检查网络连接",
	REQUEST_TIMEOUT: "请求超时，请稍后重试",
	NETWORK_DISCONNECT: "服务器未响应，请检查网络或重试",
	REQUEST_CANCELLED: "请求已取消",
	// 默认错误
	UNKNOWN_ERROR: "未知错误: {message}",
	REQUEST_ERROR: "请求异常: {message}", // 带占位符
} as const;

export interface UseRequestReturn {
	request: AxiosInstance;
	handleError: (error: AxiosError | Error) => string;
}
