import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useUserStore } from "@/stores";
import type { MenuItem } from "@/stores";

// 系统默认菜单配置
// 已弃用，仅保留作为参考
export const staticMenus: MenuItem[] = [
	{
		key: "dashboard",
		label: "首页",
		icon: "DashboardOutlined",
		path: "/dashboard",
	},
	{
		key: "user-management",
		label: "用户管理",
		icon: "UserOutlined",
		path: "/user-management",
	},
	{
		key: "menu-management",
		label: "菜单管理",
		icon: "MenuOutlined",
		path: "/menu-management",
	},
	{
		key: "role-management",
		label: "角色管理",
		icon: "TeamOutlined",
		path: "/role-management",
	},
];

// 用户菜单
export const userMenuItems: MenuProps["items"] = [
	{
		key: "profile",
		label: "个人信息",
		icon: <UserOutlined />,
	},
	{
		key: "settings",
		label: "设置",
		icon: <SettingOutlined />,
	},
	{
		type: "divider",
	},
	{
		key: "logout",
		label: "退出登录",
		icon: <LogoutOutlined />,
		onClick: () => {
			const navigate = useNavigate();
			const { logout } = useUserStore();
			logout();
			navigate("/login");
		},
	},
];

// 监控系统主菜单配置（嵌套路由风格）
export const monitorMenus = [
	{
		key: "dashboard",
		label: "监控大盘",
		icon: "DashboardOutlined",
		path: "dashboard",
		index: true,
	},
	{
		key: "apps",
		label: "应用管理",
		icon: "AppstoreOutlined",
		path: "apps",
		index: true,
		// 应用管理有列表页面，详情页面不在菜单中显示
	},
	{
		key: "configs",
		label: "监控配置",
		icon: "SettingOutlined",
		path: "configs",
		children: [
			{ key: "configs-list", label: "配置管理", path: "", index: true },
			{ key: "configs-history", label: "配置历史", path: "history" },
		],
	},
	{
		key: "alerts",
		label: "告警与通知",
		icon: "BellOutlined",
		path: "alerts",
		children: [
			{ key: "alerts-rules", label: "告警规则", path: "rules" },
			{ key: "alerts-channels", label: "告警渠道", path: "channels" },
			{ key: "alerts-history", label: "告警历史", path: "history" },
		],
	},
	{
		key: "permissions",
		label: "权限与成员",
		icon: "TeamOutlined",
		path: "permissions",
		children: [
			{ key: "members", label: "成员管理", path: "members" },
			{ key: "roles", label: "角色权限", path: "roles" },
			{ key: "logs", label: "操作日志", path: "logs" },
		],
	},
	{
		key: "analysis",
		label: "数据分析",
		icon: "BarChartOutlined",
		path: "analysis",
		children: [
			{ key: "dashboard-analysis", label: "监控大盘", path: "dashboard" },
			{ key: "multi-analysis", label: "多维分析", path: "", index: true },
		],
	},
	{
		key: "plugins",
		label: "插件与扩展",
		icon: "ApiOutlined",
		path: "plugins",
		children: [
			{ key: "plugin-market", label: "插件市场", path: "", index: true },
			{ key: "plugin-config", label: "插件配置", path: "config" },
		],
	},
	{
		key: "settings",
		label: "系统设置",
		icon: "GlobalOutlined",
		path: "settings",
		children: [
			{ key: "settings-platform", label: "平台信息", path: "platform" },
			{ key: "settings-i18n", label: "国际化设置", path: "i18n" },
			{ key: "settings-auth", label: "登录与认证", path: "auth" },
			{ key: "settings-storage", label: "日志与存储", path: "storage" },
		],
	},
];

// 用于侧边栏显示的菜单配置（嵌套路由风格，不显示详情页面）
export const sidebarMenus = [
	{
		key: "dashboard",
		label: "监控大盘",
		icon: "DashboardOutlined",
		path: "dashboard",
		index: true,
	},
	{
		key: "apps",
		label: "应用管理",
		icon: "AppstoreOutlined",
		path: "apps",
		index: true,
	},
	{
		key: "configs",
		label: "监控配置",
		icon: "SettingOutlined",
		path: "configs",
		children: [
			{ key: "configs-list", label: "配置管理", path: "", index: true },
			{ key: "configs-history", label: "配置历史", path: "history" },
		],
	},
	{
		key: "alerts",
		label: "告警管理",
		icon: "BellOutlined",
		path: "alerts",
		children: [
			{ key: "alerts-rules", label: "告警规则", path: "rules" },
			{ key: "alerts-channels", label: "告警渠道", path: "channels" },
			{ key: "alerts-history", label: "告警历史", path: "history" },
		],
	},
	{
		key: "members",
		label: "成员管理",
		icon: "TeamOutlined",
		path: "members",
		index: true,
	},
	{
		key: "roles",
		label: "角色权限",
		icon: "UserOutlined",
		path: "roles",
		index: true,
	},
	{
		key: "logs",
		label: "操作日志",
		icon: "FileTextOutlined",
		path: "logs",
		index: true,
	},
	{
		key: "analysis",
		label: "多维分析",
		icon: "BarChartOutlined",
		path: "analysis",
		index: true,
	},
	{
		key: "plugins",
		label: "插件市场",
		icon: "ApiOutlined",
		path: "plugins",
		index: true,
	},
	{
		key: "settings",
		label: "系统设置",
		icon: "GlobalOutlined",
		path: "settings",
		children: [
			{ key: "settings-platform", label: "平台信息", path: "platform" },
			{ key: "settings-i18n", label: "国际化", path: "i18n" },
			{ key: "settings-auth", label: "登录认证", path: "auth" },
			{ key: "settings-storage", label: "日志与存储", path: "storage" },
		],
	},
];
