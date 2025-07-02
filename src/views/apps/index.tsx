import React, { useState } from "react";
import {
	Table,
	Button,
	Input,
	Select,
	Space,
	Tag,
	Modal,
	Form,
	message,
	Popconfirm,
	Card,
} from "antd";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { AppItem } from "./mock";
import { mockApps } from "./mock";

const { Search } = Input;
const { Option } = Select;

const AppsPage: React.FC = () => {
	const navigate = useNavigate();
	const [apps, setApps] = useState<AppItem[]>(mockApps);
	const [loading] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [searchText, setSearchText] = useState("");
	const [filterGroup, setFilterGroup] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingApp, setEditingApp] = useState<AppItem | null>(null);
	const [form] = Form.useForm();

	const columns = [
		{
			title: "AppKey",
			dataIndex: "appKey",
			key: "appKey",
			width: 150,
			render: (text: string) => <code>{text}</code>,
		},
		{
			title: "应用名称",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "负责人",
			dataIndex: "owner",
			key: "owner",
		},
		{
			title: "分组",
			dataIndex: "group",
			key: "group",
		},
		{
			title: "标签",
			dataIndex: "tags",
			key: "tags",
			render: (tags: string[]) => (
				<>
					{tags.map((tag) => (
						<Tag key={tag} color="blue">
							{tag}
						</Tag>
					))}
				</>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string) => (
				<Tag color={status === "active" ? "green" : "red"}>
					{status === "active" ? "启用" : "禁用"}
				</Tag>
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
			width: 220,
			render: (_: any, record: AppItem) => (
				<Space size="small">
					<Button
						size="small"
						icon={<EyeOutlined />}
						onClick={() => navigate(`/apps/${record.id}`)}
					>
						详情
					</Button>
					<Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						编辑
					</Button>
					<Button
						size="small"
						icon={<SettingOutlined />}
						onClick={() => navigate(`/configs?appKey=${record.appKey}`)}
					>
						配置监控
					</Button>
					<Popconfirm
						title="确定删除这个应用吗？"
						onConfirm={() => handleDelete(record.id)}
						okText="确定"
						cancelText="取消"
					>
						<Button size="small" danger icon={<DeleteOutlined />}>
							删除
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleAdd = () => {
		setEditingApp(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (app: AppItem) => {
		setEditingApp(app);
		form.setFieldsValue(app);
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		setApps(apps.filter((app) => app.id !== id));
		message.success("删除成功");
	};

	const handleBatchDelete = () => {
		if (selectedRowKeys.length === 0) {
			message.warning("请选择要删除的应用");
			return;
		}
		Modal.confirm({
			title: "批量删除",
			content: `确定删除选中的 ${selectedRowKeys.length} 个应用吗？`,
			onOk: () => {
				setApps(apps.filter((app) => !selectedRowKeys.includes(app.id)));
				setSelectedRowKeys([]);
				message.success("批量删除成功");
			},
		});
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (editingApp) {
				// 编辑
				setApps(
					apps.map((app) =>
						app.id === editingApp.id
							? { ...app, ...values, updateTime: new Date().toLocaleString() }
							: app
					)
				);
				message.success("编辑成功");
			} else {
				// 新增
				const newApp: AppItem = {
					id: Date.now().toString(),
					appKey: `app_${Date.now()}`,
					...values,
					createTime: new Date().toLocaleString(),
					updateTime: new Date().toLocaleString(),
				};
				setApps([...apps, newApp]);
				message.success("新增成功");
			}
			setIsModalVisible(false);
		});
	};

	const filteredApps = apps.filter((app) => {
		const matchSearch =
			app.name.includes(searchText) ||
			app.appKey.includes(searchText) ||
			app.owner.includes(searchText);
		const matchGroup = !filterGroup || app.group === filterGroup;
		const matchStatus = !filterStatus || app.status === filterStatus;
		return matchSearch && matchGroup && matchStatus;
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
						placeholder="搜索应用名称、AppKey、负责人"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="选择分组"
						allowClear
						style={{ width: 150 }}
						onChange={setFilterGroup}
					>
						<Option value="官网项目">官网项目</Option>
						<Option value="移动项目">移动项目</Option>
					</Select>
					<Select
						placeholder="选择状态"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterStatus}
					>
						<Option value="active">启用</Option>
						<Option value="inactive">禁用</Option>
					</Select>
				</Space>
				<div>
					<Space>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
							新增应用
						</Button>
						<Button danger onClick={handleBatchDelete}>
							批量删除
						</Button>
					</Space>
				</div>
			</div>

			<Table
				rowSelection={rowSelection}
				columns={columns}
				dataSource={filteredApps}
				rowKey="id"
				loading={loading}
				pagination={{
					total: filteredApps.length,
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 条记录`,
				}}
			/>

			<Modal
				title={editingApp ? "编辑应用" : "新增应用"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="应用名称"
						rules={[{ required: true, message: "请输入应用名称" }]}
					>
						<Input placeholder="请输入应用名称" />
					</Form.Item>
					<Form.Item
						name="owner"
						label="负责人"
						rules={[{ required: true, message: "请输入负责人" }]}
					>
						<Input placeholder="请输入负责人" />
					</Form.Item>
					<Form.Item name="group" label="分组">
						<Select placeholder="请选择分组">
							<Option value="官网项目">官网项目</Option>
							<Option value="移动项目">移动项目</Option>
						</Select>
					</Form.Item>
					<Form.Item name="tags" label="标签">
						<Select mode="tags" placeholder="请输入标签">
							<Option value="Web">Web</Option>
							<Option value="Mobile">Mobile</Option>
							<Option value="PC">PC</Option>
							<Option value="H5">H5</Option>
						</Select>
					</Form.Item>
					<Form.Item name="description" label="描述">
						<Input.TextArea rows={3} placeholder="请输入应用描述" />
					</Form.Item>
					<Form.Item name="status" label="状态" initialValue="active">
						<Select>
							<Option value="active">启用</Option>
							<Option value="inactive">禁用</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default AppsPage;
