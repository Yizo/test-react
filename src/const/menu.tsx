import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useUserStore } from "@/stores";
import type { MenuItem } from "@/stores";

// 静态菜单配置
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
