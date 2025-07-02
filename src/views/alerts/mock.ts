// alerts模块模拟数据和类型
export interface AlertItem {
	id: string;
	name: string;
	level: "critical" | "warning" | "info";
	status: "active" | "resolved" | "suppressed";
	app: string;
	metric: string;
	value: number;
	threshold: number;
	duration: string;
	lastTriggered: string;
	count: number;
	description: string;
}

export const mockAlerts: AlertItem[] = [
	{
		id: "1",
		name: "响应时间过长",
		level: "critical",
		status: "active",
		app: "用户中心",
		metric: "response_time",
		value: 5200,
		threshold: 3000,
		duration: "5分钟",
		lastTriggered: "2024-01-15 14:30:25",
		count: 12,
		description: "API响应时间超过阈值3秒",
	},
	{
		id: "2",
		name: "CPU使用率过高",
		level: "warning",
		status: "active",
		app: "订单系统",
		metric: "cpu_usage",
		value: 85,
		threshold: 80,
		duration: "3分钟",
		lastTriggered: "2024-01-15 14:25:10",
		count: 8,
		description: "CPU使用率持续超过80%",
	},
	{
		id: "3",
		name: "错误率异常",
		level: "critical",
		status: "resolved",
		app: "支付系统",
		metric: "error_rate",
		value: 5.2,
		threshold: 1.0,
		duration: "10分钟",
		lastTriggered: "2024-01-15 13:45:30",
		count: 25,
		description: "5xx错误率超过1%",
	},
];

export interface AlertRule {
	id: string;
	name: string;
	type: "error" | "performance" | "network" | "custom";
	threshold: string;
	thresholdValue: number;
	status: "active" | "inactive";
	appName: string;
	appKey: string;
	createTime: string;
	triggerCount: number;
	notificationMethods: string[];
}

export const mockAlertRules: AlertRule[] = [
	{
		id: "1",
		name: "错误率告警",
		type: "error",
		threshold: "错误率 > 5%",
		thresholdValue: 5,
		status: "active",
		appName: "官网前端",
		appKey: "app_web_001",
		createTime: "2024-01-15 10:30:00",
		triggerCount: 12,
		notificationMethods: ["email", "dingtalk"],
	},
	{
		id: "2",
		name: "页面加载时间告警",
		type: "performance",
		threshold: "页面加载时间 > 3s",
		thresholdValue: 3,
		status: "active",
		appName: "移动端H5",
		appKey: "app_mobile_002",
		createTime: "2024-01-10 09:00:00",
		triggerCount: 5,
		notificationMethods: ["email"],
	},
	{
		id: "3",
		name: "API响应时间告警",
		type: "network",
		threshold: "API响应时间 > 2s",
		thresholdValue: 2,
		status: "inactive",
		appName: "官网前端",
		appKey: "app_web_001",
		createTime: "2024-01-08 14:20:00",
		triggerCount: 0,
		notificationMethods: ["webhook"],
	},
];

export interface AlertChannel {
	id: string;
	name: string;
	type: "email" | "sms" | "webhook" | "dingtalk" | "wechat";
	target: string;
	description?: string;
	status: "active" | "inactive";
	createTime: string;
	lastTestTime?: string;
	testResult?: "success" | "failed";
}

export const mockAlertChannels: AlertChannel[] = [
	{
		id: "1",
		name: "开发团队邮箱",
		type: "email",
		target: "dev-team@company.com",
		description: "开发团队通知邮箱",
		status: "active",
		createTime: "2024-01-15 10:30:00",
		lastTestTime: "2024-01-20 15:20:00",
		testResult: "success",
	},
	{
		id: "2",
		name: "运维钉钉群",
		type: "dingtalk",
		target: "https://oapi.dingtalk.com/robot/send?access_token=xxx",
		description: "运维团队钉钉机器人",
		status: "active",
		createTime: "2024-01-10 14:20:00",
		lastTestTime: "2024-01-22 09:15:00",
		testResult: "success",
	},
	{
		id: "3",
		name: "短信告警",
		type: "sms",
		target: "13800138000,13900139000",
		description: "紧急事件短信通知",
		status: "inactive",
		createTime: "2024-01-08 16:45:00",
	},
	{
		id: "4",
		name: "自定义Webhook",
		type: "webhook",
		target: "https://api.company.com/alert-webhook",
		description: "自定义告警处理接口",
		status: "active",
		createTime: "2024-01-12 11:00:00",
		lastTestTime: "2024-01-21 18:30:00",
		testResult: "failed",
	},
];

export interface AlertHistory {
	id: string;
	ruleName: string;
	type: "error" | "performance" | "network" | "custom";
	appName: string;
	appKey: string;
	triggerTime: string;
	level: "low" | "medium" | "high" | "critical";
	status: "pending" | "processing" | "resolved" | "ignored";
	content: string;
	handler: string;
	handleTime?: string;
	handleNote?: string;
}

export const mockAlertHistory: AlertHistory[] = [
	{
		id: "1",
		ruleName: "错误率告警",
		type: "error",
		appName: "官网前端",
		appKey: "app_web_001",
		triggerTime: "2024-01-20 14:30:00",
		level: "high",
		status: "resolved",
		content: "错误率达到8.5%，超过阈值5%",
		handler: "张三",
		handleTime: "2024-01-20 14:45:00",
		handleNote: "已修复相关bug，错误率恢复正常",
	},
	{
		id: "2",
		ruleName: "页面加载时间告警",
		type: "performance",
		appName: "移动端H5",
		appKey: "app_mobile_002",
		triggerTime: "2024-01-20 10:15:00",
		level: "medium",
		status: "processing",
		content: "首页加载时间达到4.2秒，超过阈值3秒",
		handler: "李四",
		handleTime: "2024-01-20 10:30:00",
	},
	{
		id: "3",
		ruleName: "API响应时间告警",
		type: "network",
		appName: "官网前端",
		appKey: "app_web_001",
		triggerTime: "2024-01-19 16:20:00",
		level: "critical",
		status: "pending",
		content: "用户登录接口响应时间达到5.8秒，超过阈值2秒",
		handler: "",
	},
];
