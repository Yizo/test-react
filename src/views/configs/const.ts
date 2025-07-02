// 监控配置相关常量

// 配置状态映射
export const CONFIG_STATUS_MAP = {
	active: { text: "当前启用", color: "green" },
	inactive: { text: "历史版本", color: "default" },
} as const;

// 配置状态下拉选项
export const CONFIG_STATUS_OPTIONS = [
	{ value: "active", label: "当前启用" },
	{ value: "inactive", label: "历史版本" },
];

// 应用下拉选项（通常从接口获取，这里提供示例）
export const APP_OPTIONS = [
	{ value: "app_web_001", label: "官网前端" },
	{ value: "app_mobile_002", label: "移动端H5" },
	{ value: "app_admin_003", label: "管理后台" },
];

// 配置变更类型下拉选项
export const CHANGE_TYPE_OPTIONS = [
	{ label: "创建", value: "create" },
	{ label: "更新", value: "update" },
	{ label: "回滚", value: "rollback" },
	{ label: "发布", value: "publish" },
];

// 配置变更状态下拉选项
export const STATUS_OPTIONS = [
	{ label: "成功", value: "success" },
	{ label: "失败", value: "failed" },
];
