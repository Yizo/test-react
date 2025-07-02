import React, { useState } from "react";
import { Table, Card, Select, Input, Button, Space, Tag, Modal, Descriptions } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined, RollbackOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ConfigHistoryRecord } from "./mock";
import { mockConfigHistory } from "./mock";
import { CHANGE_TYPE_OPTIONS, STATUS_OPTIONS } from "./const";

const { Option } = Select;
const { Search } = Input;

const ConfigHistoryPage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [dataSource] = useState<ConfigHistoryRecord[]>(mockConfigHistory);

	const [selectedRecord, setSelectedRecord] = useState<ConfigHistoryRecord | null>(null);
	const [detailVisible, setDetailVisible] = useState(false);
	const [filters, setFilters] = useState({
		appKey: "",
		changeType: "",
		status: "",
	});

	const columns: ColumnsType<ConfigHistoryRecord> = [
		{
			title: "应用名称",
			dataIndex: "appName",
			key: "appName",
			width: 120,
		},
		{
			title: "AppKey",
			dataIndex: "appKey",
			key: "appKey",
			width: 150,
			render: (text) => <code>{text}</code>,
		},
		{
			title: "配置版本",
			dataIndex: "version",
			key: "version",
			width: 100,
			render: (text) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: "变更类型",
			dataIndex: "changeType",
			key: "changeType",
			width: 100,
			render: (type: "create" | "update" | "rollback" | "publish") => {
				const colors = {
					create: "green",
					update: "blue",
					rollback: "orange",
					publish: "purple",
				} as const;
				const labels = {
					create: "创建",
					update: "更新",
					rollback: "回滚",
					publish: "发布",
				} as const;
				return <Tag color={colors[type]}>{labels[type]}</Tag>;
			},
		},
		{
			title: "操作人",
			dataIndex: "operatorName",
			key: "operatorName",
			width: 100,
		},
		{
			title: "变更时间",
			dataIndex: "changeTime",
			key: "changeTime",
			width: 160,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 80,
			render: (status) => (
				<Tag color={status === "success" ? "success" : "error"}>
					{status === "success" ? "成功" : "失败"}
				</Tag>
			),
		},
		{
			title: "变更内容",
			dataIndex: "changeContent",
			key: "changeContent",
			ellipsis: true,
		},
		{
			title: "操作",
			key: "action",
			width: 150,
			render: (_, record) => (
				<Space>
					<Button
						type="link"
						size="small"
						icon={<EyeOutlined />}
						onClick={() => handleViewDetail(record)}
					>
						详情
					</Button>
					{record.changeType !== "rollback" && (
						<Button
							type="link"
							size="small"
							icon={<RollbackOutlined />}
							onClick={() => handleRollback(record)}
						>
							回滚
						</Button>
					)}
				</Space>
			),
		},
	];

	const handleViewDetail = (record: ConfigHistoryRecord) => {
		setSelectedRecord(record);
		setDetailVisible(true);
	};

	const handleRollback = (record: ConfigHistoryRecord) => {
		Modal.confirm({
			title: "确认回滚",
			content: `确定要回滚到版本 ${record.version} 吗？此操作将创建一个新的配置版本。`,
			okText: "确认回滚",
			cancelText: "取消",
			onOk: async () => {
				setLoading(true);
				try {
					// 这里调用回滚API
					console.log("回滚配置:", record);
					// 刷新数据
					await handleRefresh();
				} catch (error) {
					console.error("回滚失败:", error);
				} finally {
					setLoading(false);
				}
			},
		});
	};

	const handleRefresh = async () => {
		setLoading(true);
		try {
			// 这里调用刷新数据的API
			console.log("刷新配置历史数据");
		} catch (error) {
			console.error("刷新失败:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (value: string) => {
		console.log("搜索:", value);
		// 实现搜索逻辑
	};

	const handleFilterChange = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		console.log("筛选条件变更:", { ...filters, [key]: value });
	};

	return (
		<div className="config-history-page">
			<Card>
				<div className="page-header">
					<h2>配置历史</h2>
					<div className="filters-bar" style={{ marginBottom: 16 }}>
						<Space wrap>
							<Select
								placeholder="选择应用"
								style={{ width: 200 }}
								allowClear
								onChange={(value) => handleFilterChange("appKey", value || "")}
							>
								<Option value="ecommerce-main">电商主站</Option>
								<Option value="user-center">用户中心</Option>
								<Option value="payment-system">支付系统</Option>
							</Select>

							<Select
								placeholder="变更类型"
								style={{ width: 120 }}
								allowClear
								onChange={(value) => handleFilterChange("changeType", value || "")}
							>
								{CHANGE_TYPE_OPTIONS.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
							</Select>

							<Select
								placeholder="状态"
								style={{ width: 100 }}
								allowClear
								onChange={(value) => handleFilterChange("status", value || "")}
							>
								{STATUS_OPTIONS.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
							</Select>

							<Search
								placeholder="搜索操作人、变更内容..."
								style={{ width: 250 }}
								onSearch={handleSearch}
								enterButton={<SearchOutlined />}
							/>

							<Button
								icon={<ReloadOutlined />}
								onClick={handleRefresh}
								loading={loading}
							>
								刷新
							</Button>
						</Space>
					</div>
				</div>

				<Table
					columns={columns}
					dataSource={dataSource}
					rowKey="id"
					loading={loading}
					pagination={{
						total: dataSource.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `共 ${total} 条记录`,
					}}
					scroll={{ x: 1200 }}
				/>
			</Card>

			{/* 详情弹窗 */}
			<Modal
				title="配置变更详情"
				open={detailVisible}
				onCancel={() => setDetailVisible(false)}
				footer={null}
				width={800}
			>
				{selectedRecord && (
					<Descriptions column={2} bordered>
						<Descriptions.Item label="应用名称">
							{selectedRecord.appName}
						</Descriptions.Item>
						<Descriptions.Item label="AppKey">
							<code>{selectedRecord.appKey}</code>
						</Descriptions.Item>
						<Descriptions.Item label="配置版本">
							<Tag color="blue">{selectedRecord.version}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="变更类型">
							<Tag
								color={
									selectedRecord.changeType === "create"
										? "green"
										: selectedRecord.changeType === "update"
											? "blue"
											: selectedRecord.changeType === "rollback"
												? "orange"
												: "purple"
								}
							>
								{selectedRecord.changeType === "create"
									? "创建"
									: selectedRecord.changeType === "update"
										? "更新"
										: selectedRecord.changeType === "rollback"
											? "回滚"
											: "发布"}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="操作人">
							{selectedRecord.operatorName} ({selectedRecord.operator})
						</Descriptions.Item>
						<Descriptions.Item label="变更时间">
							{selectedRecord.changeTime}
						</Descriptions.Item>
						<Descriptions.Item label="状态">
							<Tag color={selectedRecord.status === "success" ? "success" : "error"}>
								{selectedRecord.status === "success" ? "成功" : "失败"}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="变更内容" span={2}>
							{selectedRecord.changeContent}
						</Descriptions.Item>
						{selectedRecord.description && (
							<Descriptions.Item label="备注说明" span={2}>
								{selectedRecord.description}
							</Descriptions.Item>
						)}
					</Descriptions>
				)}
			</Modal>
		</div>
	);
};

export default ConfigHistoryPage;
