import React, { useState, useEffect } from "react";
import { Card, Table, Button, Tag, Space, Select, DatePicker, Input, Tabs, Badge } from "antd";
import { PlusOutlined, SearchOutlined, BellOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { AlertItem } from "./mock";
import { mockAlerts } from "./mock";
import {
	ALERT_LEVEL_MAP,
	ALERT_LEVEL_OPTIONS,
	ALERT_STATUS_MAP,
	ALERT_STATUS_FILTER_OPTIONS,
} from "./const";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const AlertsManagement: React.FC = () => {
	const navigate = useNavigate();
	const [loading] = useState(false);
	const [alerts] = useState<AlertItem[]>(mockAlerts);
	const [filteredAlerts, setFilteredAlerts] = useState<AlertItem[]>(mockAlerts);
	const [searchText, setSearchText] = useState("");
	const [levelFilter, setLevelFilter] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [activeTab, setActiveTab] = useState("active");

	// 过滤数据
	useEffect(() => {
		let filtered = alerts.filter((alert) => {
			const matchesSearch =
				!searchText ||
				alert.name.toLowerCase().includes(searchText.toLowerCase()) ||
				alert.app.toLowerCase().includes(searchText.toLowerCase()) ||
				alert.description.toLowerCase().includes(searchText.toLowerCase());

			const matchesLevel = !levelFilter || alert.level === levelFilter;
			const matchesStatus = !statusFilter || alert.status === statusFilter;
			const matchesTab = activeTab === "all" || alert.status === activeTab;

			return matchesSearch && matchesLevel && matchesStatus && matchesTab;
		});

		setFilteredAlerts(filtered);
	}, [alerts, searchText, levelFilter, statusFilter, activeTab]);

	const columns: ColumnsType<AlertItem> = [
		{
			title: "告警名称",
			dataIndex: "name",
			key: "name",
			render: (text, record) => (
				<div>
					<div className="font-medium">{text}</div>
					<div className="text-gray-500 text-sm">{record.description}</div>
				</div>
			),
		},
		{
			title: "级别",
			dataIndex: "level",
			key: "level",
			width: 80,
			render: (level: keyof typeof ALERT_LEVEL_MAP) => (
				<Tag color={ALERT_LEVEL_MAP[level].color}>{ALERT_LEVEL_MAP[level].text}</Tag>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 80,
			render: (status: keyof typeof ALERT_STATUS_MAP) => (
				<Tag color={ALERT_STATUS_MAP[status].color}>{ALERT_STATUS_MAP[status].text}</Tag>
			),
		},
		{
			title: "应用",
			dataIndex: "app",
			key: "app",
			width: 120,
		},
		{
			title: "当前值/阈值",
			key: "value",
			width: 140,
			render: (_, record) => (
				<div>
					<div className="font-mono">
						{record.value} / {record.threshold}
					</div>
					<div className="text-gray-500 text-sm">{record.metric}</div>
				</div>
			),
		},
		{
			title: "持续时间",
			dataIndex: "duration",
			key: "duration",
			width: 100,
		},
		{
			title: "触发次数",
			dataIndex: "count",
			key: "count",
			width: 80,
			render: (count: number) => <Badge count={count} color="red" />,
		},
		{
			title: "最后触发",
			dataIndex: "lastTriggered",
			key: "lastTriggered",
			width: 160,
		},
		{
			title: "操作",
			key: "action",
			width: 120,
			render: (_, record) => (
				<Space size="small">
					<Button type="text" size="small">
						查看
					</Button>
					{record.status === "active" && (
						<Button type="text" size="small" danger>
							抑制
						</Button>
					)}
				</Space>
			),
		},
	];

	const getTabCount = (status: string) => {
		if (status === "all") return alerts.length;
		return alerts.filter((alert) => alert.status === status).length;
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">告警管理</h1>
				<p className="text-gray-600">管理和监控系统告警信息</p>
			</div>

			{/* 统计卡片 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<Card className="text-center">
					<div className="text-red-500 text-2xl mb-2">
						<BellOutlined />
					</div>
					<div className="text-2xl font-bold text-red-500">
						{alerts.filter((a) => a.status === "active").length}
					</div>
					<div className="text-gray-500">活跃告警</div>
				</Card>
				<Card className="text-center">
					<div className="text-orange-500 text-2xl mb-2">
						<WarningOutlined />
					</div>
					<div className="text-2xl font-bold text-orange-500">
						{alerts.filter((a) => a.level === "critical").length}
					</div>
					<div className="text-gray-500">严重告警</div>
				</Card>
				<Card className="text-center">
					<div className="text-green-500 text-2xl mb-2">
						<BellOutlined />
					</div>
					<div className="text-2xl font-bold text-green-500">
						{alerts.filter((a) => a.status === "resolved").length}
					</div>
					<div className="text-gray-500">已解决</div>
				</Card>
				<Card className="text-center">
					<div className="text-gray-500 text-2xl mb-2">
						<BellOutlined />
					</div>
					<div className="text-2xl font-bold">
						{alerts.filter((a) => a.status === "suppressed").length}
					</div>
					<div className="text-gray-500">已抑制</div>
				</Card>
			</div>

			<Card>
				<div className="mb-4 flex justify-between items-center">
					<Space>
						<Input
							placeholder="搜索告警名称、应用或描述"
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: 300 }}
						/>
						<Select
							placeholder="告警级别"
							style={{ width: 120 }}
							value={levelFilter}
							onChange={setLevelFilter}
							allowClear
						>
							{ALERT_LEVEL_OPTIONS.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
						<Select
							placeholder="告警状态"
							style={{ width: 120 }}
							value={statusFilter}
							onChange={setStatusFilter}
							allowClear
						>
							{ALERT_STATUS_FILTER_OPTIONS.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
						<RangePicker />
					</Space>
					<Space>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => navigate("/alerts/rules")}
						>
							创建规则
						</Button>
						<Button onClick={() => navigate("/alerts/history")}>告警历史</Button>
					</Space>
				</div>

				<Tabs activeKey={activeTab} onChange={setActiveTab}>
					<TabPane tab={`全部 (${getTabCount("all")})`} key="all" />
					<TabPane tab={`活跃 (${getTabCount("active")})`} key="active" />
					<TabPane tab={`已解决 (${getTabCount("resolved")})`} key="resolved" />
					<TabPane tab={`已抑制 (${getTabCount("suppressed")})`} key="suppressed" />
				</Tabs>

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
						showTotal: (total) => `共 ${total} 条`,
					}}
				/>
			</Card>
		</div>
	);
};

export default AlertsManagement;
