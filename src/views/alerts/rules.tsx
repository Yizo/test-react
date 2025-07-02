import React, { useState, useEffect } from "react";
import {
	Table,
	Button,
	Input,
	Select,
	Space,
	Tag,
	Card,
	Modal,
	Form,
	message,
	Switch,
	InputNumber,
	Popconfirm,
} from "antd";
import { ExportOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { AlertRule } from "./mock";
import { mockAlertRules } from "./mock";
import {
	ALERT_RULE_TYPE_MAP,
	ALERT_RULE_TYPE_OPTIONS,
	ALERT_RULE_STATUS_OPTIONS,
	ALERT_RULE_FORM_RULES,
	NOTIFICATION_METHOD_OPTIONS,
} from "./const";

const { Search } = Input;
const { Option } = Select;

const AlertRulesPage: React.FC = () => {
	const [rules, setRules] = useState<AlertRule[]>([]);
	const [loading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filterType, setFilterType] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		setRules(mockAlertRules);
	}, []);

	const handleAdd = () => {
		setEditingRule(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (rule: AlertRule) => {
		setEditingRule(rule);
		form.setFieldsValue({
			...rule,
			status: rule.status === "active",
		});
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		setRules(rules.filter((rule) => rule.id !== id));
		message.success("删除成功");
	};

	const toggleStatus = (id: string) => {
		setRules(
			rules.map((rule) =>
				rule.id === id
					? { ...rule, status: rule.status === "active" ? "inactive" : "active" }
					: rule
			)
		);
		message.success("状态更新成功");
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			const newRule: AlertRule = {
				id: editingRule?.id || Date.now().toString(),
				name: values.name,
				type: values.type,
				thresholdValue: values.thresholdValue,
				threshold: `${getThresholdLabel(values.type)} > ${values.thresholdValue}${getThresholdUnit(values.type)}`,
				status: values.status ? "active" : "inactive",
				appName: values.appName,
				appKey: values.appKey,
				notificationMethods: values.notificationMethods || [],
				createTime: editingRule?.createTime || new Date().toLocaleString(),
				triggerCount: editingRule?.triggerCount || 0,
			};

			if (editingRule) {
				setRules(rules.map((rule) => (rule.id === editingRule.id ? newRule : rule)));
				message.success("更新成功");
			} else {
				setRules([...rules, newRule]);
				message.success("添加成功");
			}
			setIsModalVisible(false);
		} catch (error) {
			console.error("表单验证失败:", error);
		}
	};

	const getThresholdLabel = (type: string) => {
		switch (type) {
			case "error":
				return "错误率";
			case "performance":
				return "页面加载时间";
			case "network":
				return "API响应时间";
			default:
				return "阈值";
		}
	};

	const getThresholdUnit = (type: string) => {
		switch (type) {
			case "error":
				return "%";
			case "performance":
			case "network":
				return "s";
			default:
				return "";
		}
	};

	const handleExport = () => {
		const dataStr = JSON.stringify(rules, null, 2);
		const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
		const exportFileDefaultName = "alert-rules.json";
		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
		message.success("导出成功");
	};

	const columns = [
		{
			title: "规则名称",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			render: (type: keyof typeof ALERT_RULE_TYPE_MAP) => (
				<Tag color={ALERT_RULE_TYPE_MAP[type].color}>{ALERT_RULE_TYPE_MAP[type].text}</Tag>
			),
		},
		{
			title: "阈值条件",
			dataIndex: "threshold",
			key: "threshold",
		},
		{
			title: "关联应用",
			key: "app",
			render: (record: AlertRule) => (
				<div>
					<div style={{ fontWeight: 500 }}>{record.appName}</div>
					<div style={{ fontSize: "12px", color: "#666" }}>{record.appKey}</div>
				</div>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string, record: AlertRule) => (
				<Switch
					checked={status === "active"}
					onChange={() => toggleStatus(record.id)}
					checkedChildren="启用"
					unCheckedChildren="禁用"
				/>
			),
		},
		{
			title: "触发次数",
			dataIndex: "triggerCount",
			key: "triggerCount",
			render: (count: number) => <Tag color={count > 0 ? "orange" : "default"}>{count}</Tag>,
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime",
			width: 180,
		},
		{
			title: "操作",
			key: "action",
			width: 200,
			render: (_: any, record: AlertRule) => (
				<Space size="small">
					<Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						编辑
					</Button>
					<Popconfirm
						title="确定删除这个告警规则吗？"
						onConfirm={() => handleDelete(record.id)}
						okText="确定"
						cancelText="取消"
					>
						<Button size="small" danger icon={<DeleteOutlined />}>
							删除
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const filteredRules = rules.filter((rule) => {
		const matchSearch =
			rule.name.includes(searchText) ||
			rule.appName.includes(searchText) ||
			rule.appKey.includes(searchText);
		const matchType = !filterType || rule.type === filterType;
		const matchStatus = !filterStatus || rule.status === filterStatus;
		return matchSearch && matchType && matchStatus;
	});

	return (
		<Card>
			<div style={{ marginBottom: 16 }}>
				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder="搜索规则名称、应用名称"
						allowClear
						style={{ width: 300 }}
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="选择类型"
						allowClear
						style={{ width: 120 }}
						onChange={setFilterType}
					>
						{ALERT_RULE_TYPE_OPTIONS.map((option) => (
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
						{ALERT_RULE_STATUS_OPTIONS.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
				</Space>
				<div>
					<Space>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
							新建告警规则
						</Button>
						<Button icon={<ExportOutlined />} onClick={handleExport}>
							导出规则
						</Button>
					</Space>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={filteredRules}
				rowKey="id"
				loading={loading}
				pagination={{
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 条记录`,
				}}
			/>

			<Modal
				title={editingRule ? "编辑告警规则" : "新建告警规则"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="规则名称" rules={ALERT_RULE_FORM_RULES.name}>
						<Input placeholder="输入告警规则名称" />
					</Form.Item>

					<Form.Item name="type" label="监控类型" rules={ALERT_RULE_FORM_RULES.type}>
						<Select placeholder="选择监控类型">
							{ALERT_RULE_TYPE_OPTIONS.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="thresholdValue"
						label="阈值"
						rules={ALERT_RULE_FORM_RULES.thresholdValue}
					>
						<InputNumber
							style={{ width: "100%" }}
							placeholder="输入阈值数值"
							min={0}
							step={0.1}
						/>
					</Form.Item>

					<Form.Item
						name="appName"
						label="关联应用"
						rules={ALERT_RULE_FORM_RULES.appName}
					>
						<Input placeholder="输入应用名称" />
					</Form.Item>

					<Form.Item name="appKey" label="AppKey" rules={ALERT_RULE_FORM_RULES.appKey}>
						<Input placeholder="输入应用的AppKey" />
					</Form.Item>

					<Form.Item name="notificationMethods" label="通知方式">
						<Select mode="multiple" placeholder="选择通知方式">
							{NOTIFICATION_METHOD_OPTIONS.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item name="status" valuePropName="checked">
						<Switch checkedChildren="启用" unCheckedChildren="禁用" />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default AlertRulesPage;
