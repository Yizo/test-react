import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
	Card,
	Form,
	Input,
	Select,
	Switch,
	InputNumber,
	Slider,
	Button,
	Space,
	Divider,
	Table,
	Modal,
	message,
	Tabs,
	Row,
	Col,
} from "antd";
import {
	SaveOutlined,
	SendOutlined,
	HistoryOutlined,
	ArrowLeftOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import type { MonitorConfig, CustomEvent } from "./mock";
import { mockConfig, defaultConfig } from "./mock";

const { Option } = Select;
const { TextArea } = Input;

const ConfigEditPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode"); // edit | view
	const isEditing = mode === "edit" || id === "new";

	const [form] = Form.useForm();
	const [, setConfig] = useState<MonitorConfig | null>(null);
	const [loading, setLoading] = useState(false);
	const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
	const [isEventModalVisible, setIsEventModalVisible] = useState(false);
	const [editingEvent, setEditingEvent] = useState<CustomEvent | null>(null);
	const [eventForm] = Form.useForm();

	useEffect(() => {
		if (id && id !== "new") {
			setConfig(mockConfig);
			setCustomEvents(mockConfig.customEvents);
			form.setFieldsValue(mockConfig);
		} else if (id === "new") {
			// 新建配置的默认值
			form.setFieldsValue(defaultConfig);
		}
	}, [id, form]);

	const handleSave = () => {
		form.validateFields().then((_values) => {
			setLoading(true);
			setTimeout(() => {
				message.success("保存成功");
				setLoading(false);
			}, 1000);
		});
	};

	const handlePublish = () => {
		form.validateFields().then((_values) => {
			Modal.confirm({
				title: "发布配置",
				content: "确定要发布这个配置吗？发布后将立即生效。",
				onOk: () => {
					setLoading(true);
					setTimeout(() => {
						message.success("发布成功");
						setLoading(false);
						navigate("/configs");
					}, 1000);
				},
			});
		});
	};

	const handleAddEvent = () => {
		setEditingEvent(null);
		eventForm.resetFields();
		setIsEventModalVisible(true);
	};

	const handleEditEvent = (event: CustomEvent) => {
		setEditingEvent(event);
		eventForm.setFieldsValue(event);
		setIsEventModalVisible(true);
	};

	const handleDeleteEvent = (eventId: string) => {
		setCustomEvents(customEvents.filter((event) => event.id !== eventId));
	};

	const handleEventModalOk = () => {
		eventForm.validateFields().then((values) => {
			if (editingEvent) {
				setCustomEvents(
					customEvents.map((event) =>
						event.id === editingEvent.id ? { ...event, ...values } : event
					)
				);
			} else {
				const newEvent: CustomEvent = {
					id: Date.now().toString(),
					...values,
					parameters: values.parameters || [],
				};
				setCustomEvents([...customEvents, newEvent]);
			}
			setIsEventModalVisible(false);
			message.success(editingEvent ? "编辑成功" : "添加成功");
		});
	};

	const eventColumns = [
		{
			title: "事件名称",
			dataIndex: "eventName",
			key: "eventName",
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "参数数量",
			key: "paramCount",
			render: (record: CustomEvent) => record.parameters.length,
		},
		{
			title: "操作",
			key: "action",
			render: (record: CustomEvent) => (
				<Space>
					<Button size="small" onClick={() => handleEditEvent(record)}>
						编辑
					</Button>
					<Button size="small" danger onClick={() => handleDeleteEvent(record.id)}>
						删除
					</Button>
				</Space>
			),
		},
	];

	const configPreview = {
		...form.getFieldsValue(),
		customEvents,
	};

	const tabItems = [
		{
			key: "basic",
			label: "基础配置",
			children: (
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item
							name="appKey"
							label="AppKey"
							rules={[{ required: true, message: "请选择应用" }]}
						>
							<Select placeholder="请选择应用" disabled={!isEditing}>
								<Option value="app_web_001">官网前端 (app_web_001)</Option>
								<Option value="app_mobile_002">移动端H5 (app_mobile_002)</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="version" label="版本号">
							<Input placeholder="系统自动生成" disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Divider>监控项开关</Divider>
					</Col>
					<Col span={6}>
						<Form.Item name="errorMonitor" label="错误监控" valuePropName="checked">
							<Switch disabled={!isEditing} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							name="performanceMonitor"
							label="性能监控"
							valuePropName="checked"
						>
							<Switch disabled={!isEditing} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item name="behaviorMonitor" label="行为监控" valuePropName="checked">
							<Switch disabled={!isEditing} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item name="networkMonitor" label="网络监控" valuePropName="checked">
							<Switch disabled={!isEditing} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Divider>采集配置</Divider>
					</Col>
					<Col span={12}>
						<Form.Item name="samplingRate" label="采样率 (%)">
							<Slider
								min={1}
								max={100}
								disabled={!isEditing}
								marks={{
									1: "1%",
									25: "25%",
									50: "50%",
									75: "75%",
									100: "100%",
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="collectFrequency" label="采集频率 (秒)">
							<InputNumber
								min={1}
								max={60}
								style={{ width: "100%" }}
								disabled={!isEditing}
							/>
						</Form.Item>
					</Col>
				</Row>
			),
		},
		{
			key: "events",
			label: "自定义埋点",
			children: (
				<div>
					{isEditing && (
						<div style={{ marginBottom: 16 }}>
							<Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>
								添加自定义事件
							</Button>
						</div>
					)}
					<Table
						columns={eventColumns}
						dataSource={customEvents}
						rowKey="id"
						pagination={false}
					/>
				</div>
			),
		},
		{
			key: "preview",
			label: "配置预览",
			children: (
				<div>
					<pre
						style={{
							background: "#f5f5f5",
							padding: 16,
							borderRadius: 4,
							fontSize: 12,
							overflow: "auto",
						}}
					>
						{JSON.stringify(configPreview, null, 2)}
					</pre>
				</div>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Space>
					<Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/configs")}>
						返回列表
					</Button>
					{isEditing && (
						<>
							<Button icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
								保存
							</Button>
							<Button
								type="primary"
								icon={<SendOutlined />}
								onClick={handlePublish}
								loading={loading}
							>
								发布
							</Button>
						</>
					)}
					<Button icon={<HistoryOutlined />} onClick={() => navigate("/configs/history")}>
						配置历史
					</Button>
				</Space>
			</div>

			<Card title={id === "new" ? "新建监控配置" : "监控配置详情"}>
				<Form form={form} layout="vertical">
					<Tabs items={tabItems} />
				</Form>
			</Card>

			<Modal
				title={editingEvent ? "编辑自定义事件" : "添加自定义事件"}
				open={isEventModalVisible}
				onOk={handleEventModalOk}
				onCancel={() => setIsEventModalVisible(false)}
				width={600}
			>
				<Form form={eventForm} layout="vertical">
					<Form.Item
						name="eventName"
						label="事件名称"
						rules={[{ required: true, message: "请输入事件名称" }]}
					>
						<Input placeholder="如：button_click" />
					</Form.Item>
					<Form.Item
						name="description"
						label="事件描述"
						rules={[{ required: true, message: "请输入事件描述" }]}
					>
						<TextArea rows={2} placeholder="请描述该事件的用途" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ConfigEditPage;
