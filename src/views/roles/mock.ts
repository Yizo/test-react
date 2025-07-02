// roles模块模拟数据和类型
export interface Role {
	id: string;
	name: string;
	description: string;
	memberCount: number;
	permissions: string[];
	status: "active" | "inactive";
	createTime: string;
	isSystem: boolean;
}

export const mockRoles: Role[] = [
	{
		id: "1",
		name: "超级管理员",
		description: "拥有所有权限",
		memberCount: 2,
		permissions: ["*"],
		status: "active",
		createTime: "2024-01-01 09:00:00",
		isSystem: true,
	},
	{
		id: "2",
		name: "开发者",
		description: "可管理应用和配置",
		memberCount: 5,
		permissions: ["app:view", "app:create", "config:view", "config:edit"],
		status: "active",
		createTime: "2024-01-10 10:30:00",
		isSystem: false,
	},
	{
		id: "3",
		name: "只读用户",
		description: "仅可查看数据",
		memberCount: 10,
		permissions: ["app:view", "config:view", "alert:view"],
		status: "inactive",
		createTime: "2024-01-15 14:20:00",
		isSystem: false,
	},
];
