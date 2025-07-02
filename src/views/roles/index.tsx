import React, { useState } from "react";
import {
	Table,
	Button,
	Input,
	Space,
	Tag,
	Modal,
	Form,
	Tree,
	message,
	Card,
	Switch,
	Divider,
} from "antd";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { Role } from "./mock";
import { mockRoles } from "./mock";
import { ROLE_STATUS_MAP, ROLE_STATUS_OPTIONS } from "./const";

const { Search } = Input;

const RolesPage: React.FC = () => {
	const [roles, setRoles] = useState<Role[]>(mockRoles);
	const [loading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
	const [form] = Form.useForm();

	// 权限树结构
	const permissionTree = [
		{
			title: "应用管理",
			key: "app",
			children: [
				{ title: "查看应用", key: "app:view" },
				{ title: "创建应用", key: "app:create" },
				{ title: "编辑应用", key: "app:edit" },
				{ title: "删除应用", key: "app:delete" },
			],
		},
		{
			title: "监控配置",
			key: "config",
			children: [
				{ title: "查看配置", key: "config:view" },
				{ title: "编辑配置", key: "config:edit" },
				{ title: "发布配置", key: "config:publish" },
				{ title: "回滚配置", key: "config:rollback" },
			],
		},
		{
			title: "告警管理",
			key: "alert",
			children: [
				{ title: "查看告警", key: "alert:view" },
				{ title: "创建规则", key: "alert:create" },
				{ title: "编辑规则", key: "alert:edit" },
				{ title: "处理告警", key: "alert:handle" },
			],
		},
		{
			title: "成员管理",
			key: "member",
			children: [
				{ title: "查看成员", key: "member:view" },
				{ title: "邀请成员", key: "member:invite" },
				{ title: "编辑成员", key: "member:edit" },
				{ title: "移除成员", key: "member:remove" },
			],
		},
		{
			title: "系统设置",
			key: "system",
			children: [
				{ title: "查看设置", key: "system:view" },
				{ title: "修改设置", key: "system:edit" },
				{ title: "管理插件", key: "system:plugin" },
			],
		},
	];

	const columns = [
		{
			title: "角色名称",
			dataIndex: "name",
			key: "name",
			render: (text: string, record: Role) => (
				<Space>
					{record.isSystem && <SafetyCertificateOutlined style={{ color: "#1890ff" }} />}
					<span style={{ fontWeight: record.isSystem ? "bold" : "normal" }}>{text}</span>
					{record.isSystem && <Tag color="blue">系统</Tag>}
				</Space>
			),
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "成员数量",
			dataIndex: "memberCount",
			key: "memberCount",
			render: (count: number) => <Tag color="green">{count} 人</Tag>,
		},
		{
			title: "权限数量",
			key: "permissionCount",
			render: (record: Role) => <Tag color="blue">{record.permissions.length} 项</Tag>,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: keyof typeof ROLE_STATUS_MAP) => (
				<Tag color={ROLE_STATUS_MAP[status].color}>{ROLE_STATUS_MAP[status].text}</Tag>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime",
			width: 180,
		},
		{
			title: "操作",
			key: "action",
			width: 200,
			render: (record: Role) => (
				<Space size="small">
					<Button size="small" onClick={() => handleViewPermissions(record)}>
						查看权限
					</Button>
					<Button
						size="small"
						icon={<EditOutlined />}
						onClick={() => handleEdit(record)}
						disabled={record.isSystem}
					>
						编辑
					</Button>
					<Button
						size="small"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDelete(record.id)}
						disabled={record.isSystem}
					>
						删除
					</Button>
				</Space>
			),
		},
	];

	const handleCreateRole = () => {
		setEditingRole(null);
		form.resetFields();
		setCheckedKeys([]);
		setIsModalVisible(true);
	};

	const handleEdit = (role: Role) => {
		setEditingRole(role);
		form.setFieldsValue(role);
		setCheckedKeys(role.permissions);
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: "删除角色",
			content: "确定要删除这个角色吗？删除后不可恢复。",
			onOk: () => {
				setRoles(roles.filter((role) => role.id !== id));
				message.success("删除成功");
			},
		});
	};

	const handleViewPermissions = (role: Role) => {
		setSelectedRole(role);
		setCheckedKeys(role.permissions);
		setIsPermissionModalVisible(true);
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const roleData = {
				...values,
				permissions: checkedKeys as string[],
			};

			if (editingRole) {
				// 编辑角色
				setRoles(
					roles.map((role) =>
						role.id === editingRole.id ? { ...role, ...roleData } : role
					)
				);
				message.success("编辑成功");
			} else {
				// 新建角色
				const newRole: Role = {
					id: Date.now().toString(),
					...roleData,
					memberCount: 0,
					createTime: new Date().toLocaleString(),
					isSystem: false,
				};
				setRoles([...roles, newRole]);
				message.success("创建成功");
			}
			setIsModalVisible(false);
		});
	};

	const filteredRoles = roles.filter((role) => {
		return role.name.includes(searchText) || role.description.includes(searchText);
	});

	return (
		<Card>
			<div style={{ marginBottom: 16 }}>
				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder="搜索角色名称、描述"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</Space>
				<div>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRole}>
						新建角色
					</Button>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={filteredRoles}
				rowKey="id"
				loading={loading}
				pagination={{
					total: filteredRoles.length,
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 条记录`,
				}}
			/>

			<Modal
				title={editingRole ? "编辑角色" : "新建角色"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={700}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="角色名称"
						rules={[{ required: true, message: "请输入角色名称" }]}
					>
						<Input placeholder="请输入角色名称" />
					</Form.Item>
					<Form.Item
						name="description"
						label="角色描述"
						rules={[{ required: true, message: "请输入角色描述" }]}
					>
						<Input.TextArea rows={3} placeholder="请输入角色描述" />
					</Form.Item>
					<Form.Item
						name="status"
						label="状态"
						initialValue={true}
						valuePropName="checked"
					>
						<Switch
							checkedChildren={ROLE_STATUS_OPTIONS[0].label}
							unCheckedChildren={ROLE_STATUS_OPTIONS[1].label}
						/>
					</Form.Item>
					<Divider>权限分配</Divider>
					<Tree
						checkable
						defaultExpandAll
						treeData={permissionTree}
						checkedKeys={checkedKeys}
						onCheck={(checked) => setCheckedKeys(checked as React.Key[])}
					/>
				</Form>
			</Modal>

			<Modal
				title={`角色权限 - ${selectedRole?.name}`}
				open={isPermissionModalVisible}
				onCancel={() => setIsPermissionModalVisible(false)}
				footer={[
					<Button key="close" onClick={() => setIsPermissionModalVisible(false)}>
						关闭
					</Button>,
				]}
				width={600}
			>
				<Tree
					checkable
					defaultExpandAll
					treeData={permissionTree}
					checkedKeys={checkedKeys}
					disabled
				/>
			</Modal>
		</Card>
	);
};

export default RolesPage;
