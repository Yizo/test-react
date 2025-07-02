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
	AppstoreOutlined,
	SettingOutlined,
	BellOutlined,
	BarChartOutlined,
	ApiOutlined,
	FileTextOutlined,
	GlobalOutlined,
	SafetyOutlined,
	DatabaseOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore, useAppStore, type MenuItem } from "@/stores";
import { sidebarMenus, userMenuItems } from "@/const"; // 使用 sidebarMenus
import { useApi } from "@/api";

const { Header, Sider, Content } = Layout;

// 图标映射
const iconMap: { [key: string]: React.ReactNode } = {
	DashboardOutlined: <DashboardOutlined />,
	AppstoreOutlined: <AppstoreOutlined />,
	SettingOutlined: <SettingOutlined />,
	BellOutlined: <BellOutlined />,
	TeamOutlined: <TeamOutlined />,
	UserOutlined: <UserOutlined />,
	FileTextOutlined: <FileTextOutlined />,
	BarChartOutlined: <BarChartOutlined />,
	ApiOutlined: <ApiOutlined />,
	GlobalOutlined: <GlobalOutlined />,
	SafetyOutlined: <SafetyOutlined />,
	DatabaseOutlined: <DatabaseOutlined />,
	MenuOutlined: <MenuOutlined />,
};

const AppLayout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { userInfo, login } = useUserStore();
	const { collapsed, breadcrumbs, menus, isDynamicMenu, setCollapsed, setBreadcrumbs, setMenus } =
		useAppStore();

	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

	const { request } = useApi();

	// 初始化模拟用户登录状态
	useEffect(() => {
		if (!userInfo) {
			// 模拟登录状态
			login(
				{
					id: "1",
					username: "admin",
					name: "管理员",
					avatar: "",
					roles: ["admin"],
					permissions: ["*"],
				},
				"mock-token-123456"
			);
		}
	}, [userInfo, login]);

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
			setMenus(sidebarMenus);
		}
	};

	useEffect(() => {
		if (isDynamicMenu) {
			fetchMenus();
		} else {
			setMenus(sidebarMenus);
		}
	}, [isDynamicMenu]);

	// 转换菜单格式
	const convertMenus = (
		menuItems: MenuItem[],
		isTopLevel: boolean = true
	): MenuProps["items"] => {
		return menuItems.map((item) => ({
			key: item.key,
			// 只有一级菜单才显示图标
			icon: isTopLevel ? iconMap[item.icon || ""] || <MenuOutlined /> : undefined,
			label: item.label,
			children: item.children ? convertMenus(item.children, false) : undefined,
		}));
	};

	// 构建面包屑路径
	const buildBreadcrumbs = (
		menuItems: MenuItem[],
		targetKey: string,
		path: MenuItem[] = []
	): MenuItem[] | null => {
		for (const item of menuItems) {
			const currentPath = [...path, item];

			if (item.key === targetKey) {
				// 过滤掉没有 path 的菜单项（除非它是最后一个）
				const filteredPath = currentPath.filter((menuItem, index) => {
					// 如果是最后一个菜单项，总是保留
					if (index === currentPath.length - 1) {
						return true;
					}
					// 如果有 path，保留
					if (menuItem.path) {
						return true;
					}
					// 如果没有 path 但有子菜单，且不是最后一个，也保留
					return menuItem.children && menuItem.children.length > 0;
				});

				return filteredPath;
			}

			if (item.children) {
				const found = buildBreadcrumbs(item.children, targetKey, currentPath);
				if (found) return found;
			}
		}
		return null;
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

		// 构建完整路径的递归函数
		const buildFullPath = (
			menuItems: MenuItem[],
			targetKey: string,
			parentPath: string = ""
		): string | null => {
			for (const item of menuItems) {
				// 构建当前路径
				let currentPath = parentPath;
				if (item.path) {
					if (item.path === "" && item.index) {
						// index路由，使用父路径
						currentPath = parentPath || `/${item.key}`;
					} else if (item.path.startsWith("/")) {
						// 绝对路径
						currentPath = item.path;
					} else {
						// 相对路径
						currentPath = parentPath ? `${parentPath}/${item.path}` : `/${item.path}`;
					}
				} else {
					// 没有path的菜单项，使用key作为路径
					currentPath = parentPath ? `${parentPath}/${item.key}` : `/${item.key}`;
				}

				if (item.key === targetKey) {
					return currentPath;
				}

				if (item.children) {
					const found = buildFullPath(item.children, targetKey, currentPath);
					if (found) return found;
				}
			}
			return null;
		};

		const menuItem = findMenuByKey(menus, key);
		if (menuItem) {
			const fullPath = buildFullPath(menus, key);
			if (fullPath) {
				navigate(fullPath);
				setSelectedKeys([key]);

				// 构建面包屑 - 根据菜单层级关系
				const breadcrumbPath = buildBreadcrumbs(menus, key);
				if (breadcrumbPath) {
					const breadcrumbItems = breadcrumbPath.map((item) => ({
						title: item.label,
						path: buildFullPath(menus, item.key) || undefined,
					}));
					setBreadcrumbs(breadcrumbItems);
				}
			}
		}
	};

	// 根据当前路径设置选中的菜单项和面包屑
	useEffect(() => {
		if (!menus || menus.length === 0) {
			console.log("菜单还未加载完成");
			return;
		}

		const findKeyByPath = (
			menuItems: MenuItem[],
			currentPath: string,
			parentPath: string = ""
		): string | null => {
			for (const item of menuItems) {
				// 构建当前路径
				let itemPath = parentPath;
				if (item.path) {
					if (item.path === "" && item.index) {
						// index路由，使用父路径
						itemPath = parentPath || `/${item.key}`;
					} else if (item.path.startsWith("/")) {
						// 绝对路径
						itemPath = item.path;
					} else {
						// 相对路径
						itemPath = parentPath ? `${parentPath}/${item.path}` : `/${item.path}`;
					}
				} else {
					// 没有path的菜单项，使用key作为路径
					itemPath = parentPath ? `${parentPath}/${item.key}` : `/${item.key}`;
				}

				if (itemPath === currentPath) {
					return item.key;
				}

				if (item.children) {
					const found = findKeyByPath(item.children, currentPath, itemPath);
					if (found) return found;
				}
			}
			return null;
		};

		// 处理特殊路由的面包屑映射
		const getCustomBreadcrumbs = (pathname: string) => {
			// 应用详情页
			if (pathname.startsWith("/apps/") && pathname !== "/apps") {
				return [{ title: "应用管理", path: "/apps" }, { title: "应用详情" }];
			}
			// 监控配置编辑页
			if (
				pathname.startsWith("/configs/") &&
				pathname !== "/configs" &&
				pathname !== "/configs/history"
			) {
				return [
					{ title: "监控配置" },
					{ title: "配置管理", path: "/configs" },
					{ title: "配置编辑" },
				];
			}
			// 插件配置页
			if (pathname.startsWith("/plugins/config")) {
				return [{ title: "插件市场", path: "/plugins" }, { title: "插件配置" }];
			}
			return null;
		};

		const key = findKeyByPath(menus, location.pathname);
		console.log("当前路径:", location.pathname, "找到的菜单key:", key);
		console.log("当前菜单结构:", menus);

		if (key) {
			// 找到父级菜单，确保父级菜单也被选中
			const findParentKey = (menuItems: MenuItem[], targetKey: string): string | null => {
				for (const item of menuItems) {
					if (item.children) {
						for (const child of item.children) {
							if (child.key === targetKey) {
								return item.key;
							}
						}
					}
				}
				return null;
			};

			const parentKey = findParentKey(menus, key);
			const selectedKeys = parentKey ? [parentKey, key] : [key];
			setSelectedKeys(selectedKeys);

			// 构建面包屑 - 根据菜单层级关系
			const breadcrumbPath = buildBreadcrumbs(menus, key);
			console.log("构建的面包屑路径:", breadcrumbPath);

			if (breadcrumbPath && breadcrumbPath.length > 0) {
				const breadcrumbItems = breadcrumbPath.map((item) => ({
					title: item.label,
					path: item.path,
				}));
				console.log("设置面包屑:", breadcrumbItems);
				setBreadcrumbs(breadcrumbItems);
			}
		} else {
			// 处理不在菜单中的页面
			const customBreadcrumbs = getCustomBreadcrumbs(location.pathname);
			if (customBreadcrumbs) {
				setBreadcrumbs(customBreadcrumbs);
				// 设置父级菜单为选中状态
				if (location.pathname.startsWith("/apps/")) {
					setSelectedKeys(["apps"]);
				} else if (location.pathname.startsWith("/configs/")) {
					setSelectedKeys(["configs-list"]);
				} else if (location.pathname.startsWith("/plugins/")) {
					setSelectedKeys(["plugins"]);
				}
			} else if (location.pathname === "/dashboard") {
				setBreadcrumbs([{ title: "监控大盘" }]);
				setSelectedKeys(["dashboard"]);
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
					items={convertMenus(menus, true)}
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
						items={breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;
							return {
								title:
									item.path && !isLast ? (
										<a
											onClick={() => navigate(item.path!)}
											style={{ color: "#1890ff", cursor: "pointer" }}
										>
											{item.title}
										</a>
									) : (
										<span style={{ color: isLast ? "#666" : "#000" }}>
											{item.title}
										</span>
									),
							};
						})}
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
