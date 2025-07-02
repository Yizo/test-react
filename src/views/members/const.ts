// 成员管理相关常量

// 角色映射
export const MEMBER_ROLE_MAP = {
	admin: { text: "管理员", color: "red" },
	developer: { text: "开发者", color: "blue" },
	viewer: { text: "查看者", color: "green" },
} as const;

// 角色下拉选项
export const MEMBER_ROLE_OPTIONS = [
	{ value: "admin", label: "管理员" },
	{ value: "developer", label: "开发者" },
	{ value: "viewer", label: "查看者" },
];

// 成员状态映射
export const MEMBER_STATUS_MAP = {
	active: { text: "正常", color: "green" },
	inactive: { text: "禁用", color: "red" },
} as const;

// 成员状态下拉选项
export const MEMBER_STATUS_OPTIONS = [
	{ value: "active", label: "正常" },
	{ value: "inactive", label: "禁用" },
];
