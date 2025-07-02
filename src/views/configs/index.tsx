import React, { useState } from "react";
import { Table, Button, Input, Select, Space, Tag, Modal, Card, message } from "antd";
import { PlusOutlined, EditOutlined, HistoryOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ConfigItem } from "./mock";
import { mockConfigs } from "./mock";
import { CONFIG_STATUS_MAP, CONFIG_STATUS_OPTIONS, APP_OPTIONS } from "./const";
import { DEFAULT_PAGINATION } from "@/const/common";

const { Search } = Input;
const { Option } = Select;

const ConfigsPage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const appKeyFromQuery = searchParams.get("appKey");

	const [configs, setConfigs] = useState<ConfigItem[]>(mockConfigs);
	const [loading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filterApp, setFilterApp] = useState<string>(appKeyFromQuery || "");
	const [filterStatus, setFilterStatus] = useState<string>("");

	const columns = [
		{
			title: "应用名称",
			dataIndex: "appName",
			key: "appName",
		},
		{
			title: "AppKey",
			dataIndex: "appKey",
			key: "appKey",
			render: (text: string) => <code>{text}</code>,
		},
		{
			title: "配置版本",
			dataIndex: "version",
			key: "version",
			render: (text: string) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: "启用状态",
			dataIndex: "status",
			key: "status",
			render: (status: keyof typeof CONFIG_STATUS_MAP) => (
				<Tag color={CONFIG_STATUS_MAP[status].color}>{CONFIG_STATUS_MAP[status].text}</Tag>
			),
		},
		{
			title: "更新时间",
			dataIndex: "updateTime",
			key: "updateTime",
			width: 180,
		},
		{
			title: "更新人",
			dataIndex: "updateUser",
			key: "updateUser",
		},
		{
			title: "操作",
			key: "action",
			width: 200,
			render: (record: ConfigItem) => (
				<Space size="small">
					<Button
						size="small"
						icon={<EyeOutlined />}
						onClick={() => navigate(`/configs/${record.id}`)}
					>
						详情
					</Button>
					<Button
						size="small"
						icon={<EditOutlined />}
						onClick={() => navigate(`/configs/${record.id}?mode=edit`)}
					>
						编辑
					</Button>
					<Button
						size="small"
						icon={<HistoryOutlined />}
						onClick={() => navigate("/configs/history")}
					>
						历史
					</Button>
				</Space>
			),
		},
	];

	const handleCreateConfig = () => {
		navigate("/configs/new");
	};

	const handleRollback = (config: ConfigItem) => {
		Modal.confirm({
			title: "回滚配置",
			content: `确定要回滚到版本 ${config.version} 吗？`,
			onOk: () => {
				// 模拟回滚操作
				setConfigs(
					configs.map((item) => {
						if (item.appKey === config.appKey) {
							return {
								...item,
								status: item.id === config.id ? "active" : "inactive",
							};
						}
						return item;
					})
				);
				message.success("回滚成功");
			},
		});
	};

	const handleBatchOperation = () => {
		message.info("批量操作功能开发中");
	};

	const filteredConfigs = configs.filter((config) => {
		const matchSearch =
			config.appName.includes(searchText) ||
			config.appKey.includes(searchText) ||
			config.version.includes(searchText);
		const matchApp = !filterApp || config.appKey === filterApp;
		const matchStatus = !filterStatus || config.status === filterStatus;
		return matchSearch && matchApp && matchStatus;
	});

	return (
		<Card>
			<div style={{ marginBottom: 16 }}>
				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder="搜索应用名称、AppKey、版本"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="选择应用"
						allowClear
						style={{ width: 200 }}
						onChange={setFilterApp}
						value={filterApp}
					>
						{APP_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					<Select
						placeholder="选择状态"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterStatus}
					>
						{CONFIG_STATUS_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
				</Space>
				<div>
					<Space>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleCreateConfig}>
							新建配置
						</Button>
						<Button
							icon={<HistoryOutlined />}
							onClick={() => navigate("/configs/history")}
						>
							配置历史
						</Button>
						<Button onClick={handleBatchOperation}>批量操作</Button>
					</Space>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={filteredConfigs}
				rowKey="id"
				loading={loading}
				pagination={{
					...DEFAULT_PAGINATION,
					total: filteredConfigs.length,
				}}
			/>
		</Card>
	);
};

export default ConfigsPage;
