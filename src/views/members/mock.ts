// members模块模拟数据和类型
export interface Member {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "inactive";
	apps: string[];
	groups: string[];
	joinTime: string;
	lastLogin: string;
	avatar?: string;
}

export const mockMembers: Member[] = [
	{
		id: "1",
		name: "张三",
		email: "zhangsan@example.com",
		role: "admin",
		status: "active",
		apps: ["app_web_001", "app_mobile_002"],
		groups: ["官网项目", "移动项目"],
		joinTime: "2024-01-15 10:30:00",
		lastLogin: "2024-01-20 14:20:00",
	},
	{
		id: "2",
		name: "李四",
		email: "lisi@example.com",
		role: "developer",
		status: "active",
		apps: ["app_mobile_002"],
		groups: ["移动项目"],
		joinTime: "2024-01-10 09:00:00",
		lastLogin: "2024-01-19 16:45:00",
	},
	{
		id: "3",
		name: "王五",
		email: "wangwu@example.com",
		role: "viewer",
		status: "inactive",
		apps: ["app_web_001"],
		groups: ["官网项目"],
		joinTime: "2024-01-08 14:20:00",
		lastLogin: "2024-01-12 10:15:00",
	},
];
