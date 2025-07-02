import React, { useState } from "react";
import { Table, Button, Input, Select, Space, Tag, Modal, Form, message, Card, Avatar } from "antd";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	UserOutlined,
	MailOutlined,
} from "@ant-design/icons";
import type { Member } from "./mock";
import { mockMembers } from "./mock";
import {
	MEMBER_ROLE_MAP,
	MEMBER_ROLE_OPTIONS,
	MEMBER_STATUS_MAP,
	MEMBER_STATUS_OPTIONS,
} from "./const";

const { Search } = Input;
const { Option } = Select;

const MembersPage: React.FC = () => {
	const [members, setMembers] = useState<Member[]>(mockMembers);
	const [loading] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [searchText, setSearchText] = useState("");
	const [filterRole, setFilterRole] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingMember, setEditingMember] = useState<Member | null>(null);
	const [form] = Form.useForm();

	const columns = [
		{
			title: "成员信息",
			key: "member",
			render: (record: Member) => (
				<Space>
					<Avatar src={record.avatar} icon={<UserOutlined />} />
					<div>
						<div style={{ fontWeight: 500 }}>{record.name}</div>
						<div style={{ fontSize: "12px", color: "#666" }}>
							<MailOutlined /> {record.email}
						</div>
					</div>
				</Space>
			),
		},
		{
			title: "角色",
			dataIndex: "role",
			key: "role",
			render: (role: keyof typeof MEMBER_ROLE_MAP) => (
				<Tag color={MEMBER_ROLE_MAP[role].color}>{MEMBER_ROLE_MAP[role].text}</Tag>
			),
		},
		{
			title: "关联应用",
			dataIndex: "apps",
			key: "apps",
			render: (apps: string[]) => (
				<div>
					{apps.map((app) => (
						<Tag key={app} color="blue" style={{ marginBottom: 4 }}>
							{app}
						</Tag>
					))}
					{apps.length === 0 && <span style={{ color: "#ccc" }}>无</span>}
				</div>
			),
		},
		{
			title: "所属分组",
			dataIndex: "groups",
			key: "groups",
			render: (groups: string[]) => (
				<div>
					{groups.map((group) => (
						<Tag key={group} color="green">
							{group}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: keyof typeof MEMBER_STATUS_MAP) => (
				<Tag color={MEMBER_STATUS_MAP[status].color}>{MEMBER_STATUS_MAP[status].text}</Tag>
			),
		},
		{
			title: "加入时间",
			dataIndex: "joinTime",
			key: "joinTime",
			width: 180,
		},
		{
			title: "最后登录",
			dataIndex: "lastLogin",
			key: "lastLogin",
			width: 180,
		},
		{
			title: "操作",
			key: "action",
			width: 150,
			render: (record: Member) => (
				<Space size="small">
					<Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						编辑
					</Button>
					<Button
						size="small"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDelete(record.id)}
					>
						移除
					</Button>
				</Space>
			),
		},
	];

	const handleInviteMember = () => {
		setEditingMember(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (member: Member) => {
		setEditingMember(member);
		form.setFieldsValue(member);
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: "移除成员",
			content: "确定要移除这个成员吗？",
			onOk: () => {
				setMembers(members.filter((member) => member.id !== id));
				message.success("移除成功");
			},
		});
	};

	const handleBatchRemove = () => {
		if (selectedRowKeys.length === 0) {
			message.warning("请选择要移除的成员");
			return;
		}
		Modal.confirm({
			title: "批量移除",
			content: `确定移除选中的 ${selectedRowKeys.length} 个成员吗？`,
			onOk: () => {
				setMembers(members.filter((member) => !selectedRowKeys.includes(member.id)));
				setSelectedRowKeys([]);
				message.success("批量移除成功");
			},
		});
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (editingMember) {
				// 编辑成员
				setMembers(
					members.map((member) =>
						member.id === editingMember.id ? { ...member, ...values } : member
					)
				);
				message.success("编辑成功");
			} else {
				// 邀请新成员
				const newMember: Member = {
					id: Date.now().toString(),
					...values,
					joinTime: new Date().toLocaleString(),
					lastLogin: "-",
				};
				setMembers([...members, newMember]);
				message.success("邀请成功");
			}
			setIsModalVisible(false);
		});
	};

	const filteredMembers = members.filter((member) => {
		const matchSearch = member.name.includes(searchText) || member.email.includes(searchText);
		const matchRole = !filterRole || member.role === filterRole;
		const matchStatus = !filterStatus || member.status === filterStatus;
		return matchSearch && matchRole && matchStatus;
	});

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedKeys: React.Key[]) => {
			setSelectedRowKeys(selectedKeys as string[]);
		},
	};

	return (
		<Card>
			<div style={{ marginBottom: 16 }}>
				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder="搜索成员姓名、邮箱"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="选择角色"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterRole}
					>
						{MEMBER_ROLE_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					<Select
						placeholder="选择状态"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterStatus}
					>
						{MEMBER_STATUS_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
				</Space>
				<div>
					<Space>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleInviteMember}>
							邀请成员
						</Button>
						<Button danger onClick={handleBatchRemove}>
							批量移除
						</Button>
					</Space>
				</div>
			</div>

			<Table
				rowSelection={rowSelection}
				columns={columns}
				dataSource={filteredMembers}
				rowKey="id"
				loading={loading}
				pagination={{
					total: filteredMembers.length,
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 条记录`,
				}}
			/>

			<Modal
				title={editingMember ? "编辑成员" : "邀请成员"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="姓名"
						rules={[{ required: true, message: "请输入姓名" }]}
					>
						<Input placeholder="请输入成员姓名" />
					</Form.Item>
					<Form.Item
						name="email"
						label="邮箱"
						rules={[
							{ required: true, message: "请输入邮箱" },
							{ type: "email", message: "请输入有效的邮箱地址" },
						]}
					>
						<Input placeholder="请输入邮箱地址" />
					</Form.Item>
					<Form.Item
						name="role"
						label="角色"
						rules={[{ required: true, message: "请选择角色" }]}
					>
						<Select placeholder="请选择角色">
							<Option value="admin">管理员</Option>
							<Option value="developer">开发者</Option>
							<Option value="operator">运维</Option>
							<Option value="viewer">只读</Option>
						</Select>
					</Form.Item>
					<Form.Item name="apps" label="关联应用">
						<Select mode="multiple" placeholder="请选择关联的应用">
							<Option value="app_web_001">官网前端</Option>
							<Option value="app_mobile_002">移动端H5</Option>
						</Select>
					</Form.Item>
					<Form.Item name="groups" label="所属分组">
						<Select mode="multiple" placeholder="请选择所属分组">
							<Option value="官网项目">官网项目</Option>
							<Option value="移动项目">移动项目</Option>
						</Select>
					</Form.Item>
					<Form.Item name="status" label="状态" initialValue="active">
						<Select>
							<Option value="active">活跃</Option>
							<Option value="inactive">禁用</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default MembersPage;
