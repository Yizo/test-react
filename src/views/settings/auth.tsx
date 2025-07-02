import {
	Card,
	Form,
	Select,
	Input,
	Switch,
	Button,
	Row,
	Col,
	Space,
	Divider,
	message,
	Tabs,
	Table,
	Modal,
	Tag,
} from "antd";
import {
	SaveOutlined,
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	KeyOutlined,
	SecurityScanOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface AuthProvider {
	id: string;
	name: string;
	type: string;
	status: "enabled" | "disabled";
	config: Record<string, any>;
	description: string;
}

const AuthSettings = () => {
	const [form] = Form.useForm();
	const [providerForm] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingProvider, setEditingProvider] = useState<AuthProvider | null>(null);
	const [providers, setProviders] = useState<AuthProvider[]>([
		{
			id: "1",
			name: "本地认证",
			type: "local",
			status: "enabled",
			config: {},
			description: "系统内置的用户名密码认证",
		},
		{
			id: "2",
			name: "企业微信",
			type: "wechat_work",
			status: "disabled",
			config: {
				corpId: "",
				corpSecret: "",
				agentId: "",
			},
			description: "通过企业微信进行单点登录",
		},
		{
			id: "3",
			name: "钉钉",
			type: "dingtalk",
			status: "disabled",
			config: {
				appKey: "",
				appSecret: "",
			},
			description: "通过钉钉进行单点登录",
		},
	]);

	const handleSave = async (values: any) => {
		setLoading(true);
		try {
			console.log("保存认证配置:", values);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			message.success("认证配置保存成功");
		} catch (error) {
			message.error("保存失败");
		} finally {
			setLoading(false);
		}
	};

	const handleAddProvider = () => {
		setEditingProvider(null);
		providerForm.resetFields();
		setModalVisible(true);
	};

	const handleEditProvider = (provider: AuthProvider) => {
		setEditingProvider(provider);
		providerForm.setFieldsValue(provider);
		setModalVisible(true);
	};

	const handleDeleteProvider = (id: string) => {
		Modal.confirm({
			title: "确认删除",
			content: "确定要删除这个认证提供方吗？",
			onOk: () => {
				setProviders(providers.filter((p) => p.id !== id));
				message.success("删除成功");
			},
		});
	};

	const handleModalOk = async () => {
		try {
			const values = await providerForm.validateFields();
			if (editingProvider) {
				// 编辑
				setProviders(
					providers.map((p) => (p.id === editingProvider.id ? { ...p, ...values } : p))
				);
				message.success("更新成功");
			} else {
				// 新增
				const newProvider: AuthProvider = {
					id: Date.now().toString(),
					...values,
				};
				setProviders([...providers, newProvider]);
				message.success("添加成功");
			}
			setModalVisible(false);
		} catch (error) {
			console.error("表单验证失败:", error);
		}
	};

	const providerColumns = [
		{
			title: "名称",
			dataIndex: "name",
			key: "name",
			render: (text: string, record: AuthProvider) => (
				<Space>
					{record.type === "local" && <UserOutlined />}
					{record.type === "wechat_work" && <SecurityScanOutlined />}
					{record.type === "dingtalk" && <KeyOutlined />}
					{text}
				</Space>
			),
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			render: (type: string) => {
				const typeMap: Record<string, { label: string; color: string }> = {
					local: { label: "本地认证", color: "blue" },
					wechat_work: { label: "企业微信", color: "green" },
					dingtalk: { label: "钉钉", color: "orange" },
					oauth: { label: "OAuth2", color: "purple" },
				};
				const config = typeMap[type] || { label: type, color: "default" };
				return <Tag color={config.color}>{config.label}</Tag>;
			},
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string) => (
				<Tag color={status === "enabled" ? "success" : "default"}>
					{status === "enabled" ? "已启用" : "已禁用"}
				</Tag>
			),
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: AuthProvider) => (
				<Space>
					<Button
						type="link"
						size="small"
						icon={<EditOutlined />}
						onClick={() => handleEditProvider(record)}
					>
						编辑
					</Button>
					{record.type !== "local" && (
						<Button
							type="link"
							size="small"
							danger
							icon={<DeleteOutlined />}
							onClick={() => handleDeleteProvider(record.id)}
						>
							删除
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">登录认证</h1>
				<p className="text-gray-600">配置系统登录方式和第三方认证</p>
			</div>

			<Tabs defaultActiveKey="basic">
				<TabPane tab="基础配置" key="basic">
					<Card>
						<Form
							form={form}
							layout="vertical"
							onFinish={handleSave}
							initialValues={{
								sessionTimeout: 720,
								passwordStrength: "medium",
								multiLogin: false,
								rememberLogin: true,
								captchaEnabled: true,
								loginAttempts: 5,
							}}
						>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										label="会话超时时间"
										name="sessionTimeout"
										rules={[{ required: true, message: "请输入会话超时时间" }]}
									>
										<Input addonAfter="分钟" placeholder="请输入会话超时时间" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="密码强度要求"
										name="passwordStrength"
										rules={[{ required: true, message: "请选择密码强度要求" }]}
									>
										<Select placeholder="请选择密码强度要求">
											<Option value="low">低 - 仅要求6位以上</Option>
											<Option value="medium">中 - 字母+数字，8位以上</Option>
											<Option value="high">
												高 - 字母+数字+符号，10位以上
											</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										label="登录失败次数限制"
										name="loginAttempts"
										rules={[
											{ required: true, message: "请输入登录失败次数限制" },
										]}
									>
										<Input placeholder="请输入登录失败次数限制" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="功能开关" name="switches">
										<Space direction="vertical" className="w-full">
											<Form.Item
												name="multiLogin"
												valuePropName="checked"
												noStyle
											>
												<Switch
													checkedChildren="开启"
													unCheckedChildren="关闭"
												/>
												<span className="ml-2">允许多地登录</span>
											</Form.Item>
											<Form.Item
												name="rememberLogin"
												valuePropName="checked"
												noStyle
											>
												<Switch
													checkedChildren="开启"
													unCheckedChildren="关闭"
												/>
												<span className="ml-2">记住登录状态</span>
											</Form.Item>
											<Form.Item
												name="captchaEnabled"
												valuePropName="checked"
												noStyle
											>
												<Switch
													checkedChildren="开启"
													unCheckedChildren="关闭"
												/>
												<span className="ml-2">启用验证码</span>
											</Form.Item>
										</Space>
									</Form.Item>
								</Col>
							</Row>

							<Divider />

							<Form.Item>
								<Space>
									<Button
										type="primary"
										htmlType="submit"
										icon={<SaveOutlined />}
										loading={loading}
									>
										保存配置
									</Button>
								</Space>
							</Form.Item>
						</Form>
					</Card>
				</TabPane>

				<TabPane tab="第三方认证" key="providers">
					<Card>
						<div className="mb-4">
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={handleAddProvider}
							>
								添加认证提供方
							</Button>
						</div>

						<Table
							columns={providerColumns}
							dataSource={providers}
							rowKey="id"
							pagination={false}
						/>
					</Card>
				</TabPane>
			</Tabs>

			<Modal
				title={editingProvider ? "编辑认证提供方" : "添加认证提供方"}
				open={modalVisible}
				onOk={handleModalOk}
				onCancel={() => setModalVisible(false)}
				width={600}
			>
				<Form form={providerForm} layout="vertical">
					<Form.Item
						label="名称"
						name="name"
						rules={[{ required: true, message: "请输入名称" }]}
					>
						<Input placeholder="请输入认证提供方名称" />
					</Form.Item>

					<Form.Item
						label="类型"
						name="type"
						rules={[{ required: true, message: "请选择类型" }]}
					>
						<Select placeholder="请选择认证类型">
							<Option value="oauth">OAuth2</Option>
							<Option value="wechat_work">企业微信</Option>
							<Option value="dingtalk">钉钉</Option>
							<Option value="ldap">LDAP</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="状态"
						name="status"
						rules={[{ required: true, message: "请选择状态" }]}
					>
						<Select placeholder="请选择状态">
							<Option value="enabled">启用</Option>
							<Option value="disabled">禁用</Option>
						</Select>
					</Form.Item>

					<Form.Item label="描述" name="description">
						<TextArea rows={3} placeholder="请输入描述信息" />
					</Form.Item>

					<Divider>配置参数</Divider>

					<Form.Item
						label="客户端ID"
						name={["config", "clientId"]}
						rules={[{ required: true, message: "请输入客户端ID" }]}
					>
						<Input placeholder="请输入客户端ID" />
					</Form.Item>

					<Form.Item
						label="客户端密钥"
						name={["config", "clientSecret"]}
						rules={[{ required: true, message: "请输入客户端密钥" }]}
					>
						<Input.Password placeholder="请输入客户端密钥" />
					</Form.Item>

					<Form.Item label="授权地址" name={["config", "authUrl"]}>
						<Input placeholder="请输入授权地址" />
					</Form.Item>

					<Form.Item label="令牌地址" name={["config", "tokenUrl"]}>
						<Input placeholder="请输入令牌地址" />
					</Form.Item>

					<Form.Item label="用户信息地址" name={["config", "userInfoUrl"]}>
						<Input placeholder="请输入用户信息地址" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AuthSettings;
