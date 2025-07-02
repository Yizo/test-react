import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb, Button, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	DashboardOutlined,
	UserOutlined,
	MenuOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore, useAppStore, type MenuItem } from "@/stores";
import { staticMenus, userMenuItems } from "@/const"; // 引入静态菜单配置
import { useApi } from "@/api";

const { Header, Sider, Content } = Layout;

// 图标映射
const iconMap: { [key: string]: React.ReactNode } = {
	DashboardOutlined: <DashboardOutlined />,
	UserOutlined: <UserOutlined />,
	MenuOutlined: <MenuOutlined />,
	TeamOutlined: <TeamOutlined />,
};

const AppLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { userInfo } = useUserStore();
	const { collapsed, breadcrumbs, menus, isDynamicMenu, setCollapsed, setBreadcrumbs, setMenus } =
		useAppStore();

	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

	const { request } = useApi();

	// 获取动态菜单
	const fetchMenus = async () => {
		try {
			const response = await request("/api/menus");
			if (response.status === 200) {
				setMenus(response.data);
			}
		} catch (error) {
			console.error("获取菜单失败:", error);
			// 如果获取动态菜单失败，使用静态菜单
			setMenus(staticMenus);
		}
	};

	useEffect(() => {
		if (isDynamicMenu) {
			fetchMenus();
		} else {
			setMenus(staticMenus);
		}
	}, [isDynamicMenu]);

	// 转换菜单格式
	const convertMenus = (menuItems: MenuItem[]): MenuProps["items"] => {
		return menuItems.map((item) => ({
			key: item.key,
			icon: iconMap[item.icon || ""] || <MenuOutlined />,
			label: item.label,
			children: item.children ? convertMenus(item.children) : undefined,
		}));
	};

	// 处理菜单点击
	const handleMenuClick = ({ key }: { key: string }) => {
		const findMenuByKey = (menuItems: MenuItem[], targetKey: string): MenuItem | null => {
			for (const item of menuItems) {
				if (item.key === targetKey) {
					return item;
				}
				if (item.children) {
					const found = findMenuByKey(item.children, targetKey);
					if (found) return found;
				}
			}
			return null;
		};

		const menuItem = findMenuByKey(menus, key);
		if (menuItem?.path) {
			navigate(menuItem.path);
			setSelectedKeys([key]);

			// 更新面包屑
			setBreadcrumbs([{ title: "首页", path: "/dashboard" }, { title: menuItem.label }]);
		}
	};

	// 根据当前路径设置选中的菜单项
	useEffect(() => {
		const findKeyByPath = (menuItems: MenuItem[], currentPath: string): string | null => {
			for (const item of menuItems) {
				if (item.path === currentPath) {
					return item.key;
				}
				if (item.children) {
					const found = findKeyByPath(item.children, currentPath);
					if (found) return found;
				}
			}
			return null;
		};

		const key = findKeyByPath(menus, location.pathname);
		if (key) {
			setSelectedKeys([key]);
			const menuItem = menus.find((item) => item.key === key);
			if (menuItem) {
				setBreadcrumbs([{ title: "首页", path: "/dashboard" }, { title: menuItem.label }]);
			}
		}
	}, [location.pathname, menus]);

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div
					className="logo"
					style={{
						height: 32,
						margin: 16,
						background: "rgba(255, 255, 255, 0.3)",
						borderRadius: 6,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
					}}
				>
					{collapsed ? "A" : "管理系统"}
				</div>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={selectedKeys}
					items={convertMenus(menus)}
					onClick={handleMenuClick}
				/>
			</Sider>
			<Layout>
				<Header
					style={{
						padding: "0 16px",
						background: "#fff",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						boxShadow: "0 1px 4px rgba(0,21,41,.08)",
					}}
				>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>

					<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
						<span>欢迎，{userInfo?.name || userInfo?.username}</span>
						<Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
							<Avatar
								src={userInfo?.avatar}
								icon={<UserOutlined />}
								style={{ cursor: "pointer" }}
							/>
						</Dropdown>
					</div>
				</Header>

				<div
					style={{
						padding: "12px 16px 0",
						background: "#fff",
						borderBottom: "1px solid #f0f0f0",
					}}
				>
					<Breadcrumb
						items={breadcrumbs.map((item) => ({
							title: item.path ? (
								<a onClick={() => navigate(item.path!)}>{item.title}</a>
							) : (
								item.title
							),
						}))}
					/>
				</div>

				<Content
					style={{
						margin: "16px",
						padding: 24,
						minHeight: 280,
						background: "#fff",
						borderRadius: 6,
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

export default AppLayout;
