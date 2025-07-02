import React, { useState } from "react";
import {
	Table,
	Button,
	Input,
	Select,
	Space,
	Card,
	Tag,
	DatePicker,
	Descriptions,
	Modal,
} from "antd";
import { ExportOutlined, EyeOutlined } from "@ant-design/icons";
import type { OperationLog } from "./mock";
import { mockLogs } from "./mock";
import {
	OPERATION_TYPE_MAP,
	OPERATION_TYPE_OPTIONS,
	OPERATION_RESULT_MAP,
	OPERATION_RESULT_OPTIONS,
} from "./const";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const LogsPage: React.FC = () => {
	const [logs, setLogs] = useState<OperationLog[]>(mockLogs);
	const [loading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filterType, setFilterType] = useState<string>("");
	const [filterResult, setFilterResult] = useState<string>("");
	const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
	const [isDetailVisible, setIsDetailVisible] = useState(false);

	const columns = [
		{
			title: "操作时间",
			dataIndex: "operationTime",
			key: "operationTime",
			width: 180,
			sorter: (a: OperationLog, b: OperationLog) =>
				new Date(a.operationTime).getTime() - new Date(b.operationTime).getTime(),
		},
		{
			title: "操作人",
			key: "operator",
			render: (record: OperationLog) => (
				<div>
					<div style={{ fontWeight: 500 }}>{record.operatorName}</div>
					<div style={{ fontSize: "12px", color: "#666" }}>{record.operatorId}</div>
				</div>
			),
		},
		{
			title: "操作类型",
			dataIndex: "operationType",
			key: "operationType",
			render: (type: keyof typeof OPERATION_TYPE_MAP) => (
				<Tag color={OPERATION_TYPE_MAP[type].color}>{OPERATION_TYPE_MAP[type].text}</Tag>
			),
		},
		{
			title: "操作对象",
			key: "target",
			render: (record: OperationLog) => (
				<div>
					<div>{record.targetName}</div>
					<div style={{ fontSize: "12px", color: "#666" }}>
						{record.targetType} | {record.targetId}
					</div>
				</div>
			),
		},
		{
			title: "操作结果",
			dataIndex: "result",
			key: "result",
			render: (result: keyof typeof OPERATION_RESULT_MAP) => (
				<Tag color={OPERATION_RESULT_MAP[result].color}>
					{OPERATION_RESULT_MAP[result].text}
				</Tag>
			),
		},
		{
			title: "IP地址",
			dataIndex: "ipAddress",
			key: "ipAddress",
			width: 140,
		},
		{
			title: "操作详情",
			dataIndex: "operationDetail",
			key: "operationDetail",
			ellipsis: true,
		},
		{
			title: "操作",
			key: "action",
			width: 100,
			render: (record: OperationLog) => (
				<Button
					size="small"
					icon={<EyeOutlined />}
					onClick={() => handleViewDetail(record)}
				>
					详情
				</Button>
			),
		},
	];

	const handleViewDetail = (log: OperationLog) => {
		setSelectedLog(log);
		setIsDetailVisible(true);
	};

	const handleExport = () => {
		console.log("导出操作日志");
	};

	const filteredLogs = logs.filter((log) => {
		const matchSearch =
			log.operatorName.includes(searchText) ||
			log.targetName.includes(searchText) ||
			log.operationDetail.includes(searchText);
		const matchType = !filterType || log.operationType === filterType;
		const matchResult = !filterResult || log.result === filterResult;
		return matchSearch && matchType && matchResult;
	});

	// 获取操作类型选项
	const operationTypes = Array.from(new Set(logs.map((log) => log.operationType)));

	return (
		<Card>
			<div style={{ marginBottom: 16 }}>
				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder="搜索操作人、对象、详情"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="操作类型"
						style={{ width: 150 }}
						value={filterType}
						onChange={setFilterType}
						allowClear
					>
						{OPERATION_TYPE_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>

					<Select
						placeholder="操作结果"
						style={{ width: 100 }}
						value={filterResult}
						onChange={setFilterResult}
						allowClear
					>
						{OPERATION_RESULT_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					<RangePicker placeholder={["开始时间", "结束时间"]} />
				</Space>
				<div>
					<Button icon={<ExportOutlined />} onClick={handleExport}>
						导出日志
					</Button>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={filteredLogs}
				rowKey="id"
				loading={loading}
				pagination={{
					total: filteredLogs.length,
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 条记录`,
				}}
			/>

			<Modal
				title="操作日志详情"
				open={isDetailVisible}
				onCancel={() => setIsDetailVisible(false)}
				footer={[
					<Button key="close" onClick={() => setIsDetailVisible(false)}>
						关闭
					</Button>,
				]}
				width={800}
			>
				{selectedLog && (
					<Descriptions column={2} bordered>
						<Descriptions.Item label="操作时间" span={2}>
							{selectedLog.operationTime}
						</Descriptions.Item>
						<Descriptions.Item label="操作人">
							{selectedLog.operatorName}
						</Descriptions.Item>
						<Descriptions.Item label="用户ID">
							{selectedLog.operatorId}
						</Descriptions.Item>
						<Descriptions.Item label="操作类型">
							<Tag
								color={
									OPERATION_TYPE_MAP[
										selectedLog.operationType as keyof typeof OPERATION_TYPE_MAP
									]?.color || "default"
								}
							>
								{selectedLog.operationType}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="操作结果">
							<Tag color={selectedLog.result === "success" ? "green" : "red"}>
								{selectedLog.result === "success" ? "成功" : "失败"}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="对象类型">
							{selectedLog.targetType}
						</Descriptions.Item>
						<Descriptions.Item label="对象名称">
							{selectedLog.targetName}
						</Descriptions.Item>
						<Descriptions.Item label="对象ID" span={2}>
							<code>{selectedLog.targetId}</code>
						</Descriptions.Item>
						<Descriptions.Item label="IP地址">
							{selectedLog.ipAddress}
						</Descriptions.Item>
						<Descriptions.Item label="User Agent" span={2}>
							{selectedLog.userAgent}
						</Descriptions.Item>
						<Descriptions.Item label="操作详情" span={2}>
							{selectedLog.operationDetail}
						</Descriptions.Item>
						{selectedLog.errorMsg && (
							<Descriptions.Item label="错误信息" span={2}>
								<span style={{ color: "#ff4d4f" }}>{selectedLog.errorMsg}</span>
							</Descriptions.Item>
						)}
					</Descriptions>
				)}
			</Modal>
		</Card>
	);
};

export default LogsPage;
