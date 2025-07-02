import React, { useState, useEffect } from "react";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Space,
	Popconfirm,
	message,
	Tag,
	TreeSelect,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Menu {
	id: string;
	name: string;
	path: string;
	icon: string;
	parentId: string | null;
	sort: number;
	status: "active" | "inactive";
	type: "menu" | "button";
	permission: string;
}

const MenuManagement: React.FC = () => {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
	const [form] = Form.useForm();

	// 模拟数据
	const mockMenus: Menu[] = [
		{
			id: "1",
			name: "首页",
			path: "/dashboard",
			icon: "DashboardOutlined",
			parentId: null,
			sort: 1,
			status: "active",
			type: "menu",
			permission: "dashboard:view",
		},
		{
			id: "2",
			name: "用户管理",
			path: "/user-management",
			icon: "UserOutlined",
			parentId: null,
			sort: 2,
			status: "active",
			type: "menu",
			permission: "user:view",
		},
		{
			id: "3",
			name: "菜单管理",
			path: "/menu-management",
			icon: "MenuOutlined",
			parentId: null,
			sort: 3,
			status: "active",
			type: "menu",
			permission: "menu:view",
		},
		{
			id: "4",
			name: "角色管理",
			path: "/role-management",
			icon: "TeamOutlined",
			parentId: null,
			sort: 4,
			status: "active",
			type: "menu",
			permission: "role:view",
		},
	];

	useEffect(() => {
		fetchMenus();
	}, []);

	const fetchMenus = async () => {
		setLoading(true);
		try {
			setTimeout(() => {
				setMenus(mockMenus);
				setLoading(false);
			}, 500);
		} catch (error) {
			console.error("获取菜单列表失败:", error);
			setMenus(mockMenus);
			setLoading(false);
		}
	};

	const columns: ColumnsType<Menu> = [
		{
			title: "ID",
			dataIndex: "id",
			width: 80,
		},
		{
			title: "菜单名称",
			dataIndex: "name",
		},
		{
			title: "路径",
			dataIndex: "path",
		},
		{
			title: "图标",
			dataIndex: "icon",
		},
		{
			title: "排序",
			dataIndex: "sort",
			width: 80,
		},
		{
			title: "类型",
			dataIndex: "type",
			render: (type: string) => (
				<Tag color={type === "menu" ? "blue" : "green"}>
					{type === "menu" ? "菜单" : "按钮"}
				</Tag>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			render: (status: string) => (
				<Tag color={status === "active" ? "green" : "red"}>
					{status === "active" ? "启用" : "禁用"}
				</Tag>
			),
		},
		{
			title: "权限标识",
			dataIndex: "permission",
		},
		{
			title: "操作",
			width: 200,
			render: (_, record) => (
				<Space size="middle">
					<Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						编辑
					</Button>
					<Popconfirm
						title="确定要删除这个菜单吗？"
						onConfirm={() => handleDelete(record.id)}
						okText="确定"
						cancelText="取消"
					>
						<Button type="link" danger icon={<DeleteOutlined />}>
							删除
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleAdd = () => {
		setEditingMenu(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (menu: Menu) => {
		setEditingMenu(menu);
		form.setFieldsValue(menu);
		setModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			setMenus(menus.filter((menu) => menu.id !== id));
			message.success("删除成功");
		} catch (error) {
			console.error("删除失败:", error);
			message.error("删除失败");
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingMenu) {
				const updatedMenu = { ...editingMenu, ...values };
				setMenus(menus.map((menu) => (menu.id === editingMenu.id ? updatedMenu : menu)));
				message.success("更新成功");
			} else {
				const newMenu: Menu = {
					id: Date.now().toString(),
					...values,
				};
				setMenus([...menus, newMenu]);
				message.success("添加成功");
			}

			setModalVisible(false);
		} catch (error) {
			console.error("提交失败:", error);
		}
	};

	// 构建树形数据
	const buildTreeData = (menuList: Menu[]) => {
		return menuList
			.filter((menu) => !menu.parentId)
			.map((menu) => ({
				title: menu.name,
				value: menu.id,
				children: menuList
					.filter((child) => child.parentId === menu.id)
					.map((child) => ({
						title: child.name,
						value: child.id,
					})),
			}));
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
				<h2>菜单管理</h2>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
					新增菜单
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={menus}
				rowKey="id"
				loading={loading}
				pagination={{
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
				}}
			/>

			<Modal
				title={editingMenu ? "编辑菜单" : "新增菜单"}
				open={modalVisible}
				onOk={handleSubmit}
				onCancel={() => setModalVisible(false)}
				destroyOnClose
				width={600}
			>
				<Form form={form} layout="vertical" preserve={false}>
					<Form.Item
						name="name"
						label="菜单名称"
						rules={[{ required: true, message: "请输入菜单名称" }]}
					>
						<Input placeholder="请输入菜单名称" />
					</Form.Item>

					<Form.Item
						name="path"
						label="路径"
						rules={[{ required: true, message: "请输入路径" }]}
					>
						<Input placeholder="请输入路径" />
					</Form.Item>

					<Form.Item name="icon" label="图标">
						<Select placeholder="请选择图标">
							<Select.Option value="DashboardOutlined">
								DashboardOutlined
							</Select.Option>
							<Select.Option value="UserOutlined">UserOutlined</Select.Option>
							<Select.Option value="MenuOutlined">MenuOutlined</Select.Option>
							<Select.Option value="TeamOutlined">TeamOutlined</Select.Option>
							<Select.Option value="SettingOutlined">SettingOutlined</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item name="parentId" label="父级菜单">
						<TreeSelect
							placeholder="请选择父级菜单"
							allowClear
							treeData={buildTreeData(menus)}
						/>
					</Form.Item>

					<Form.Item
						name="sort"
						label="排序"
						rules={[{ required: true, message: "请输入排序" }]}
					>
						<Input type="number" placeholder="请输入排序" />
					</Form.Item>

					<Form.Item
						name="type"
						label="类型"
						rules={[{ required: true, message: "请选择类型" }]}
					>
						<Select placeholder="请选择类型">
							<Select.Option value="menu">菜单</Select.Option>
							<Select.Option value="button">按钮</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="status"
						label="状态"
						rules={[{ required: true, message: "请选择状态" }]}
					>
						<Select placeholder="请选择状态">
							<Select.Option value="active">启用</Select.Option>
							<Select.Option value="inactive">禁用</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="permission"
						label="权限标识"
						rules={[{ required: true, message: "请输入权限标识" }]}
					>
						<Input placeholder="请输入权限标识" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default MenuManagement;
