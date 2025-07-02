import { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Table, Progress, Tag } from "antd";
import {
	ArrowUpOutlined,
	EyeOutlined,
	WarningOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import { mockDashboardData } from "./mock";
import type { DashboardData, AlertItem, AppStatusItem } from "./mock";
import {
	ALERT_LEVEL_MAP,
	ALERT_STATUS_MAP,
	APP_STATUS_MAP,
	HEALTH_LEVEL,
	HEALTH_COLOR_MAP,
} from "./const";

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<DashboardData>({
		totalApps: 0,
		activeAlerts: 0,
		todayEvents: 0,
		systemHealth: 0,
		recentAlerts: [],
		appStatus: [],
	});

	useEffect(() => {
		// 模拟数据加载
		setTimeout(() => {
			setData(mockDashboardData);
			setLoading(false);
		}, 1000);
	}, []);

	const alertColumns = [
		{
			title: "应用",
			dataIndex: "app",
			key: "app",
		},
		{
			title: "告警类型",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "级别",
			dataIndex: "level",
			key: "level",
			render: (level: keyof typeof ALERT_LEVEL_MAP) => {
				const config = ALERT_LEVEL_MAP[level];
				return <Tag color={config.color}>{config.text}</Tag>;
			},
		},
		{
			title: "时间",
			dataIndex: "time",
			key: "time",
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: keyof typeof ALERT_STATUS_MAP) => {
				const config = ALERT_STATUS_MAP[status];
				return <Tag color={config.color}>{config.text}</Tag>;
			},
		},
	];

	const appColumns = [
		{
			title: "应用名称",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: keyof typeof APP_STATUS_MAP) => {
				const config = APP_STATUS_MAP[status];
				let IconComponent;

				switch (config.icon) {
					case "CheckCircleOutlined":
						IconComponent = CheckCircleOutlined;
						break;
					case "WarningOutlined":
						IconComponent = WarningOutlined;
						break;
					case "CloseCircleOutlined":
						IconComponent = CloseCircleOutlined;
						break;
					default:
						IconComponent = CheckCircleOutlined;
				}

				return (
					<Tag color={config.color} icon={<IconComponent />}>
						{config.text}
					</Tag>
				);
			},
		},
		{
			title: "健康度",
			dataIndex: "health",
			key: "health",
			render: (health: number) => {
				let strokeColor;
				if (health >= HEALTH_LEVEL.GOOD) {
					strokeColor = HEALTH_COLOR_MAP.GOOD;
				} else if (health >= HEALTH_LEVEL.WARNING) {
					strokeColor = HEALTH_COLOR_MAP.WARNING;
				} else {
					strokeColor = HEALTH_COLOR_MAP.ERROR;
				}

				return <Progress percent={health} size="small" strokeColor={strokeColor} />;
			},
		},
		{
			title: "告警数",
			dataIndex: "alerts",
			key: "alerts",
			render: (alerts: number) => (
				<span className={alerts > 0 ? "text-red-500 font-medium" : "text-green-500"}>
					{alerts}
				</span>
			),
		},
		{
			title: "最后检查",
			dataIndex: "lastCheck",
			key: "lastCheck",
		},
	];

	return (
		<div className="p-6 bg-gray-50 min-h-full">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">监控大盘</h1>
				<p className="text-gray-600">实时监控系统运行状态和告警信息</p>
			</div>

			{/* 统计卡片 */}
			<Row gutter={[16, 16]} className="mb-6">
				<Col xs={24} sm={12} lg={6}>
					<Card loading={loading}>
						<Statistic
							title="应用总数"
							value={data.totalApps}
							prefix={<EyeOutlined />}
							valueStyle={{ color: "#1890ff" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={loading}>
						<Statistic
							title="活跃告警"
							value={data.activeAlerts}
							prefix={<WarningOutlined />}
							valueStyle={{ color: "#ff4d4f" }}
							suffix={
								<ArrowUpOutlined style={{ fontSize: "12px", color: "#ff4d4f" }} />
							}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={loading}>
						<Statistic
							title="今日事件"
							value={data.todayEvents}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: "#52c41a" }}
							suffix={
								<ArrowUpOutlined style={{ fontSize: "12px", color: "#52c41a" }} />
							}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={loading}>
						<Statistic
							title="系统健康度"
							value={data.systemHealth}
							precision={1}
							suffix="%"
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: "#52c41a" }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				{/* 最近告警 */}
				<Col xs={24} lg={14}>
					<Card title="最近告警" className="h-full">
						<Table
							columns={alertColumns}
							dataSource={data.recentAlerts}
							loading={loading}
							pagination={false}
							size="small"
						/>
					</Card>
				</Col>

				{/* 应用状态 */}
				<Col xs={24} lg={10}>
					<Card title="应用状态" className="h-full">
						<Table
							columns={appColumns}
							dataSource={data.appStatus}
							loading={loading}
							pagination={false}
							size="small"
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
