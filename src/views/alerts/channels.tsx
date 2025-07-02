import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Switch, message, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExperimentOutlined } from "@ant-design/icons";
import type { AlertChannel } from "./mock";
import { mockAlertChannels } from "./mock";
import {
	CHANNEL_TYPE_MAP,
	CHANNEL_TYPE_OPTIONS,
	TEST_RESULT_MAP,
	CHANNEL_FORM_RULES,
} from "./const";
import { DEFAULT_PAGINATION } from "@/const/common";

const { Option } = Select;
const { TextArea } = Input;

const AlertChannels: React.FC = () => {
	const [channels, setChannels] = useState<AlertChannel[]>([]);
	const [loading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingChannel, setEditingChannel] = useState<AlertChannel | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		setChannels(mockAlertChannels);
	}, []);

	const handleAdd = () => {
		setEditingChannel(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (channel: AlertChannel) => {
		setEditingChannel(channel);
		form.setFieldsValue(channel);
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: "确认删除",
			content: "确定要删除这个告警渠道吗？",
			onOk: () => {
				setChannels(channels.filter((c) => c.id !== id));
				message.success("删除成功");
			},
		});
	};

	const handleTest = (channel: AlertChannel) => {
		message.info(`正在测试 ${channel.name} ...`);
		setTimeout(() => {
			const success = Math.random() > 0.3;
			if (success) {
				message.success("测试通知发送成功");
				// 更新测试结果
				setChannels(
					channels.map((c) =>
						c.id === channel.id
							? {
									...c,
									lastTestTime: new Date().toLocaleString(),
									testResult: "success" as const,
								}
							: c
					)
				);
			} else {
				message.error("测试通知发送失败");
				setChannels(
					channels.map((c) =>
						c.id === channel.id
							? {
									...c,
									lastTestTime: new Date().toLocaleString(),
									testResult: "failed" as const,
								}
							: c
					)
				);
			}
		}, 2000);
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (editingChannel) {
				// 编辑
				setChannels(
					channels.map((c) =>
						c.id === editingChannel.id ? { ...editingChannel, ...values } : c
					)
				);
				message.success("更新成功");
			} else {
				// 新增
				const newChannel: AlertChannel = {
					id: Date.now().toString(),
					createTime: new Date().toLocaleString(),
					status: "active",
					...values,
				};
				setChannels([...channels, newChannel]);
				message.success("创建成功");
			}
			setIsModalVisible(false);
		});
	};

	const toggleStatus = (id: string) => {
		setChannels(
			channels.map((c) =>
				c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
			)
		);
		message.success("状态更新成功");
	};

	const columns = [
		{
			title: "渠道名称",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			render: (type: keyof typeof CHANNEL_TYPE_MAP) => (
				<Tag color={CHANNEL_TYPE_MAP[type].color}>{CHANNEL_TYPE_MAP[type].label}</Tag>
			),
		},
		{
			title: "目标",
			dataIndex: "target",
			key: "target",
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string, record: AlertChannel) => (
				<Switch
					checked={status === "active"}
					onChange={() => toggleStatus(record.id)}
					checkedChildren="启用"
					unCheckedChildren="禁用"
				/>
			),
		},
		{
			title: "最后测试",
			key: "lastTest",
			render: (_: any, record: AlertChannel) => (
				<div>
					{record.lastTestTime ? (
						<div>
							<div>{record.lastTestTime}</div>
							<Tag
								color={
									TEST_RESULT_MAP[
										record.testResult as keyof typeof TEST_RESULT_MAP
									].color
								}
							>
								{
									TEST_RESULT_MAP[
										record.testResult as keyof typeof TEST_RESULT_MAP
									].text
								}
							</Tag>
						</div>
					) : (
						<span className="text-gray-400">未测试</span>
					)}
				</div>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			key: "createTime",
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: AlertChannel) => (
				<Space size="small">
					<Button
						size="small"
						icon={<ExperimentOutlined />}
						onClick={() => handleTest(record)}
						disabled={record.status === "inactive"}
					>
						测试
					</Button>
					<Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						编辑
					</Button>
					<Button
						size="small"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDelete(record.id)}
					>
						删除
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className="space-y-4">
			<Card>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium">告警渠道管理</h2>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
						新建渠道
					</Button>
				</div>

				<Table
					columns={columns}
					dataSource={channels}
					rowKey="id"
					loading={loading}
					pagination={DEFAULT_PAGINATION}
				/>
			</Card>

			<Modal
				title={editingChannel ? "编辑告警渠道" : "新建告警渠道"}
				open={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="渠道名称" rules={CHANNEL_FORM_RULES.name}>
						<Input placeholder="输入渠道名称" />
					</Form.Item>

					<Form.Item name="type" label="渠道类型" rules={CHANNEL_FORM_RULES.type}>
						<Select placeholder="选择渠道类型">
							{CHANNEL_TYPE_OPTIONS.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item name="target" label="目标地址" rules={CHANNEL_FORM_RULES.target}>
						<TextArea rows={3} placeholder="邮件地址、手机号、Webhook URL等" />
					</Form.Item>

					<Form.Item name="description" label="描述">
						<TextArea rows={2} placeholder="输入渠道描述" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AlertChannels;
