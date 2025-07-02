import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, Space, Tag, Tabs, Table, Modal, message } from "antd";
import {
	EditOutlined,
	DeleteOutlined,
	SettingOutlined,
	ArrowLeftOutlined,
} from "@ant-design/icons";
import type { AppItem, MonitorConfig } from "./mock";
import { mockAppDetail, mockMonitorConfigs } from "./mock";

const AppDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [app, setApp] = useState<AppItem | null>(null);
	const [configs, setConfigs] = useState<MonitorConfig[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setApp(mockAppDetail);
		setConfigs(mockMonitorConfigs);
		setLoading(false);
	}, [id]);

	const handleEdit = () => {
		// 跳转到编辑页面或打开编辑弹窗
		message.info("跳转到编辑页面");
	};

	const handleDelete = () => {
		Modal.confirm({
			title: "删除应用",
			content: "确定要删除这个应用吗？删除后不可恢复。",
			okText: "确定",
			cancelText: "取消",
			onOk: () => {
				message.success("删除成功");
				navigate("/apps");
			},
		});
	};

	const handleConfigMonitor = () => {
		navigate(`/configs?appKey=${app?.appKey}`);
	};

	const configColumns = [
		{
			title: "版本",
			dataIndex: "version",
			key: "version",
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string) => (
				<Tag color={status === "active" ? "green" : "default"}>
					{status === "active" ? "当前版本" : "历史版本"}
				</Tag>
			),
		},
		{
			title: "更新时间",
			dataIndex: "updateTime",
			key: "updateTime",
		},
		{
			title: "更新人",
			dataIndex: "updateUser",
			key: "updateUser",
		},
		{
			title: "操作",
			key: "action",
			render: (record: MonitorConfig) => (
				<Space>
					<Button size="small" onClick={() => navigate(`/configs/${record.id}`)}>
						查看配置
					</Button>
					{record.status === "inactive" && (
						<Button size="small" type="primary">
							回滚到此版本
						</Button>
					)}
				</Space>
			),
		},
	];

	if (loading || !app) {
		return <Card loading={loading} />;
	}

	const tabItems = [
		{
			key: "basic",
			label: "基本信息",
			children: (
				<Descriptions column={2} bordered>
					<Descriptions.Item label="应用名称">{app.name}</Descriptions.Item>
					<Descriptions.Item label="AppKey">
						<code>{app.appKey}</code>
					</Descriptions.Item>
					<Descriptions.Item label="负责人">{app.owner}</Descriptions.Item>
					<Descriptions.Item label="状态">
						<Tag color={app.status === "active" ? "green" : "red"}>
							{app.status === "active" ? "启用" : "禁用"}
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item label="分组">{app.group}</Descriptions.Item>
					<Descriptions.Item label="标签">
						{app.tags.map((tag) => (
							<Tag key={tag} color="blue">
								{tag}
							</Tag>
						))}
					</Descriptions.Item>
					<Descriptions.Item label="创建时间">{app.createTime}</Descriptions.Item>
					<Descriptions.Item label="更新时间">{app.updateTime}</Descriptions.Item>
					<Descriptions.Item label="描述" span={2}>
						{app.description}
					</Descriptions.Item>
				</Descriptions>
			),
		},
		{
			key: "monitor",
			label: "监控配置",
			children: (
				<div>
					<div style={{ marginBottom: 16 }}>
						<Button
							type="primary"
							icon={<SettingOutlined />}
							onClick={handleConfigMonitor}
						>
							配置监控
						</Button>
					</div>
					<Table
						columns={configColumns}
						dataSource={configs}
						rowKey="id"
						pagination={false}
					/>
				</div>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Space>
					<Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/apps")}>
						返回列表
					</Button>
					<Button icon={<EditOutlined />} onClick={handleEdit}>
						编辑
					</Button>
					<Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
						删除
					</Button>
				</Space>
			</div>

			<Card title={`应用详情 - ${app.name}`}>
				<Tabs items={tabItems} defaultActiveKey="basic" />
			</Card>
		</div>
	);
};

export default AppDetailPage;
