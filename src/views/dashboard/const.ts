// dashboard模块相关常量

// 告警级别映射
export const ALERT_LEVEL_MAP = {
	high: { text: "严重", color: "red" },
	medium: { text: "警告", color: "orange" },
	low: { text: "信息", color: "blue" },
} as const;

// 告警状态映射
export const ALERT_STATUS_MAP = {
	active: { text: "活跃", color: "red" },
	resolved: { text: "已解决", color: "green" },
} as const;

// 应用状态映射
export const APP_STATUS_MAP = {
	running: { color: "green", icon: "CheckCircleOutlined", text: "运行中" },
	warning: { color: "orange", icon: "WarningOutlined", text: "警告" },
	error: { color: "red", icon: "CloseCircleOutlined", text: "错误" },
} as const;

// 健康度等级划分
export const HEALTH_LEVEL = {
	GOOD: 90, // 90分及以上为良好
	WARNING: 70, // 70-90分为警告
	ERROR: 0, // 70分以下为错误
} as const;

// 健康度颜色映射
export const HEALTH_COLOR_MAP = {
	GOOD: "#52c41a", // 绿色
	WARNING: "#faad14", // 黄色
	ERROR: "#ff4d4f", // 红色
} as const;

// 仪表盘时间过滤选项
export const TIME_FILTER_OPTIONS = [
	{ value: "today", label: "今日" },
	{ value: "week", label: "本周" },
	{ value: "month", label: "本月" },
	{ value: "custom", label: "自定义" },
];

// 告警类型选项
export const ALERT_TYPE_OPTIONS = [
	{ value: "error_rate", label: "错误率" },
	{ value: "response_time", label: "响应时间" },
	{ value: "cpu_usage", label: "CPU使用率" },
	{ value: "memory_usage", label: "内存使用率" },
	{ value: "disk_space", label: "磁盘空间" },
	{ value: "connection", label: "连接异常" },
];

// 图表颜色方案
export const CHART_COLORS = [
	"#1890ff", // 蓝色
	"#52c41a", // 绿色
	"#faad14", // 黄色
	"#f5222d", // 红色
	"#722ed1", // 紫色
	"#13c2c2", // 青色
];
