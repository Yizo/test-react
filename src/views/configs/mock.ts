// configs模块模拟数据和类型
export interface ConfigItem {
	id: string;
	appName: string;
	appKey: string;
	version: string;
	status: "active" | "inactive";
	updateTime: string;
	updateUser: string;
	description: string;
}

export const mockConfigs: ConfigItem[] = [
	{
		id: "1",
		appName: "官网前端",
		appKey: "app_web_001",
		version: "v1.2.0",
		status: "active",
		updateTime: "2024-01-20 14:20:00",
		updateUser: "张三",
		description: "增加错误监控和性能采集",
	},
	{
		id: "2",
		appName: "移动端H5",
		appKey: "app_mobile_002",
		version: "v1.1.0",
		status: "active",
		updateTime: "2024-01-18 16:45:00",
		updateUser: "李四",
		description: "优化移动端性能监控配置",
	},
	{
		id: "3",
		appName: "官网前端",
		appKey: "app_web_001",
		version: "v1.1.0",
		status: "inactive",
		updateTime: "2024-01-15 10:30:00",
		updateUser: "张三",
		description: "初始监控配置",
	},
];

// 监控配置编辑页类型和mock数据
export interface MonitorConfig {
	appKey: string;
	appName: string;
	version: string;
	errorMonitor: boolean;
	performanceMonitor: boolean;
	behaviorMonitor: boolean;
	networkMonitor: boolean;
	samplingRate: number;
	collectFrequency: number;
	customEvents: CustomEvent[];
}

export interface CustomEvent {
	id: string;
	eventName: string;
	description: string;
	parameters: EventParameter[];
}

export interface EventParameter {
	name: string;
	type: string;
	required: boolean;
	description: string;
}

export const mockConfig: MonitorConfig = {
	appKey: "app_web_001",
	appName: "官网前端",
	version: "v1.2.0",
	errorMonitor: true,
	performanceMonitor: true,
	behaviorMonitor: false,
	networkMonitor: true,
	samplingRate: 15,
	collectFrequency: 60,
	customEvents: [
		{
			id: "evt1",
			eventName: "自定义埋点",
			description: "用户点击按钮",
			parameters: [
				{ name: "buttonId", type: "string", required: true, description: "按钮ID" },
				{ name: "page", type: "string", required: false, description: "页面名称" },
			],
		},
	],
};

export const defaultConfig: MonitorConfig = {
	appKey: "",
	appName: "",
	version: "",
	errorMonitor: true,
	performanceMonitor: true,
	behaviorMonitor: false,
	networkMonitor: true,
	samplingRate: 10,
	collectFrequency: 60,
	customEvents: [],
};

// 配置历史记录类型和mock数据
export interface ConfigHistoryRecord {
	id: string;
	appName: string;
	appKey: string;
	version: string;
	changeType: "create" | "update" | "rollback" | "publish";
	operator: string;
	operatorName: string;
	changeTime: string;
	changeContent: string;
	status: "success" | "failed";
	description?: string;
}

export const mockConfigHistory: ConfigHistoryRecord[] = [
	{
		id: "1",
		appName: "电商主站",
		appKey: "ecommerce-main",
		version: "v1.2.3",
		changeType: "update",
		operator: "user001",
		operatorName: "张三",
		changeTime: "2024-01-15 14:30:00",
		changeContent: "修改错误监控采样率从10%调整为15%",
		status: "success",
		description: "根据业务需求调整监控策略",
	},
	{
		id: "2",
		appName: "用户中心",
		appKey: "user-center",
		version: "v2.1.0",
		changeType: "create",
		operator: "user002",
		operatorName: "李四",
		changeTime: "2024-01-14 10:15:00",
		changeContent: "创建新的监控配置",
		status: "success",
		description: "为新应用初始化监控配置",
	},
];
