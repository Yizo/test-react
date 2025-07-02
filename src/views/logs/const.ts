// 操作日志相关常量

// 操作类型映射
export const OPERATION_TYPE_MAP = {
	创建应用: { text: "创建应用", color: "green" },
	编辑应用: { text: "编辑应用", color: "blue" },
	删除应用: { text: "删除应用", color: "red" },
	编辑配置: { text: "编辑配置", color: "orange" },
	发布配置: { text: "发布配置", color: "purple" },
	删除告警规则: { text: "删除告警规则", color: "red" },
	创建成员: { text: "创建成员", color: "green" },
	编辑权限: { text: "编辑权限", color: "blue" },
} as const;

// 操作类型下拉选项
export const OPERATION_TYPE_OPTIONS = [
	{ value: "创建应用", label: "创建应用" },
	{ value: "编辑应用", label: "编辑应用" },
	{ value: "删除应用", label: "删除应用" },
	{ value: "编辑配置", label: "编辑配置" },
	{ value: "发布配置", label: "发布配置" },
	{ value: "删除告警规则", label: "删除告警规则" },
	{ value: "创建成员", label: "创建成员" },
	{ value: "编辑权限", label: "编辑权限" },
];

// 操作结果映射
export const OPERATION_RESULT_MAP = {
	success: { text: "成功", color: "green" },
	failed: { text: "失败", color: "red" },
} as const;

// 操作结果下拉选项
export const OPERATION_RESULT_OPTIONS = [
	{ value: "success", label: "成功" },
	{ value: "failed", label: "失败" },
];
