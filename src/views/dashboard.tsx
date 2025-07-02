import React from "react";
import { Card, Row, Col, Statistic, Progress, Timeline } from "antd";
import { UserOutlined, TeamOutlined, MenuOutlined, SecurityScanOutlined } from "@ant-design/icons";

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
							value={112}
							prefix={<UserOutlined />}
							valueStyle={{ color: "#3f8600" }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="角色总数"
							value={8}
							prefix={<TeamOutlined />}
							valueStyle={{ color: "#cf1322" }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="菜单总数"
							value={26}
							prefix={<MenuOutlined />}
							valueStyle={{ color: "#1890ff" }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title="权限总数"
							value={45}
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
							<Progress percent={30} status="active" />
						</div>
						<div style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 8 }}>内存使用率</div>
							<Progress percent={70} status="active" />
						</div>
						<div style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 8 }}>磁盘使用率</div>
							<Progress percent={45} status="active" />
						</div>
					</Card>
				</Col>

				{/* 最近活动 */}
				<Col span={12}>
					<Card title="最近活动" bordered={false}>
						<Timeline
							items={[
								{
									children: "用户 admin 登录系统",
								},
								{
									children: '新增用户 "张三"',
								},
								{
									children: '修改角色 "管理员" 权限',
								},
								{
									children: '删除菜单 "测试菜单"',
								},
								{
									children: "系统启动",
								},
							]}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
