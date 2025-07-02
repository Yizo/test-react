// 角色管理相关常量

// 角色状态映射
export const ROLE_STATUS_MAP = {
	active: { text: "启用", color: "green" },
	inactive: { text: "禁用", color: "red" },
} as const;

// 角色状态下拉选项
export const ROLE_STATUS_OPTIONS = [
	{ value: "active", label: "启用" },
	{ value: "inactive", label: "禁用" },
];

// 权限操作类型
export const PERMISSION_TYPES = {
	view: "查看",
	create: "创建",
	edit: "编辑",
	delete: "删除",
	publish: "发布",
	rollback: "回滚",
	handle: "处理",
} as const;
