import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface User {
	id: string;
	username: string;
	name: string;
	email: string;
	status: "active" | "inactive";
	roles: string[];
	createdAt: string;
}

const UserManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [form] = Form.useForm();

	// 模拟数据
	const mockUsers: User[] = [
		{
			id: "1",
			username: "admin",
			name: "管理员",
			email: "admin@example.com",
			status: "active",
			roles: ["管理员"],
			createdAt: "2024-01-01",
		},
		{
			id: "2",
			username: "user1",
			name: "用户1",
			email: "user1@example.com",
			status: "active",
			roles: ["普通用户"],
			createdAt: "2024-01-02",
		},
	];

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			// 这里应该调用真实的API
			// const response = await fetcher('/api/users');
			// setUsers(response.data);

			// 暂时使用模拟数据
			setTimeout(() => {
				setUsers(mockUsers);
				setLoading(false);
			}, 500);
		} catch (error) {
			console.error("获取用户列表失败:", error);
			setUsers(mockUsers);
			setLoading(false);
		}
	};

	const columns: ColumnsType<User> = [
		{
			title: "ID",
			dataIndex: "id",
			width: 80,
		},
		{
			title: "用户名",
			dataIndex: "username",
		},
		{
			title: "姓名",
			dataIndex: "name",
		},
		{
			title: "邮箱",
			dataIndex: "email",
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
			title: "角色",
			dataIndex: "roles",
			render: (roles: string[]) => (
				<>
					{roles.map((role) => (
						<Tag key={role} color="blue">
							{role}
						</Tag>
					))}
				</>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
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
						title="确定要删除这个用户吗？"
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
		setEditingUser(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
		form.setFieldsValue(user);
		setModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			// await fetcher(`/api/users/${id}`, { method: 'DELETE' });
			setUsers(users.filter((user) => user.id !== id));
			message.success("删除成功");
		} catch (error) {
			console.error("删除失败:", error);
			message.error("删除失败");
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingUser) {
				// 更新用户
				const updatedUser = { ...editingUser, ...values };
				setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)));
				message.success("更新成功");
			} else {
				// 新增用户
				const newUser: User = {
					id: Date.now().toString(),
					...values,
					createdAt: new Date().toISOString().split("T")[0],
				};
				setUsers([...users, newUser]);
				message.success("添加成功");
			}

			setModalVisible(false);
		} catch (error) {
			console.error("提交失败:", error);
		}
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
				<h2>用户管理</h2>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
					新增用户
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={users}
				rowKey="id"
				loading={loading}
				pagination={{
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
				}}
			/>

			<Modal
				title={editingUser ? "编辑用户" : "新增用户"}
				open={modalVisible}
				onOk={handleSubmit}
				onCancel={() => setModalVisible(false)}
				destroyOnClose
			>
				<Form form={form} layout="vertical" preserve={false}>
					<Form.Item
						name="username"
						label="用户名"
						rules={[{ required: true, message: "请输入用户名" }]}
					>
						<Input placeholder="请输入用户名" />
					</Form.Item>

					<Form.Item
						name="name"
						label="姓名"
						rules={[{ required: true, message: "请输入姓名" }]}
					>
						<Input placeholder="请输入姓名" />
					</Form.Item>

					<Form.Item
						name="email"
						label="邮箱"
						rules={[
							{ required: true, message: "请输入邮箱" },
							{ type: "email", message: "请输入正确的邮箱格式" },
						]}
					>
						<Input placeholder="请输入邮箱" />
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
						name="roles"
						label="角色"
						rules={[{ required: true, message: "请选择角色" }]}
					>
						<Select mode="multiple" placeholder="请选择角色">
							<Select.Option value="管理员">管理员</Select.Option>
							<Select.Option value="普通用户">普通用户</Select.Option>
							<Select.Option value="访客">访客</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default UserManagement;
