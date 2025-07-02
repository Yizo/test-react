import React, { useState, useEffect } from "react";
import {
	Card,
	Form,
	Input,
	Switch,
	Button,
	Select,
	InputNumber,
	message,
	Divider,
	Space,
	Modal,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

interface PluginConfig {
	id: string;
	name: string;
	description: string;
	version: string;
	enabled: boolean;
	settings: Record<string, any>;
	schema: ConfigSchema[];
}

interface ConfigSchema {
	key: string;
	label: string;
	type: "string" | "number" | "boolean" | "select" | "textarea";
	required?: boolean;
	options?: Array<{ label: string; value: any }>;
	placeholder?: string;
	description?: string;
	defaultValue?: any;
}

const PluginConfigPage: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [pluginConfig, setPluginConfig] = useState<PluginConfig | null>(null);

	// 模拟插件配置数据
	useEffect(() => {
		const mockPluginConfig: PluginConfig = {
			id: id || "1",
			name: "错误监控增强插件",
			description: "提供更详细的错误监控和分析功能，包括错误分类、趋势分析、自动建议等",
			version: "1.2.0",
			enabled: true,
			settings: {
				enableAutoClassify: true,
				maxErrorCount: 1000,
				reportInterval: 60,
				alertThreshold: 10,
				enableTrendAnalysis: true,
				apiEndpoint: "https://api.example.com/errors",
				apiKey: "your-api-key-here",
				customRules: 'error.type === "TypeError" && error.stack.includes("null")',
			},
			schema: [
				{
					key: "enableAutoClassify",
					label: "启用自动分类",
					type: "boolean",
					description: "自动对错误进行分类和聚合",
					defaultValue: true,
				},
				{
					key: "maxErrorCount",
					label: "最大错误数量",
					type: "number",
					required: true,
					description: "单次上报的最大错误数量限制",
					defaultValue: 1000,
				},
				{
					key: "reportInterval",
					label: "上报间隔(秒)",
					type: "number",
					required: true,
					description: "错误数据上报的时间间隔",
					defaultValue: 60,
				},
				{
					key: "alertThreshold",
					label: "告警阈值",
					type: "number",
					required: true,
					description: "触发告警的错误数量阈值",
					defaultValue: 10,
				},
				{
					key: "enableTrendAnalysis",
					label: "启用趋势分析",
					type: "boolean",
					description: "启用错误趋势分析功能",
					defaultValue: true,
				},
				{
					key: "apiEndpoint",
					label: "API端点",
					type: "string",
					required: true,
					placeholder: "请输入API端点地址",
					description: "外部API服务的端点地址",
				},
				{
					key: "apiKey",
					label: "API密钥",
					type: "string",
					required: true,
					placeholder: "请输入API密钥",
					description: "API访问密钥",
				},
				{
					key: "customRules",
					label: "自定义规则",
					type: "textarea",
					placeholder: "请输入自定义的错误处理规则",
					description: "使用JavaScript表达式定义自定义错误处理规则",
				},
			],
		};

		setPluginConfig(mockPluginConfig);
		form.setFieldsValue(mockPluginConfig.settings);
	}, [id, form]);

	const handleSave = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();

			// 这里调用保存配置的API
			console.log("保存插件配置:", values);

			if (pluginConfig) {
				setPluginConfig({
					...pluginConfig,
					settings: values,
				});
			}

			message.success("配置保存成功");
		} catch (error) {
			console.error("保存失败:", error);
			message.error("配置保存失败");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		Modal.confirm({
			title: "确认重置",
			content: "确定要重置所有配置为默认值吗？此操作不可恢复。",
			okText: "确认重置",
			cancelText: "取消",
			onOk: () => {
				if (pluginConfig) {
					const defaultSettings: Record<string, any> = {};
					pluginConfig.schema.forEach((item) => {
						if (item.defaultValue !== undefined) {
							defaultSettings[item.key] = item.defaultValue;
						}
					});
					form.setFieldsValue(defaultSettings);
					message.success("配置已重置为默认值");
				}
			},
		});
	};

	const handleTogglePlugin = async (enabled: boolean) => {
		try {
			setLoading(true);
			// 这里调用启用/禁用插件的API
			console.log("切换插件状态:", enabled);

			if (pluginConfig) {
				setPluginConfig({
					...pluginConfig,
					enabled,
				});
			}

			message.success(`插件已${enabled ? "启用" : "禁用"}`);
		} catch (error) {
			console.error("操作失败:", error);
			message.error("操作失败");
		} finally {
			setLoading(false);
		}
	};

	const renderFormItem = (schema: ConfigSchema) => {
		const commonProps = {
			name: schema.key,
			label: schema.label,
			rules: schema.required
				? [{ required: true, message: `请输入${schema.label}` }]
				: undefined,
			extra: schema.description,
		};

		switch (schema.type) {
			case "boolean":
				return (
					<Form.Item {...commonProps} valuePropName="checked">
						<Switch />
					</Form.Item>
				);

			case "number":
				return (
					<Form.Item {...commonProps}>
						<InputNumber style={{ width: "100%" }} placeholder={schema.placeholder} />
					</Form.Item>
				);

			case "select":
				return (
					<Form.Item {...commonProps}>
						<Select placeholder={schema.placeholder}>
							{schema.options?.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
					</Form.Item>
				);

			case "textarea":
				return (
					<Form.Item {...commonProps}>
						<TextArea rows={4} placeholder={schema.placeholder} />
					</Form.Item>
				);

			default:
				return (
					<Form.Item {...commonProps}>
						<Input placeholder={schema.placeholder} />
					</Form.Item>
				);
		}
	};

	if (!pluginConfig) {
		return <div>加载中...</div>;
	}

	return (
		<div className="plugin-config-page">
			<Card>
				<div className="page-header" style={{ marginBottom: 24 }}>
					<Space>
						<Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/plugins")}>
							返回插件市场
						</Button>
					</Space>

					<div style={{ marginTop: 16 }}>
						<h2>{pluginConfig.name}</h2>
						<p style={{ color: "#666", marginBottom: 8 }}>{pluginConfig.description}</p>
						<Space>
							<span>版本: {pluginConfig.version}</span>
							<Switch
								checked={pluginConfig.enabled}
								onChange={handleTogglePlugin}
								loading={loading}
								checkedChildren="启用"
								unCheckedChildren="禁用"
							/>
						</Space>
					</div>
				</div>

				<Divider />

				<Form form={form} layout="vertical" disabled={!pluginConfig.enabled}>
					<div className="config-form">
						{pluginConfig.schema.map((schema) => (
							<div key={schema.key}>{renderFormItem(schema)}</div>
						))}
					</div>

					<Divider />

					<div className="form-actions">
						<Space>
							<Button
								type="primary"
								icon={<SaveOutlined />}
								onClick={handleSave}
								loading={loading}
								disabled={!pluginConfig.enabled}
							>
								保存配置
							</Button>
							<Button
								icon={<ReloadOutlined />}
								onClick={handleReset}
								disabled={!pluginConfig.enabled}
							>
								重置为默认值
							</Button>
						</Space>
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default PluginConfigPage;
