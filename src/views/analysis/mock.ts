// analysis模块模拟数据和类型
export interface AnalysisData {
	id: string;
	app: string;
	dimension: string;
	value: number;
	timestamp: string;
	region?: string;
	device?: string;
	browser?: string;
	os?: string;
}

export const ANALYSIS_APP_OPTIONS = [
	{ value: "app1", label: "电商前台" },
	{ value: "app2", label: "管理后台" },
	{ value: "app3", label: "移动端" },
	{ value: "app4", label: "小程序" },
];

export const ANALYSIS_REGION_OPTIONS = [
	{ value: "beijing", label: "北京" },
	{ value: "shanghai", label: "上海" },
	{ value: "guangzhou", label: "广州" },
	{ value: "shenzhen", label: "深圳" },
];

export const ANALYSIS_DEVICE_OPTIONS = [
	{ value: "desktop", label: "PC端" },
	{ value: "mobile", label: "移动端" },
	{ value: "tablet", label: "平板" },
];

export const ANALYSIS_BROWSER_OPTIONS = [
	{ value: "chrome", label: "Chrome" },
	{ value: "safari", label: "Safari" },
	{ value: "firefox", label: "Firefox" },
	{ value: "edge", label: "Edge" },
];

export const ANALYSIS_DIMENSION_OPTIONS = [
	{ value: "pv", label: "页面访问量(PV)" },
	{ value: "uv", label: "独立访客(UV)" },
	{ value: "error_rate", label: "错误率" },
	{ value: "load_time", label: "加载时间" },
	{ value: "bounce_rate", label: "跳出率" },
	{ value: "session_duration", label: "会话时长" },
];
