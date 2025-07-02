// dashboard模块模拟数据和类型

// 仪表盘数据类型
export interface DashboardData {
	totalApps: number;
	activeAlerts: number;
	todayEvents: number;
	systemHealth: number;
	recentAlerts: AlertItem[];
	appStatus: AppStatusItem[];
}

// 告警项类型
export interface AlertItem {
	key: string;
	app: string;
	type: string;
	level: "high" | "medium" | "low";
	time: string;
	status: "active" | "resolved";
}

// 应用状态项类型
export interface AppStatusItem {
	key: string;
	name: string;
	status: "running" | "warning" | "error";
	health: number;
	alerts: number;
	lastCheck: string;
}

// 统计卡片、系统状态、最近活动 mock 数据
export interface DashboardStats {
	userCount: number;
	roleCount: number;
	menuCount: number;
	permissionCount: number;
}

export interface SystemStatus {
	cpu: number; // 百分比
	memory: number; // 百分比
	disk: number; // 百分比
}

export interface ActivityRecord {
	content: string;
}

// 模拟仪表盘数据
export const mockDashboardData: DashboardData = {
	totalApps: 32,
	activeAlerts: 5,
	todayEvents: 1284,
	systemHealth: 98.5,
	recentAlerts: [
		{
			key: "1",
			app: "Web应用",
			type: "错误率过高",
			level: "high",
			time: "2024-01-15 10:30:00",
			status: "active",
		},
		{
			key: "2",
			app: "API服务",
			type: "响应时间超时",
			level: "medium",
			time: "2024-01-15 09:45:00",
			status: "resolved",
		},
		{
			key: "3",
			app: "数据库",
			type: "CPU使用率过高",
			level: "low",
			time: "2024-01-15 08:20:00",
			status: "active",
		},
		{
			key: "4",
			app: "消息队列",
			type: "连接异常",
			level: "medium",
			time: "2024-01-15 07:55:00",
			status: "active",
		},
		{
			key: "5",
			app: "存储服务",
			type: "磁盘空间不足",
			level: "high",
			time: "2024-01-15 07:30:00",
			status: "resolved",
		},
	],
	appStatus: [
		{
			key: "1",
			name: "Web应用",
			status: "running",
			health: 95,
			alerts: 2,
			lastCheck: "2024-01-15 10:35:00",
		},
		{
			key: "2",
			name: "API服务",
			status: "running",
			health: 98,
			alerts: 0,
			lastCheck: "2024-01-15 10:34:00",
		},
		{
			key: "3",
			name: "数据库",
			status: "warning",
			health: 88,
			alerts: 1,
			lastCheck: "2024-01-15 10:33:00",
		},
		{
			key: "4",
			name: "消息队列",
			status: "running",
			health: 100,
			alerts: 0,
			lastCheck: "2024-01-15 10:32:00",
		},
		{
			key: "5",
			name: "存储服务",
			status: "error",
			health: 65,
			alerts: 2,
			lastCheck: "2024-01-15 10:31:00",
		},
	],
};

export const mockDashboardStats: DashboardStats = {
	userCount: 112,
	roleCount: 8,
	menuCount: 26,
	permissionCount: 45,
};

export const mockSystemStatus: SystemStatus = {
	cpu: 30,
	memory: 70,
	disk: 45,
};

export const mockActivities: ActivityRecord[] = [
	{ content: "用户 admin 登录系统" },
	{ content: '新增用户 "张三"' },
	{ content: '修改角色 "管理员" 权限' },
	{ content: '删除菜单 "测试菜单"' },
	{ content: "系统启动" },
];
