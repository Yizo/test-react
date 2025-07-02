import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useRequest, useMessage } from "@/hooks";
import type { UseRequestReturn } from "@/hooks";
import { useUserStore, useCommonStore } from "@/stores";

// 扩展 Window 接口
declare global {
	interface Window {
		$wujie?: {
			bus?: {
				$emit: (event: string, data?: any) => void;
			};
		};
	}
}

export interface UseApiConfig {
	// 其他配置项可以根据需要添加
	whiteList?: string[];
	baseURL?: string;
}

let requestInstance: UseRequestReturn | null = null;

export function useApi() {
	// loading白名单接口
	const whiteList = ["/login"];

	const commonStore = useCommonStore();
	const userStore = useUserStore();

	const { modal } = useMessage();

	if (requestInstance) {
		return requestInstance;
	}

	const { request, handleError } = useRequest({
		baseURL: import.meta.env.VITE_API_URL,
		beforeRequest: (config: AxiosRequestConfig) => {
			if (!config.headers) {
				config.headers = {};
			}
			config.headers["access-token"] = userStore.getToken() as string;
			if (
				config.responseType &&
				config.responseType == "blob" &&
				!config.headers["content-type"]
			) {
				config.headers["content-type"] = "application/x-www-form-urlencoded";
			} else if (!config.headers["content-type"]) {
				config.headers["content-type"] = "application/json";
			}
			if (!whiteList.includes(config.url as string)) {
				commonStore.add();
			}
			return Promise.resolve(config);
		},
		// 响应拦截相关
		responseHandler: (res: AxiosResponse) => {
			const { data } = res;
			commonStore.del();
			if (data.code != null && data.code !== 0) {
				console.log("responseHandler", res);
				const message = data?.message || `接口异常:${res.config.url}`;
				if ([10010004, 173001].includes(+data.code)) {
					userStore.logout();
					if (window.$wujie?.bus) {
						window.$wujie.bus.$emit("sub-timeout", data.message || "登录超时");
					}
				}
				modal.error({
					title: "提示",
					content: message,
				});
				return Promise.reject({
					...res,
					message,
				});
			}
			return Promise.resolve(data);
		},
		// 默认错误处理
		// 处理拦截器reject的错误
		errorHandler: (res: AxiosError) => {
			console.error("errorHandler", res);
			commonStore.del();
			const message = handleError(res);
			if (message) {
				modal.error({
					title: "提示",
					content: message,
				});
				return Promise.reject({
					...res,
					message,
				});
			}
			return Promise.reject(res);
		},
	});
	requestInstance = {
		request,
		handleError,
	};
	return { request, handleError };
}
