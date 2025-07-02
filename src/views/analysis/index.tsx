import React, { useState, useEffect } from "react";
import {
	Card,
	Row,
	Col,
	Select,
	DatePicker,
	Button,
	Table,
	Tabs,
	Statistic,
	Space,
	Divider,
	Spin,
	message,
	Typography,
	Tag,
	Radio,
	Checkbox,
} from "antd";
import { DownloadOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { AnalysisData } from "./mock";
import {
	ANALYSIS_APP_OPTIONS,
	ANALYSIS_REGION_OPTIONS,
	ANALYSIS_DEVICE_OPTIONS,
	ANALYSIS_BROWSER_OPTIONS,
	ANALYSIS_DIMENSION_OPTIONS,
} from "./mock";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Analysis: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<AnalysisData[]>([]);
	const [filters, setFilters] = useState({
		apps: [] as string[],
		dateRange: [dayjs().subtract(7, "day"), dayjs()] as [dayjs.Dayjs, dayjs.Dayjs],
		dimensions: ["pv", "uv"] as string[],
		regions: [] as string[],
		devices: [] as string[],
		browsers: [] as string[],
	});
	const [activeTab, setActiveTab] = useState("trend");
	const [compareMode, setCompareMode] = useState(false);

	const generateMockData = () => {
		const data: AnalysisData[] = [];
		const apps =
			filters.apps.length > 0
				? filters.apps
				: [ANALYSIS_APP_OPTIONS[0].value, ANALYSIS_APP_OPTIONS[1].value];
		const regions = ANALYSIS_REGION_OPTIONS.map((r) => r.value);
		const devices = ANALYSIS_DEVICE_OPTIONS.map((d) => d.value);
		const browsers = ANALYSIS_BROWSER_OPTIONS.map((b) => b.value);

		for (let i = 0; i < 7; i++) {
			const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
			apps.forEach((app) => {
				regions.forEach((region) => {
					devices.forEach((device) => {
						browsers.forEach((browser) => {
							filters.dimensions.forEach((dimension) => {
								data.push({
									id: `${app}-${region}-${device}-${browser}-${dimension}-${date}`,
									app,
									dimension,
									value: Math.floor(Math.random() * 10000) + 1000,
									timestamp: date,
									region,
									device,
									browser,
								});
							});
						});
					});
				});
			});
		}
		return data;
	};

	const loadData = async () => {
		setLoading(true);
		try {
			// 模拟API请求
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockData = generateMockData();
			setData(mockData);
		} catch (error) {
			message.error("数据加载失败");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [filters]);

	const handleFilterChange = (key: string, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleExport = () => {
		message.success("数据导出成功");
	};

	const columns = [
		{
			title: "应用",
			dataIndex: "app",
			key: "app",
			render: (app: string) => {
				const appInfo = ANALYSIS_APP_OPTIONS.find((a) => a.value === app);
				return <Tag color="blue">{appInfo?.label || app}</Tag>;
			},
		},
		{
			title: "维度",
			dataIndex: "dimension",
			key: "dimension",
			render: (dimension: string) => {
				const dimInfo = ANALYSIS_DIMENSION_OPTIONS.find((d) => d.value === dimension);
				return dimInfo?.label || dimension;
			},
		},
		{
			title: "数值",
			dataIndex: "value",
			key: "value",
			render: (value: number) => value.toLocaleString(),
			sorter: (a: AnalysisData, b: AnalysisData) => a.value - b.value,
		},
		{
			title: "地区",
			dataIndex: "region",
			key: "region",
			render: (region: string) => {
				const regionInfo = ANALYSIS_REGION_OPTIONS.find((r) => r.value === region);
				return regionInfo?.label || region;
			},
		},
		{
			title: "设备",
			dataIndex: "device",
			key: "device",
			render: (device: string) => {
				const deviceInfo = ANALYSIS_DEVICE_OPTIONS.find((d) => d.value === device);
				return deviceInfo?.label || device;
			},
		},
		{
			title: "浏览器",
			dataIndex: "browser",
			key: "browser",
			render: (browser: string) => {
				const browserInfo = ANALYSIS_BROWSER_OPTIONS.find((b) => b.value === browser);
				return browserInfo?.label || browser;
			},
		},
		{
			title: "时间",
			dataIndex: "timestamp",
			key: "timestamp",
			sorter: (a: AnalysisData, b: AnalysisData) => a.timestamp.localeCompare(b.timestamp),
		},
	];

	const getStatistics = () => {
		const totalPV = data
			.filter((item) => item.dimension === "pv")
			.reduce((sum, item) => sum + item.value, 0);
		const totalUV = data
			.filter((item) => item.dimension === "uv")
			.reduce((sum, item) => sum + item.value, 0);
		const avgErrorRate =
			data
				.filter((item) => item.dimension === "error_rate")
				.reduce((sum, item) => sum + item.value, 0) /
				data.filter((item) => item.dimension === "error_rate").length || 0;
		const avgLoadTime =
			data
				.filter((item) => item.dimension === "load_time")
				.reduce((sum, item) => sum + item.value, 0) /
				data.filter((item) => item.dimension === "load_time").length || 0;

		return { totalPV, totalUV, avgErrorRate, avgLoadTime };
	};

	const stats = getStatistics();

	return (
		<div style={{ padding: "24px" }}>
			<Title level={2}>多维分析</Title>
			<Text type="secondary">通过多维度数据分析，深入了解应用性能和用户行为</Text>

			<Card style={{ marginTop: "16px", marginBottom: "24px" }}>
				<Row gutter={[16, 16]} align="middle">
					<Col span={6}>
						<Space direction="vertical" size="small" style={{ width: "100%" }}>
							<Text strong>应用选择</Text>
							<Select
								mode="multiple"
								placeholder="选择应用"
								style={{ width: "100%" }}
								value={filters.apps}
								onChange={(value) => handleFilterChange("apps", value)}
								allowClear
							>
								{ANALYSIS_APP_OPTIONS.map((app) => (
									<Option key={app.value} value={app.value}>
										{app.label}
									</Option>
								))}
							</Select>
						</Space>
					</Col>
					<Col span={6}>
						<Space direction="vertical" size="small" style={{ width: "100%" }}>
							<Text strong>时间范围</Text>
							<RangePicker
								value={filters.dateRange}
								onChange={(dates) =>
									dates && handleFilterChange("dateRange", dates)
								}
								style={{ width: "100%" }}
							/>
						</Space>
					</Col>
					<Col span={6}>
						<Space direction="vertical" size="small" style={{ width: "100%" }}>
							<Text strong>分析维度</Text>
							<Select
								mode="multiple"
								placeholder="选择维度"
								style={{ width: "100%" }}
								value={filters.dimensions}
								onChange={(value) => handleFilterChange("dimensions", value)}
							>
								{ANALYSIS_DIMENSION_OPTIONS.map((dim) => (
									<Option key={dim.value} value={dim.value}>
										{dim.label}
									</Option>
								))}
							</Select>
						</Space>
					</Col>
					<Col span={6}>
						<Space>
							<Button type="primary" icon={<FilterOutlined />} onClick={loadData}>
								查询
							</Button>
							<Button icon={<ReloadOutlined />} onClick={loadData}>
								刷新
							</Button>
							<Button icon={<DownloadOutlined />} onClick={handleExport}>
								导出
							</Button>
						</Space>
					</Col>
				</Row>

				<Divider />

				<Row gutter={[16, 16]}>
					<Col span={6}>
						<Space direction="vertical" size="small" style={{ width: "100%" }}>
							<Text strong>地区筛选</Text>
							<Checkbox.Group
								options={ANALYSIS_REGION_OPTIONS}
								value={filters.regions}
								onChange={(value) => handleFilterChange("regions", value)}
							/>
						</Space>
					</Col>
					<Col span={6}>
						<Space direction="vertical" size="small" style={{ width: "100%" }}>
							<Text strong>设备类型</Text>
							<Checkbox.Group
								options={ANALYSIS_DEVICE_OPTIONS}
								value={filters.devices}
								onChange={(value) => handleFilterChange("devices", value)}
							/>
						</Space>
					</Col>
					<Col span={6}>
						<Space direction="vertical" size="small" style={{ width: "100%" }}>
							<Text strong>浏览器</Text>
							<Checkbox.Group
								options={ANALYSIS_BROWSER_OPTIONS}
								value={filters.browsers}
								onChange={(value) => handleFilterChange("browsers", value)}
							/>
						</Space>
					</Col>
					<Col span={6}>
						<Space direction="vertical" size="small">
							<Text strong>对比模式</Text>
							<Radio.Group
								value={compareMode}
								onChange={(e) => setCompareMode(e.target.value)}
							>
								<Radio value={false}>普通</Radio>
								<Radio value={true}>同比</Radio>
							</Radio.Group>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* 统计卡片 */}
			<Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
				<Col span={6}>
					<Card>
						<Statistic
							title="总页面访问量"
							value={stats.totalPV}
							precision={0}
							valueStyle={{ color: "#3f8600" }}
							suffix="次"
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="总独立访客"
							value={stats.totalUV}
							precision={0}
							valueStyle={{ color: "#cf1322" }}
							suffix="人"
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="平均错误率"
							value={stats.avgErrorRate}
							precision={2}
							valueStyle={{ color: "#faad14" }}
							suffix="%"
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="平均加载时间"
							value={stats.avgLoadTime}
							precision={0}
							valueStyle={{ color: "#722ed1" }}
							suffix="ms"
						/>
					</Card>
				</Col>
			</Row>

			<Spin spinning={loading}>
				<Tabs activeKey={activeTab} onChange={setActiveTab}>
					<TabPane tab="趋势图" key="trend">
						<Card>
							<div className="h-400px flex items-center justify-center border-2 border-dashed border-gray-200">
								<div className="text-center">
									<div className="text-gray-400 text-lg mb-2">📈</div>
									<div className="text-gray-500">趋势图表</div>
									<div className="text-gray-400 text-sm">图表库加载中...</div>
								</div>
							</div>
						</Card>
					</TabPane>

					<TabPane tab="柱状图" key="bar">
						<Card>
							<div className="h-400px flex items-center justify-center border-2 border-dashed border-gray-200">
								<div className="text-center">
									<div className="text-gray-400 text-lg mb-2">📊</div>
									<div className="text-gray-500">柱状图表</div>
									<div className="text-gray-400 text-sm">图表库加载中...</div>
								</div>
							</div>
						</Card>
					</TabPane>

					<TabPane tab="分布图" key="pie">
						<Row gutter={16}>
							<Col span={12}>
								<Card title="应用分布">
									<div className="h-300px flex items-center justify-center border-2 border-dashed border-gray-200">
										<div className="text-center">
											<div className="text-gray-400 text-lg mb-2">🥧</div>
											<div className="text-gray-500">应用分布图</div>
											<div className="text-gray-400 text-sm">
												图表库加载中...
											</div>
										</div>
									</div>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="地区分布">
									<div className="h-300px flex items-center justify-center border-2 border-dashed border-gray-200">
										<div className="text-center">
											<div className="text-gray-400 text-lg mb-2">🌍</div>
											<div className="text-gray-500">地区分布图</div>
											<div className="text-gray-400 text-sm">
												图表库加载中...
											</div>
										</div>
									</div>
								</Card>
							</Col>
						</Row>
					</TabPane>

					<TabPane tab="数据明细" key="detail">
						<Card>
							<Table
								columns={columns}
								dataSource={data}
								rowKey="id"
								pagination={{
									total: data.length,
									pageSize: 20,
									showSizeChanger: true,
									showQuickJumper: true,
									showTotal: (total) => `共 ${total} 条记录`,
								}}
								scroll={{ x: 1200 }}
							/>
						</Card>
					</TabPane>
				</Tabs>
			</Spin>
		</div>
	);
};

export default Analysis;
