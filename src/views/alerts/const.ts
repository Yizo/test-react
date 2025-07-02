// 告警规则相关常量

// 监控类型映射
export const ALERT_TYPE_MAP = {
	error: { text: "错误监控", color: "red" },
	performance: { text: "性能监控", color: "orange" },
	network: { text: "网络监控", color: "blue" },
	custom: { text: "自定义", color: "purple" },
} as const;

// 监控类型下拉选项
export const ALERT_TYPE_OPTIONS = [
	{ value: "error", label: "错误监控" },
	{ value: "performance", label: "性能监控" },
	{ value: "network", label: "网络监控" },
	{ value: "custom", label: "自定义" },
];

// 状态下拉选项
export const ALERT_STATUS_OPTIONS = [
	{ value: "active", label: "启用" },
	{ value: "inactive", label: "禁用" },
];

// 通知方式下拉选项
export const NOTIFICATION_METHOD_OPTIONS = [
	{ value: "email", label: "邮件" },
	{ value: "sms", label: "短信" },
	{ value: "dingtalk", label: "钉钉" },
	{ value: "webhook", label: "Webhook" },
];

// 告警级别映射
export const ALERT_LEVEL_MAP = {
	critical: { text: "严重", color: "red" },
	warning: { text: "警告", color: "orange" },
	info: { text: "信息", color: "blue" },
} as const;

// 告警级别下拉选项
export const ALERT_LEVEL_OPTIONS = [
	{ value: "critical", label: "严重" },
	{ value: "warning", label: "警告" },
	{ value: "info", label: "信息" },
];

// 告警状态映射
export const ALERT_STATUS_MAP = {
	active: { text: "活跃", color: "red" },
	resolved: { text: "已解决", color: "green" },
	suppressed: { text: "已抑制", color: "gray" },
} as const;

// 告警状态下拉选项
export const ALERT_STATUS_FILTER_OPTIONS = [
	{ value: "active", label: "活跃" },
	{ value: "resolved", label: "已解决" },
	{ value: "suppressed", label: "已抑制" },
];

// 告警渠道类型映射
export const CHANNEL_TYPE_MAP = {
	email: { label: "邮件", color: "blue" },
	sms: { label: "短信", color: "orange" },
	webhook: { label: "Webhook", color: "purple" },
	dingtalk: { label: "钉钉", color: "cyan" },
	wechat: { label: "微信", color: "green" },
} as const;

// 告警渠道类型下拉选项
export const CHANNEL_TYPE_OPTIONS = [
	{ value: "email", label: "邮件" },
	{ value: "sms", label: "短信" },
	{ value: "webhook", label: "Webhook" },
	{ value: "dingtalk", label: "钉钉" },
	{ value: "wechat", label: "微信" },
];

// 测试结果映射
export const TEST_RESULT_MAP = {
	success: { text: "成功", color: "green" },
	failed: { text: "失败", color: "red" },
} as const;

// 告警渠道表单校验规则
export const CHANNEL_FORM_RULES = {
	name: [{ required: true, message: "请输入渠道名称" }],
	type: [{ required: true, message: "请选择渠道类型" }],
	target: [{ required: true, message: "请输入目标地址" }],
};

// 告警历史类型映射
export const ALERT_HISTORY_TYPE_MAP = {
	error: { text: "错误监控", color: "red" },
	performance: { text: "性能监控", color: "orange" },
	network: { text: "网络监控", color: "blue" },
	custom: { text: "自定义", color: "purple" },
} as const;

// 告警历史类型下拉选项
export const ALERT_HISTORY_TYPE_OPTIONS = [
	{ value: "error", label: "错误监控" },
	{ value: "performance", label: "性能监控" },
	{ value: "network", label: "网络监控" },
	{ value: "custom", label: "自定义" },
];

// 告警历史级别映射
export const ALERT_HISTORY_LEVEL_MAP = {
	low: { text: "低", color: "green" },
	medium: { text: "中", color: "orange" },
	high: { text: "高", color: "red" },
	critical: { text: "紧急", color: "magenta" },
} as const;

// 告警历史级别下拉选项
export const ALERT_HISTORY_LEVEL_OPTIONS = [
	{ value: "low", label: "低" },
	{ value: "medium", label: "中" },
	{ value: "high", label: "高" },
	{ value: "critical", label: "紧急" },
];

// 告警历史状态映射
export const ALERT_HISTORY_STATUS_MAP = {
	pending: { text: "待处理", color: "orange" },
	processing: { text: "处理中", color: "blue" },
	resolved: { text: "已解决", color: "green" },
	ignored: { text: "已忽略", color: "default" },
} as const;

// 告警历史状态下拉选项
export const ALERT_HISTORY_STATUS_OPTIONS = [
	{ value: "pending", label: "待处理" },
	{ value: "processing", label: "处理中" },
	{ value: "resolved", label: "已解决" },
	{ value: "ignored", label: "已忽略" },
];

// 告警规则类型映射
export const ALERT_RULE_TYPE_MAP = {
	error: { text: "错误监控", color: "red" },
	performance: { text: "性能监控", color: "orange" },
	network: { text: "网络监控", color: "blue" },
	custom: { text: "自定义", color: "purple" },
} as const;

// 告警规则类型下拉选项
export const ALERT_RULE_TYPE_OPTIONS = [
	{ value: "error", label: "错误监控" },
	{ value: "performance", label: "性能监控" },
	{ value: "network", label: "网络监控" },
	{ value: "custom", label: "自定义" },
];

// 告警规则状态下拉选项
export const ALERT_RULE_STATUS_OPTIONS = [
	{ value: "active", label: "启用" },
	{ value: "inactive", label: "禁用" },
];

// 告警规则表单校验规则
export const ALERT_RULE_FORM_RULES = {
	name: [{ required: true, message: "请输入规则名称" }],
	type: [{ required: true, message: "请选择监控类型" }],
	thresholdValue: [{ required: true, message: "请输入阈值" }],
	appName: [{ required: true, message: "请输入应用名称" }],
	appKey: [{ required: true, message: "请输入AppKey" }],
};
