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
	Tree,
	Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DataNode } from "antd/es/tree";
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";

interface Role {
	id: string;
	name: string;
	description: string;
	status: "active" | "inactive";
	permissions: string[];
	createdAt: string;
}

const RoleManagement: React.FC = () => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [permissionModalVisible, setPermissionModalVisible] = useState(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
	const [form] = Form.useForm();

	// 模拟数据
	const mockRoles: Role[] = [
		{
			id: "1",
			name: "超级管理员",
			description: "拥有系统所有权限",
			status: "active",
			permissions: [
				"dashboard:view",
				"user:view",
				"user:add",
				"user:edit",
				"user:delete",
				"menu:view",
				"menu:add",
				"menu:edit",
				"menu:delete",
				"role:view",
				"role:add",
				"role:edit",
				"role:delete",
			],
			createdAt: "2024-01-01",
		},
		{
			id: "2",
			name: "管理员",
			description: "拥有大部分权限",
			status: "active",
			permissions: [
				"dashboard:view",
				"user:view",
				"user:add",
				"user:edit",
				"menu:view",
				"role:view",
			],
			createdAt: "2024-01-02",
		},
		{
			id: "3",
			name: "普通用户",
			description: "基础权限",
			status: "active",
			permissions: ["dashboard:view"],
			createdAt: "2024-01-03",
		},
	];

	// 权限树数据
	const permissionTree: DataNode[] = [
		{
			title: "仪表盘",
			key: "dashboard",
			children: [{ title: "查看", key: "dashboard:view" }],
		},
		{
			title: "用户管理",
			key: "user",
			children: [
				{ title: "查看", key: "user:view" },
				{ title: "新增", key: "user:add" },
				{ title: "编辑", key: "user:edit" },
				{ title: "删除", key: "user:delete" },
			],
		},
		{
			title: "菜单管理",
			key: "menu",
			children: [
				{ title: "查看", key: "menu:view" },
				{ title: "新增", key: "menu:add" },
				{ title: "编辑", key: "menu:edit" },
				{ title: "删除", key: "menu:delete" },
			],
		},
		{
			title: "角色管理",
			key: "role",
			children: [
				{ title: "查看", key: "role:view" },
				{ title: "新增", key: "role:add" },
				{ title: "编辑", key: "role:edit" },
				{ title: "删除", key: "role:delete" },
			],
		},
	];

	useEffect(() => {
		fetchRoles();
	}, []);

	const fetchRoles = async () => {
		setLoading(true);
		try {
			setTimeout(() => {
				setRoles(mockRoles);
				setLoading(false);
			}, 500);
		} catch (error) {
			console.error("获取角色列表失败:", error);
			setRoles(mockRoles);
			setLoading(false);
		}
	};

	const columns: ColumnsType<Role> = [
		{
			title: "ID",
			dataIndex: "id",
			width: 80,
		},
		{
			title: "角色名称",
			dataIndex: "name",
		},
		{
			title: "描述",
			dataIndex: "description",
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
			title: "权限数量",
			dataIndex: "permissions",
			render: (permissions: string[]) => <Tag color="blue">{permissions.length}</Tag>,
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
		},
		{
			title: "操作",
			width: 250,
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="link"
						icon={<SettingOutlined />}
						onClick={() => handlePermissions(record)}
					>
						权限
					</Button>
					<Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						编辑
					</Button>
					<Popconfirm
						title="确定要删除这个角色吗？"
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
		setEditingRole(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (role: Role) => {
		setEditingRole(role);
		form.setFieldsValue(role);
		setModalVisible(true);
	};

	const handlePermissions = (role: Role) => {
		setSelectedRole(role);
		setCheckedKeys(role.permissions);
		setPermissionModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			setRoles(roles.filter((role) => role.id !== id));
			message.success("删除成功");
		} catch (error) {
			console.error("删除失败:", error);
			message.error("删除失败");
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingRole) {
				const updatedRole = { ...editingRole, ...values };
				setRoles(roles.map((role) => (role.id === editingRole.id ? updatedRole : role)));
				message.success("更新成功");
			} else {
				const newRole: Role = {
					id: Date.now().toString(),
					...values,
					permissions: [],
					createdAt: new Date().toISOString().split("T")[0],
				};
				setRoles([...roles, newRole]);
				message.success("添加成功");
			}

			setModalVisible(false);
		} catch (error) {
			console.error("提交失败:", error);
		}
	};

	const handlePermissionSubmit = () => {
		if (selectedRole) {
			const updatedRole = {
				...selectedRole,
				permissions: checkedKeys as string[],
			};
			setRoles(roles.map((role) => (role.id === selectedRole.id ? updatedRole : role)));
			message.success("权限更新成功");
			setPermissionModalVisible(false);
		}
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
				<h2>角色管理</h2>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
					新增角色
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={roles}
				rowKey="id"
				loading={loading}
				pagination={{
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
				}}
			/>

			{/* 角色编辑模态框 */}
			<Modal
				title={editingRole ? "编辑角色" : "新增角色"}
				open={modalVisible}
				onOk={handleSubmit}
				onCancel={() => setModalVisible(false)}
				destroyOnClose
			>
				<Form form={form} layout="vertical" preserve={false}>
					<Form.Item
						name="name"
						label="角色名称"
						rules={[{ required: true, message: "请输入角色名称" }]}
					>
						<Input placeholder="请输入角色名称" />
					</Form.Item>

					<Form.Item
						name="description"
						label="描述"
						rules={[{ required: true, message: "请输入描述" }]}
					>
						<Input.TextArea placeholder="请输入描述" rows={3} />
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
				</Form>
			</Modal>

			{/* 权限设置模态框 */}
			<Modal
				title={`设置权限 - ${selectedRole?.name}`}
				open={permissionModalVisible}
				onOk={handlePermissionSubmit}
				onCancel={() => setPermissionModalVisible(false)}
				width={600}
			>
				<Card>
					<Tree
						checkable
						checkedKeys={checkedKeys}
						onCheck={(checked) => setCheckedKeys(checked as React.Key[])}
						treeData={permissionTree}
						height={400}
					/>
				</Card>
			</Modal>
		</div>
	);
};

export default RoleManagement;
