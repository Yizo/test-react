// 全局共享常量

// 通用状态值
export const COMMON_STATUS = {
	ACTIVE: "active",
	INACTIVE: "inactive",
};

// 通用颜色值
export const COMMON_COLORS = {
	SUCCESS: "green",
	WARNING: "orange",
	ERROR: "red",
	INFO: "blue",
	DEFAULT: "default",
};

// 应用列表（用于跨页面共享）
export const COMMON_APPS = [
	{ id: "1", appKey: "app_web_001", name: "官网前端" },
	{ id: "2", appKey: "app_mobile_002", name: "移动端H5" },
	{ id: "3", appKey: "app_admin_003", name: "管理后台" },
];

// 分页配置
export const DEFAULT_PAGINATION = {
	defaultPageSize: 10,
	pageSizeOptions: ["10", "20", "50", "100"],
	showSizeChanger: true,
	showQuickJumper: true,
	showTotal: (total: number) => `共 ${total} 条记录`,
};

// 日期格式
export const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

// 表单校验规则
export const FORM_RULES = {
	required: { required: true, message: "该字段为必填项" },
	email: { type: "email", message: "请输入有效的邮箱地址" },
	url: { type: "url", message: "请输入有效的URL" },
};
