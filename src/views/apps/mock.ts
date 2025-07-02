export interface AppItem {
	id: string;
	appKey: string;
	name: string;
	owner: string;
	status: "active" | "inactive";
	group: string;
	tags: string[];
	description: string;
	createTime: string;
	updateTime: string;
}

export const mockApps: AppItem[] = [
	{
		id: "1",
		appKey: "app_web_001",
		name: "官网前端",
		owner: "张三",
		status: "active",
		group: "官网项目",
		tags: ["Web", "PC"],
		description: "官方网站前端应用",
		createTime: "2024-01-15 10:30:00",
		updateTime: "2024-01-20 14:20:00",
	},
	{
		id: "2",
		appKey: "app_mobile_002",
		name: "移动端H5",
		owner: "李四",
		status: "active",
		group: "移动项目",
		tags: ["H5", "Mobile"],
		description: "移动端H5应用",
		createTime: "2024-01-10 09:00:00",
		updateTime: "2024-01-18 16:45:00",
	},
];

export interface MonitorConfig {
	id: string;
	version: string;
	status: "active" | "inactive";
	updateTime: string;
	updateUser: string;
}

export const mockAppDetail: AppItem = {
	id: "1",
	appKey: "app_web_001",
	name: "官网前端",
	owner: "张三",
	status: "active",
	group: "官网项目",
	tags: ["Web", "PC"],
	description: "官方网站前端应用，包含首页、产品页、关于我们等模块",
	createTime: "2024-01-15 10:30:00",
	updateTime: "2024-01-20 14:20:00",
};

export const mockMonitorConfigs: MonitorConfig[] = [
	{
		id: "1",
		version: "v1.2.0",
		status: "active",
		updateTime: "2024-01-20 14:20:00",
		updateUser: "张三",
	},
	{
		id: "2",
		version: "v1.1.0",
		status: "inactive",
		updateTime: "2024-01-15 10:30:00",
		updateUser: "李四",
	},
];
