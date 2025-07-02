import React, { useState, useEffect } from "react";
import {
	Card,
	Table,
	Button,
	Input,
	Select,
	Space,
	Tag,
	Modal,
	Form,
	message,
	Row,
	Col,
	Avatar,
	Typography,
	Rate,
	Switch,
	Descriptions,
} from "antd";
import {
	DownloadOutlined,
	SettingOutlined,
	DeleteOutlined,
	InfoCircleOutlined,
	AppstoreOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Text, Title, Paragraph } = Typography;

interface Plugin {
	id: string;
	name: string;
	description: string;
	version: string;
	author: string;
	category: string;
	status: "installed" | "available" | "updating";
	rating: number;
	downloads: number;
	icon: string;
	tags: string[];
	installTime?: string;
	size: string;
	homepage?: string;
	repository?: string;
}

const PluginsPage: React.FC = () => {
	const [plugins, setPlugins] = useState<Plugin[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
	const [isDetailVisible, setIsDetailVisible] = useState(false);
	const [isConfigVisible, setIsConfigVisible] = useState(false);
	const [form] = Form.useForm();

	// 模拟数据
	useEffect(() => {
		const mockPlugins: Plugin[] = [
			{
				id: "1",
				name: "错误上报增强",
				description: "增强版错误上报插件，支持错误堆栈分析和自动分类",
				version: "2.1.0",
				author: "监控团队",
				category: "monitoring",
				status: "installed",
				rating: 4.8,
				downloads: 2580,
				icon: "🔍",
				tags: ["错误监控", "堆栈分析"],
				installTime: "2024-01-15 10:30:00",
				size: "2.3 MB",
				homepage: "https://example.com/error-plugin",
				repository: "https://github.com/example/error-plugin",
			},
			{
				id: "2",
				name: "性能分析工具",
				description: "深度性能分析插件，提供详细的性能指标和优化建议",
				version: "1.5.2",
				author: "性能优化团队",
				category: "performance",
				status: "installed",
				rating: 4.6,
				downloads: 1920,
				icon: "⚡",
				tags: ["性能监控", "优化建议"],
				installTime: "2024-01-10 14:20:00",
				size: "3.1 MB",
				homepage: "https://example.com/perf-plugin",
			},
			{
				id: "3",
				name: "用户行为分析",
				description: "用户行为轨迹分析插件，支持热力图和用户路径分析",
				version: "3.2.1",
				author: "用户体验团队",
				category: "analytics",
				status: "available",
				rating: 4.9,
				downloads: 3420,
				icon: "👥",
				tags: ["用户行为", "热力图", "路径分析"],
				size: "4.2 MB",
				homepage: "https://example.com/behavior-plugin",
			},
			{
				id: "4",
				name: "多渠道告警",
				description: "支持微信、钉钉、飞书等多渠道告警通知",
				version: "1.8.0",
				author: "通知服务团队",
				category: "notification",
				status: "available",
				rating: 4.5,
				downloads: 1650,
				icon: "📢",
				tags: ["告警通知", "多渠道"],
				size: "1.8 MB",
				homepage: "https://example.com/notification-plugin",
			},
			{
				id: "5",
				name: "自定义Dashboard",
				description: "可视化Dashboard定制插件，支持拖拽式图表配置",
				version: "2.0.3",
				author: "可视化团队",
				category: "dashboard",
				status: "updating",
				rating: 4.7,
				downloads: 890,
				icon: "📊",
				tags: ["可视化", "自定义"],
				installTime: "2024-01-08 09:15:00",
				size: "5.6 MB",
				homepage: "https://example.com/dashboard-plugin",
			},
		];
		setPlugins(mockPlugins);
	}, []);

	const categories = [
		{ value: "monitoring", label: "监控类" },
		{ value: "performance", label: "性能类" },
		{ value: "analytics", label: "分析类" },
		{ value: "notification", label: "通知类" },
		{ value: "dashboard", label: "可视化类" },
		{ value: "security", label: "安全类" },
	];

	const statusMap = {
		installed: { text: "已安装", color: "green" },
		available: { text: "可安装", color: "blue" },
		updating: { text: "更新中", color: "orange" },
	};

	const columns = [
		{
			title: "插件信息",
			key: "info",
			width: 300,
			render: (record: Plugin) => (
				<div className="flex items-start space-x-3">
					<Avatar size={48} className="bg-blue-500 text-white text-xl">
						{record.icon}
					</Avatar>
					<div className="flex-1">
						<div className="font-medium text-gray-900">{record.name}</div>
						<div className="text-sm text-gray-500 mt-1 line-clamp-2">
							{record.description}
						</div>
						<div className="flex items-center space-x-2 mt-2">
							<Rate disabled defaultValue={record.rating} />
							<Text type="secondary" className="text-xs">
								{record.rating} ({record.downloads} 下载)
							</Text>
						</div>
					</div>
				</div>
			),
		},
		{
			title: "版本",
			dataIndex: "version",
			key: "version",
			width: 100,
			render: (version: string) => <Tag color="blue">{version}</Tag>,
		},
		{
			title: "分类",
			dataIndex: "category",
			key: "category",
			width: 100,
			render: (category: string) => {
				const cat = categories.find((c) => c.value === category);
				return <Tag>{cat?.label || category}</Tag>;
			},
		},
		{
			title: "标签",
			dataIndex: "tags",
			key: "tags",
			width: 200,
			render: (tags: string[]) => (
				<div className="flex flex-wrap gap-1">
					{tags.map((tag) => (
						<Tag key={tag} color="purple">
							{tag}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: (status: keyof typeof statusMap) => (
				<Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
			),
		},
		{
			title: "操作",
			key: "action",
			width: 200,
			render: (record: Plugin) => (
				<Space size="small">
					<Button
						size="small"
						icon={<InfoCircleOutlined />}
						onClick={() => handleViewDetail(record)}
					>
						详情
					</Button>
					{record.status === "available" && (
						<Button
							size="small"
							type="primary"
							icon={<DownloadOutlined />}
							onClick={() => handleInstall(record)}
						>
							安装
						</Button>
					)}
					{record.status === "installed" && (
						<>
							<Button
								size="small"
								icon={<SettingOutlined />}
								onClick={() => handleConfig(record)}
							>
								配置
							</Button>
							<Button
								size="small"
								danger
								icon={<DeleteOutlined />}
								onClick={() => handleUninstall(record)}
							>
								卸载
							</Button>
						</>
					)}
					{record.status === "updating" && (
						<Button size="small" loading>
							更新中
						</Button>
					)}
				</Space>
			),
		},
	];

	const handleViewDetail = (plugin: Plugin) => {
		setSelectedPlugin(plugin);
		setIsDetailVisible(true);
	};

	const handleInstall = (plugin: Plugin) => {
		Modal.confirm({
			title: "安装插件",
			content: `确定要安装插件 "${plugin.name}" 吗？`,
			onOk: () => {
				setLoading(true);
				// 模拟安装过程
				setTimeout(() => {
					setPlugins(
						plugins.map((p) =>
							p.id === plugin.id
								? {
										...p,
										status: "installed",
										installTime: new Date().toLocaleString(),
									}
								: p
						)
					);
					setLoading(false);
					message.success("插件安装成功");
				}, 2000);
			},
		});
	};

	const handleUninstall = (plugin: Plugin) => {
		Modal.confirm({
			title: "卸载插件",
			content: `确定要卸载插件 "${plugin.name}" 吗？卸载后配置将被清除。`,
			onOk: () => {
				setPlugins(
					plugins.map((p) =>
						p.id === plugin.id
							? { ...p, status: "available", installTime: undefined }
							: p
					)
				);
				message.success("插件卸载成功");
			},
		});
	};

	const handleConfig = (plugin: Plugin) => {
		setSelectedPlugin(plugin);
		form.resetFields();
		setIsConfigVisible(true);
	};

	const handleConfigSave = () => {
		form.validateFields().then(() => {
			message.success("插件配置已保存");
			setIsConfigVisible(false);
		});
	};

	const filteredPlugins = plugins.filter((plugin) => {
		const matchSearch =
			plugin.name.includes(searchText) ||
			plugin.description.includes(searchText) ||
			plugin.tags.some((tag) => tag.includes(searchText));
		const matchCategory = !filterCategory || plugin.category === filterCategory;
		const matchStatus = !filterStatus || plugin.status === filterStatus;
		return matchSearch && matchCategory && matchStatus;
	});

	return (
		<div className="p-6">
			<div className="mb-6">
				<Title level={2} className="flex items-center gap-2">
					<AppstoreOutlined />
					插件市场
				</Title>
				<Paragraph type="secondary">扩展监控功能，安装和管理各种插件</Paragraph>
			</div>

			<Card className="mb-6">
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={8}>
						<Search
							placeholder="搜索插件名称、描述、标签"
							allowClear
							onSearch={setSearchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
					</Col>
					<Col xs={12} sm={4}>
						<Select
							placeholder="分类"
							allowClear
							style={{ width: "100%" }}
							onChange={setFilterCategory}
						>
							{categories.map((cat) => (
								<Option key={cat.value} value={cat.value}>
									{cat.label}
								</Option>
							))}
						</Select>
					</Col>
					<Col xs={12} sm={4}>
						<Select
							placeholder="状态"
							allowClear
							style={{ width: "100%" }}
							onChange={setFilterStatus}
						>
							<Option value="installed">已安装</Option>
							<Option value="available">可安装</Option>
							<Option value="updating">更新中</Option>
						</Select>
					</Col>
				</Row>
			</Card>

			<Card>
				<Table
					columns={columns}
					dataSource={filteredPlugins}
					rowKey="id"
					loading={loading}
					pagination={{
						total: filteredPlugins.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `共 ${total} 个插件`,
					}}
				/>
			</Card>

			{/* 插件详情模态框 */}
			<Modal
				title={`插件详情 - ${selectedPlugin?.name}`}
				open={isDetailVisible}
				onCancel={() => setIsDetailVisible(false)}
				footer={[
					<Button key="close" onClick={() => setIsDetailVisible(false)}>
						关闭
					</Button>,
				]}
				width={800}
			>
				{selectedPlugin && (
					<div className="space-y-6">
						<div className="flex items-start space-x-4">
							<Avatar size={64} className="bg-blue-500 text-white text-2xl">
								{selectedPlugin.icon}
							</Avatar>
							<div className="flex-1">
								<Title level={4} className="mb-2">
									{selectedPlugin.name}
								</Title>
								<Paragraph>{selectedPlugin.description}</Paragraph>
								<div className="flex items-center space-x-4">
									<Rate disabled defaultValue={selectedPlugin.rating} />
									<Text type="secondary">
										{selectedPlugin.rating} 分 · {selectedPlugin.downloads}{" "}
										次下载
									</Text>
								</div>
							</div>
						</div>

						<Descriptions column={2} bordered>
							<Descriptions.Item label="版本">
								{selectedPlugin.version}
							</Descriptions.Item>
							<Descriptions.Item label="作者">
								{selectedPlugin.author}
							</Descriptions.Item>
							<Descriptions.Item label="分类">
								{categories.find((c) => c.value === selectedPlugin.category)?.label}
							</Descriptions.Item>
							<Descriptions.Item label="大小">
								{selectedPlugin.size}
							</Descriptions.Item>
							{selectedPlugin.installTime && (
								<Descriptions.Item label="安装时间" span={2}>
									{selectedPlugin.installTime}
								</Descriptions.Item>
							)}
							{selectedPlugin.homepage && (
								<Descriptions.Item label="主页" span={2}>
									<a
										href={selectedPlugin.homepage}
										target="_blank"
										rel="noopener noreferrer"
									>
										{selectedPlugin.homepage}
									</a>
								</Descriptions.Item>
							)}
							<Descriptions.Item label="标签" span={2}>
								{selectedPlugin.tags.map((tag) => (
									<Tag key={tag} color="purple" className="mb-1">
										{tag}
									</Tag>
								))}
							</Descriptions.Item>
						</Descriptions>
					</div>
				)}
			</Modal>

			{/* 插件配置模态框 */}
			<Modal
				title={`配置插件 - ${selectedPlugin?.name}`}
				open={isConfigVisible}
				onOk={handleConfigSave}
				onCancel={() => setIsConfigVisible(false)}
				width={600}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="enabled" label="启用状态" valuePropName="checked">
						<Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />
					</Form.Item>
					<Form.Item name="config" label="配置参数">
						<Input.TextArea
							rows={6}
							placeholder="请输入JSON格式的配置参数"
							defaultValue={JSON.stringify(
								{
									apiUrl: "https://api.example.com",
									timeout: 5000,
									retryTimes: 3,
								},
								null,
								2
							)}
						/>
					</Form.Item>
					<Form.Item name="autoUpdate" label="自动更新" valuePropName="checked">
						<Switch checkedChildren="开启" unCheckedChildren="关闭" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default PluginsPage;
