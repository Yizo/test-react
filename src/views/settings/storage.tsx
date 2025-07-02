import {
	Card,
	Form,
	Select,
	Input,
	Switch,
	Button,
	Row,
	Col,
	Space,
	Progress,
	Statistic,
	Table,
	Modal,
	message,
	Tabs,
	Upload,
	Divider,
} from "antd";
import {
	SaveOutlined,
	DatabaseOutlined,
	DownloadOutlined,
	UploadOutlined,
	DeleteOutlined,
	FolderOutlined,
	CloudServerOutlined,
	FileZipOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;
const { TabPane } = Tabs;

interface StorageInfo {
	total: number;
	used: number;
	available: number;
	usagePercent: number;
}

interface BackupRecord {
	id: string;
	name: string;
	size: string;
	createTime: string;
	type: string;
	status: string;
}

const StorageSettings = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([
		{
			id: "1",
			name: "system_backup_20240115",
			size: "2.3 GB",
			createTime: "2024-01-15 10:30:00",
			type: "full",
			status: "completed",
		},
		{
			id: "2",
			name: "config_backup_20240110",
			size: "45.2 MB",
			createTime: "2024-01-10 15:20:00",
			type: "config",
			status: "completed",
		},
		{
			id: "3",
			name: "logs_backup_20240105",
			size: "1.8 GB",
			createTime: "2024-01-05 09:15:00",
			type: "logs",
			status: "completed",
		},
	]);

	const storageInfo: StorageInfo = {
		total: 500, // GB
		used: 186,
		available: 314,
		usagePercent: 37,
	};

	const logCategories = [
		{ key: "system", label: "系统日志", size: "3.2 GB", retention: 90 },
		{ key: "application", label: "应用日志", size: "12.5 GB", retention: 30 },
		{ key: "error", label: "错误日志", size: "2.8 GB", retention: 180 },
		{ key: "access", label: "访问日志", size: "45.6 GB", retention: 7 },
		{ key: "audit", label: "审计日志", size: "8.1 GB", retention: 365 },
	];

	const handleSave = async (values: any) => {
		setLoading(true);
		try {
			console.log("保存存储配置:", values);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			message.success("存储配置保存成功");
		} catch (error) {
			message.error("保存失败");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateBackup = () => {
		Modal.confirm({
			title: "创建备份",
			content: "确定要创建系统备份吗？此操作可能需要一些时间。",
			onOk: () => {
				const newBackup: BackupRecord = {
					id: Date.now().toString(),
					name: `system_backup_${new Date().toISOString().split("T")[0].replace(/-/g, "")}`,
					size: "计算中...",
					createTime: new Date().toLocaleString(),
					type: "full",
					status: "creating",
				};
				setBackupRecords([newBackup, ...backupRecords]);
				message.success("备份任务已启动");

				// 模拟备份完成
				setTimeout(() => {
					setBackupRecords((records) =>
						records.map((record) =>
							record.id === newBackup.id
								? { ...record, size: "2.5 GB", status: "completed" }
								: record
						)
					);
					message.success("备份创建完成");
				}, 3000);
			},
		});
	};

	const handleDownloadBackup = (record: BackupRecord) => {
		message.success(`开始下载备份文件: ${record.name}`);
	};

	const handleDeleteBackup = (id: string) => {
		Modal.confirm({
			title: "删除备份",
			content: "确定要删除这个备份文件吗？删除后不可恢复。",
			icon: <ExclamationCircleOutlined />,
			onOk: () => {
				setBackupRecords(backupRecords.filter((record) => record.id !== id));
				message.success("备份文件删除成功");
			},
		});
	};

	const handleCleanLogs = (category: string) => {
		Modal.confirm({
			title: "清理日志",
			content: `确定要清理 ${logCategories.find((c) => c.key === category)?.label} 吗？`,
			onOk: () => {
				message.success("日志清理完成");
			},
		});
	};

	const backupColumns = [
		{
			title: "备份名称",
			dataIndex: "name",
			key: "name",
			render: (text: string, _record: BackupRecord) => (
				<Space>
					<FileZipOutlined />
					{text}
				</Space>
			),
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			render: (type: string) => {
				const typeMap = {
					full: { label: "完整备份", color: "blue" },
					config: { label: "配置备份", color: "green" },
					logs: { label: "日志备份", color: "orange" },
				};
				const config = typeMap[type as keyof typeof typeMap];
				return (
					<span
						className={`px-2 py-1 rounded text-xs bg-${config.color}-100 text-${config.color}-800`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			title: "大小",
			dataIndex: "size",
			key: "size",
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime",
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string) => {
				const statusMap = {
					completed: { label: "已完成", color: "green" },
					creating: { label: "创建中", color: "blue" },
					failed: { label: "失败", color: "red" },
				};
				const config = statusMap[status as keyof typeof statusMap];
				return (
					<span
						className={`px-2 py-1 rounded text-xs bg-${config.color}-100 text-${config.color}-800`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: BackupRecord) => (
				<Space>
					<Button
						type="link"
						size="small"
						icon={<DownloadOutlined />}
						onClick={() => handleDownloadBackup(record)}
						disabled={record.status !== "completed"}
					>
						下载
					</Button>
					<Button
						type="link"
						size="small"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDeleteBackup(record.id)}
					>
						删除
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">日志与存储</h1>
				<p className="text-gray-600">管理系统日志、存储配置和数据备份</p>
			</div>

			<Tabs defaultActiveKey="storage">
				<TabPane tab="存储概览" key="storage">
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={8}>
							<Card>
								<Statistic
									title="总存储空间"
									value={storageInfo.total}
									suffix="GB"
									prefix={<DatabaseOutlined />}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={8}>
							<Card>
								<Statistic
									title="已使用"
									value={storageInfo.used}
									suffix="GB"
									valueStyle={{ color: "#1890ff" }}
									prefix={<FolderOutlined />}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={8}>
							<Card>
								<Statistic
									title="可用空间"
									value={storageInfo.available}
									suffix="GB"
									valueStyle={{ color: "#52c41a" }}
									prefix={<CloudServerOutlined />}
								/>
							</Card>
						</Col>
					</Row>

					<Card title="存储使用情况" className="mt-4">
						<div className="mb-4">
							<div className="flex justify-between items-center mb-2">
								<span>存储使用率</span>
								<span>{storageInfo.usagePercent}%</span>
							</div>
							<Progress
								percent={storageInfo.usagePercent}
								status={storageInfo.usagePercent > 80 ? "exception" : "active"}
								strokeColor={storageInfo.usagePercent > 80 ? "#ff4d4f" : "#1890ff"}
							/>
						</div>

						<div className="space-y-3">
							{logCategories.map((category) => (
								<div
									key={category.key}
									className="flex justify-between items-center p-3 bg-gray-50 rounded"
								>
									<div>
										<div className="font-medium">{category.label}</div>
										<div className="text-sm text-gray-500">
											保留期: {category.retention} 天
										</div>
									</div>
									<div className="text-right">
										<div className="font-medium">{category.size}</div>
										<Button
											type="link"
											size="small"
											danger
											onClick={() => handleCleanLogs(category.key)}
										>
											清理
										</Button>
									</div>
								</div>
							))}
						</div>
					</Card>
				</TabPane>

				<TabPane tab="日志配置" key="logs">
					<Card>
						<Form
							form={form}
							layout="vertical"
							onFinish={handleSave}
							initialValues={{
								logLevel: "info",
								retentionDays: 30,
								maxFileSize: 100,
								autoCleanup: true,
								compress: true,
								enableRemoteLog: false,
							}}
						>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										label="日志级别"
										name="logLevel"
										rules={[{ required: true, message: "请选择日志级别" }]}
									>
										<Select placeholder="请选择日志级别">
											<Option value="debug">Debug - 调试信息</Option>
											<Option value="info">Info - 一般信息</Option>
											<Option value="warn">Warn - 警告信息</Option>
											<Option value="error">Error - 错误信息</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="日志保留天数"
										name="retentionDays"
										rules={[{ required: true, message: "请输入保留天数" }]}
									>
										<Input addonAfter="天" placeholder="请输入保留天数" />
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										label="单个日志文件最大大小"
										name="maxFileSize"
										rules={[{ required: true, message: "请输入最大文件大小" }]}
									>
										<Input addonAfter="MB" placeholder="请输入最大文件大小" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="功能开关">
										<Space direction="vertical" className="w-full">
											<Form.Item
												name="autoCleanup"
												valuePropName="checked"
												noStyle
											>
												<Switch
													checkedChildren="开启"
													unCheckedChildren="关闭"
												/>
												<span className="ml-2">自动清理过期日志</span>
											</Form.Item>
											<Form.Item
												name="compress"
												valuePropName="checked"
												noStyle
											>
												<Switch
													checkedChildren="开启"
													unCheckedChildren="关闭"
												/>
												<span className="ml-2">压缩存储</span>
											</Form.Item>
											<Form.Item
												name="enableRemoteLog"
												valuePropName="checked"
												noStyle
											>
												<Switch
													checkedChildren="开启"
													unCheckedChildren="关闭"
												/>
												<span className="ml-2">远程日志同步</span>
											</Form.Item>
										</Space>
									</Form.Item>
								</Col>
							</Row>

							<Divider />

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									icon={<SaveOutlined />}
									loading={loading}
								>
									保存配置
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</TabPane>

				<TabPane tab="备份管理" key="backup">
					<Card>
						<div className="mb-4 flex justify-between items-center">
							<div>
								<Button
									type="primary"
									icon={<DatabaseOutlined />}
									onClick={handleCreateBackup}
								>
									创建备份
								</Button>
							</div>
							<div>
								<Upload
									accept=".zip,.tar.gz"
									showUploadList={false}
									beforeUpload={() => false}
								>
									<Button icon={<UploadOutlined />}>恢复备份</Button>
								</Upload>
							</div>
						</div>

						<Table
							columns={backupColumns}
							dataSource={backupRecords}
							rowKey="id"
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total) => `共 ${total} 条记录`,
							}}
						/>
					</Card>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default StorageSettings;
