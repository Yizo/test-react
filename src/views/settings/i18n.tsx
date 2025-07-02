import {
	Card,
	Form,
	Select,
	Switch,
	Button,
	Table,
	Space,
	Modal,
	Input,
	message,
	Row,
	Col,
	Divider,
} from "antd";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	SaveOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

interface Language {
	code: string;
	name: string;
	englishName: string;
	flag: string;
	status: "active" | "inactive";
	progress: number;
	lastUpdate: string;
}

const I18nSettings = () => {
	const [form] = Form.useForm();
	const [langForm] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [languages, setLanguages] = useState<Language[]>([
		{
			code: "zh-CN",
			name: "简体中文",
			englishName: "Simplified Chinese",
			flag: "🇨🇳",
			status: "active",
			progress: 100,
			lastUpdate: "2024-01-15",
		},
		{
			code: "en-US",
			name: "English",
			englishName: "English (US)",
			flag: "🇺🇸",
			status: "active",
			progress: 95,
			lastUpdate: "2024-01-10",
		},
		{
			code: "ja-JP",
			name: "日本語",
			englishName: "Japanese",
			flag: "🇯🇵",
			status: "inactive",
			progress: 60,
			lastUpdate: "2024-01-05",
		},
	]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingLang, setEditingLang] = useState<Language | null>(null);

	const handleSave = async (values: any) => {
		setLoading(true);
		try {
			console.log("保存国际化配置:", values);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			message.success("国际化设置保存成功");
		} catch (error) {
			message.error("保存失败");
		} finally {
			setLoading(false);
		}
	};

	const handleAddLanguage = () => {
		setEditingLang(null);
		langForm.resetFields();
		setIsModalVisible(true);
	};

	const handleEditLanguage = (lang: Language) => {
		setEditingLang(lang);
		langForm.setFieldsValue(lang);
		setIsModalVisible(true);
	};

	const handleDeleteLanguage = (code: string) => {
		Modal.confirm({
			title: "删除语言",
			content: "确定要删除这个语言包吗？删除后不可恢复。",
			onOk: () => {
				setLanguages(languages.filter((lang) => lang.code !== code));
				message.success("语言包删除成功");
			},
		});
	};

	const handleModalOk = () => {
		langForm.validateFields().then((values) => {
			if (editingLang) {
				setLanguages(
					languages.map((lang) =>
						lang.code === editingLang.code ? { ...lang, ...values } : lang
					)
				);
				message.success("语言包更新成功");
			} else {
				const newLang: Language = {
					...values,
					progress: 0,
					lastUpdate: new Date().toISOString().split("T")[0],
				};
				setLanguages([...languages, newLang]);
				message.success("语言包添加成功");
			}
			setIsModalVisible(false);
		});
	};

	const columns = [
		{
			title: "语言",
			key: "language",
			render: (record: Language) => (
				<Space>
					<span className="text-xl">{record.flag}</span>
					<div>
						<div className="font-medium">{record.name}</div>
						<div className="text-sm text-gray-500">{record.englishName}</div>
					</div>
				</Space>
			),
		},
		{
			title: "语言代码",
			dataIndex: "code",
			key: "code",
			render: (code: string) => <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>,
		},
		{
			title: "翻译进度",
			dataIndex: "progress",
			key: "progress",
			render: (progress: number) => (
				<div className="flex items-center space-x-2">
					<div className="w-20 bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-500 h-2 rounded-full"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<span className="text-sm">{progress}%</span>
				</div>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string) => (
				<span
					className={`px-2 py-1 rounded-full text-xs ${
						status === "active"
							? "bg-green-100 text-green-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{status === "active" ? "启用" : "禁用"}
				</span>
			),
		},
		{
			title: "最后更新",
			dataIndex: "lastUpdate",
			key: "lastUpdate",
		},
		{
			title: "操作",
			key: "action",
			render: (record: Language) => (
				<Space>
					<Button
						size="small"
						icon={<EditOutlined />}
						onClick={() => handleEditLanguage(record)}
					>
						编辑
					</Button>
					<Button
						size="small"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDeleteLanguage(record.code)}
						disabled={record.code === "zh-CN"}
					>
						删除
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
					<GlobalOutlined />
					国际化设置
				</h1>
				<p className="text-gray-600">管理多语言支持和本地化配置</p>
			</div>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={8}>
					<Card title="基础配置">
						<Form
							form={form}
							layout="vertical"
							onFinish={handleSave}
							initialValues={{
								defaultLanguage: "zh-CN",
								enableI18n: true,
								autoDetect: true,
								fallbackLanguage: "en-US",
								dateFormat: "YYYY-MM-DD",
								timeFormat: "24h",
								timezone: "Asia/Shanghai",
							}}
						>
							<Form.Item
								label="默认语言"
								name="defaultLanguage"
								rules={[{ required: true, message: "请选择默认语言" }]}
							>
								<Select>
									{languages.map((lang) => (
										<Option key={lang.code} value={lang.code}>
											{lang.flag} {lang.name}
										</Option>
									))}
								</Select>
							</Form.Item>

							<Form.Item label="启用国际化" name="enableI18n" valuePropName="checked">
								<Switch />
							</Form.Item>

							<Form.Item
								label="自动检测用户语言"
								name="autoDetect"
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>

							<Form.Item label="后备语言" name="fallbackLanguage">
								<Select>
									{languages.map((lang) => (
										<Option key={lang.code} value={lang.code}>
											{lang.flag} {lang.name}
										</Option>
									))}
								</Select>
							</Form.Item>

							<Divider />

							<Form.Item label="日期格式" name="dateFormat">
								<Select>
									<Option value="YYYY-MM-DD">2024-01-15</Option>
									<Option value="MM/DD/YYYY">01/15/2024</Option>
									<Option value="DD/MM/YYYY">15/01/2024</Option>
									<Option value="YYYY年MM月DD日">2024年01月15日</Option>
								</Select>
							</Form.Item>

							<Form.Item label="时间格式" name="timeFormat">
								<Select>
									<Option value="24h">24小时制</Option>
									<Option value="12h">12小时制</Option>
								</Select>
							</Form.Item>

							<Form.Item label="时区" name="timezone">
								<Select>
									<Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
									<Option value="America/New_York">
										America/New_York (UTC-5)
									</Option>
									<Option value="Europe/London">Europe/London (UTC+0)</Option>
									<Option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</Option>
								</Select>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									icon={<SaveOutlined />}
									block
								>
									保存设置
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>

				<Col xs={24} lg={16}>
					<Card
						title="语言管理"
						extra={
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={handleAddLanguage}
							>
								添加语言
							</Button>
						}
					>
						<Table
							columns={columns}
							dataSource={languages}
							rowKey="code"
							pagination={false}
						/>
					</Card>
				</Col>
			</Row>

			<Modal
				title={editingLang ? "编辑语言" : "添加语言"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={langForm} layout="vertical">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label="语言代码"
								name="code"
								rules={[{ required: true, message: "请输入语言代码" }]}
							>
								<Input placeholder="如：zh-CN" disabled={!!editingLang} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="语言旗帜"
								name="flag"
								rules={[{ required: true, message: "请输入表情符号" }]}
							>
								<Input placeholder="如：🇨🇳" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label="本地名称"
								name="name"
								rules={[{ required: true, message: "请输入本地名称" }]}
							>
								<Input placeholder="如：简体中文" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="英文名称"
								name="englishName"
								rules={[{ required: true, message: "请输入英文名称" }]}
							>
								<Input placeholder="如：Simplified Chinese" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item label="状态" name="status" initialValue="active">
						<Select>
							<Option value="active">启用</Option>
							<Option value="inactive">禁用</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default I18nSettings;
