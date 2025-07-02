import React, { useState, useEffect } from "react";
import {
	Table,
	Button,
	Input,
	Select,
	Space,
	Tag,
	Card,
	DatePicker,
	Modal,
	Descriptions,
} from "antd";
import { EyeOutlined, ExportOutlined } from "@ant-design/icons";
import type { AlertHistory } from "./mock";
import { mockAlertHistory } from "./mock";
import {
	ALERT_HISTORY_TYPE_MAP,
	ALERT_HISTORY_TYPE_OPTIONS,
	ALERT_HISTORY_LEVEL_MAP,
	ALERT_HISTORY_LEVEL_OPTIONS,
	ALERT_HISTORY_STATUS_MAP,
	ALERT_HISTORY_STATUS_OPTIONS,
} from "./const";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AlertHistoryPage: React.FC = () => {
	const [alerts, setAlerts] = useState<AlertHistory[]>([]);
	const [loading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filterType, setFilterType] = useState<string>("");
	const [filterLevel, setFilterLevel] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [selectedAlert, setSelectedAlert] = useState<AlertHistory | null>(null);
	const [isDetailVisible, setIsDetailVisible] = useState(false);

	useEffect(() => {
		setAlerts(mockAlertHistory);
	}, []);

	const columns = [
		{
			title: "告警时间",
			dataIndex: "triggerTime",
			key: "triggerTime",
			width: 180,
			sorter: (a: AlertHistory, b: AlertHistory) =>
				new Date(a.triggerTime).getTime() - new Date(b.triggerTime).getTime(),
		},
		{
			title: "规则名称",
			dataIndex: "ruleName",
			key: "ruleName",
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			render: (type: keyof typeof ALERT_HISTORY_TYPE_MAP) => (
				<Tag color={ALERT_HISTORY_TYPE_MAP[type].color}>
					{ALERT_HISTORY_TYPE_MAP[type].text}
				</Tag>
			),
		},
		{
			title: "应用",
			key: "app",
			render: (record: AlertHistory) => (
				<div>
					<div>{record.appName}</div>
					<code style={{ fontSize: "12px", color: "#666" }}>{record.appKey}</code>
				</div>
			),
		},
		{
			title: "告警级别",
			dataIndex: "level",
			key: "level",
			render: (level: keyof typeof ALERT_HISTORY_LEVEL_MAP) => (
				<Tag color={ALERT_HISTORY_LEVEL_MAP[level].color}>
					{ALERT_HISTORY_LEVEL_MAP[level].text}
				</Tag>
			),
		},
		{
			title: "告警内容",
			dataIndex: "content",
			key: "content",
			ellipsis: true,
		},
		{
			title: "处理状态",
			dataIndex: "status",
			key: "status",
			render: (status: keyof typeof ALERT_HISTORY_STATUS_MAP) => (
				<Tag color={ALERT_HISTORY_STATUS_MAP[status].color}>
					{ALERT_HISTORY_STATUS_MAP[status].text}
				</Tag>
			),
		},
		{
			title: "处理人",
			dataIndex: "handler",
			key: "handler",
			render: (handler: string) => handler || "-",
		},
		{
			title: "操作",
			key: "action",
			width: 120,
			render: (record: AlertHistory) => (
				<Space size="small">
					<Button
						size="small"
						icon={<EyeOutlined />}
						onClick={() => handleViewDetail(record)}
					>
						详情
					</Button>
					{record.status === "pending" && (
						<Button
							size="small"
							type="primary"
							onClick={() => handleProcess(record.id)}
						>
							处理
						</Button>
					)}
				</Space>
			),
		},
	];

	const handleViewDetail = (alert: AlertHistory) => {
		setSelectedAlert(alert);
		setIsDetailVisible(true);
	};

	const handleProcess = (id: string) => {
		Modal.confirm({
			title: "处理告警",
			content: "确定要处理这个告警吗？",
			onOk: () => {
				setAlerts(
					alerts.map((alert) =>
						alert.id === id
							? {
									...alert,
									status: "processing",
									handler: "当前用户",
									handleTime: new Date().toLocaleString(),
								}
							: alert
					)
				);
			},
		});
	};

	const handleExport = () => {
		console.log("导出告警历史");
	};

	const filteredAlerts = alerts.filter((alert) => {
		const matchSearch =
			alert.ruleName.includes(searchText) ||
			alert.appName.includes(searchText) ||
			alert.content.includes(searchText);
		const matchType = !filterType || alert.type === filterType;
		const matchLevel = !filterLevel || alert.level === filterLevel;
		const matchStatus = !filterStatus || alert.status === filterStatus;
		return matchSearch && matchType && matchLevel && matchStatus;
	});

	return (
		<Card>
			<div style={{ marginBottom: 16 }}>
				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder="搜索规则名称、应用、内容"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="告警类型"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterType}
					>
						{ALERT_HISTORY_TYPE_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					<Select
						placeholder="告警级别"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterLevel}
					>
						{ALERT_HISTORY_LEVEL_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					<Select
						placeholder="处理状态"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterStatus}
					>
						{ALERT_HISTORY_STATUS_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					<RangePicker placeholder={["开始时间", "结束时间"]} />
				</Space>
				<div>
					<Space>
						<Button icon={<ExportOutlined />} onClick={handleExport}>
							导出历史
						</Button>
					</Space>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={filteredAlerts}
				rowKey="id"
				loading={loading}
				pagination={{
					total: filteredAlerts.length,
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 条记录`,
				}}
			/>

			<Modal
				title="告警详情"
				open={isDetailVisible}
				onCancel={() => setIsDetailVisible(false)}
				footer={[
					<Button key="close" onClick={() => setIsDetailVisible(false)}>
						关闭
					</Button>,
				]}
				width={800}
			>
				{selectedAlert && (
					<Descriptions column={2} bordered>
						<Descriptions.Item label="告警时间" span={2}>
							{selectedAlert.triggerTime}
						</Descriptions.Item>
						<Descriptions.Item label="规则名称">
							{selectedAlert.ruleName}
						</Descriptions.Item>
						<Descriptions.Item label="告警类型">
							<Tag color={ALERT_HISTORY_TYPE_MAP[selectedAlert.type].color}>
								{ALERT_HISTORY_TYPE_MAP[selectedAlert.type].text}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="应用名称">
							{selectedAlert.appName}
						</Descriptions.Item>
						<Descriptions.Item label="AppKey">
							<code>{selectedAlert.appKey}</code>
						</Descriptions.Item>
						<Descriptions.Item label="告警级别">
							<Tag color={ALERT_HISTORY_LEVEL_MAP[selectedAlert.level].color}>
								{ALERT_HISTORY_LEVEL_MAP[selectedAlert.level].text}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="处理状态">
							<Tag color={ALERT_HISTORY_STATUS_MAP[selectedAlert.status].color}>
								{ALERT_HISTORY_STATUS_MAP[selectedAlert.status].text}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="告警内容" span={2}>
							{selectedAlert.content}
						</Descriptions.Item>
						{selectedAlert.handler && (
							<>
								<Descriptions.Item label="处理人">
									{selectedAlert.handler}
								</Descriptions.Item>
								<Descriptions.Item label="处理时间">
									{selectedAlert.handleTime}
								</Descriptions.Item>
							</>
						)}
						{selectedAlert.handleNote && (
							<Descriptions.Item label="处理说明" span={2}>
								{selectedAlert.handleNote}
							</Descriptions.Item>
						)}
					</Descriptions>
				)}
			</Modal>
		</Card>
	);
};

export default AlertHistoryPage;
