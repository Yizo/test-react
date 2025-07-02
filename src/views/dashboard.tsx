import React from "react";
import { Card, Row, Col, Statistic, Progress, Timeline } from "antd";
import { UserOutlined, TeamOutlined, MenuOutlined, SecurityScanOutlined } from "@ant-design/icons";
import { mockDashboardStats, mockSystemStatus, mockActivities } from "./dashboard/mock";
import type { ActivityRecord } from "./dashboard/mock";

const Dashboard: React.FC = () => {
	return (
		<div>
			<h2 style={{ marginBottom: 24 }}>系统概览</h2>

			{/* 统计卡片 */}
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic
							title="用户总数"
							value={mockDashboardStats.userCount}
							prefix={<UserOutlined />}
							valueStyle={{ color: "#3f8600" }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="角色总数"
							value={mockDashboardStats.roleCount}
							prefix={<TeamOutlined />}
							valueStyle={{ color: "#cf1322" }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="菜单总数"
							value={mockDashboardStats.menuCount}
							prefix={<MenuOutlined />}
							valueStyle={{ color: "#1890ff" }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="权限总数"
							value={mockDashboardStats.permissionCount}
							prefix={<SecurityScanOutlined />}
							valueStyle={{ color: "#722ed1" }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={16}>
				{/* 系统状态 */}
				<Col span={12}>
					<Card title="系统状态" bordered={false}>
						<div style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 8 }}>CPU 使用率</div>
							<Progress percent={mockSystemStatus.cpu} status="active" />
						</div>
						<div style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 8 }}>内存使用率</div>
							<Progress percent={mockSystemStatus.memory} status="active" />
						</div>
						<div style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 8 }}>磁盘使用率</div>
							<Progress percent={mockSystemStatus.disk} status="active" />
						</div>
					</Card>
				</Col>

				{/* 最近活动 */}
				<Col span={12}>
					<Card title="最近活动" bordered={false}>
						<Timeline
							items={mockActivities.map((item: ActivityRecord) => ({
								children: item.content,
							}))}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
